const Media = require("../models/Media");
const { cloudinary } = require("../utils/upload");
const archiver = require("archiver");
const path = require("path");
const fs = require("fs");
const https = require("https");

// Cloudinary configuration for server-side usage
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload media file
const uploadMedia = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        message: "Please select a file to upload" 
      });
    }

    const { title, description, tags, isShared } = req.body;

    // Validation
    if (!title) {
      // If upload failed, clean up Cloudinary file
      if (req.file.public_id) {
        await cloudinary.uploader.destroy(req.file.public_id);
      }
      return res.status(400).json({ 
        message: "Title is required" 
      });
    }

    // Parse tags (if sent as string)
    let parsedTags = [];
    if (tags) {
      parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
    }

    // Create media document
    const media = new Media({
      title,
      description: description || '',
      tags: parsedTags,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      cloudinaryUrl: req.file.path,
      cloudinaryPublicId: req.file.public_id,
      uploadedBy: req.user._id,
      isShared: isShared === 'true' || isShared === true
    });

    await media.save();

    // Populate user info for response
    await media.populate('uploadedBy', 'name email');

    res.status(201).json({
      message: "Media uploaded successfully!",
      media
    });

  } catch (error) {
    console.error("Upload error:", error);
    
    // Clean up Cloudinary file if database save failed
    if (req.file && req.file.public_id) {
      try {
        await cloudinary.uploader.destroy(req.file.public_id);
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    }

    res.status(500).json({ 
      message: "Server error during file upload" 
    });
  }
};

// Get all media with search, filter, and pagination
const getAllMedia = async (req, res) => {
  try {
    const { 
      search, 
      tags, 
      page = 1, 
      limit = 12, 
      sortBy = 'createdAt', 
      order = 'desc',
      shared = false 
    } = req.query;

    // Build query
    let query = {};
    
    // Show user's own media or shared media
    if (shared === 'true') {
      query.isShared = true;
    } else {
      query.uploadedBy = req.user._id;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    // Execute query
    const media = await Media.find(query)
      .populate('uploadedBy', 'name email avatar')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    // Get total count for pagination
    const total = await Media.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    // Get unique tags for filter options
    const allTags = await Media.aggregate([
      { $match: { uploadedBy: req.user._id } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags' } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      media,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      availableTags: allTags.map(tag => tag._id),
      filters: { search, tags, shared }
    });

  } catch (error) {
    console.error("Get media error:", error);
    res.status(500).json({ 
      message: "Server error while fetching media" 
    });
  }
};

// Get specific media by ID
const getMediaById = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id)
      .populate('uploadedBy', 'name email avatar');

    if (!media) {
      return res.status(404).json({ 
        message: "Media not found" 
      });
    }

    // Check permissions (owner or shared media)
    if (media.uploadedBy._id.toString() !== req.user._id.toString() && !media.isShared) {
      return res.status(403).json({ 
        message: "Access denied to this media" 
      });
    }

    res.json({ media });

  } catch (error) {
    console.error("Get media by ID error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: "Invalid media ID format" 
      });
    }

    res.status(500).json({ 
      message: "Server error while fetching media" 
    });
  }
};

// Update media metadata
const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, isShared } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ 
        message: "Title is required" 
      });
    }

    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({ 
        message: "Media not found" 
      });
    }

    // Check ownership
    if (media.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: "You can only update your own media" 
      });
    }

    // Parse tags
    let parsedTags = [];
    if (tags) {
      parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
    }

    // Update media
    media.title = title;
    media.description = description || '';
    media.tags = parsedTags;
    media.isShared = isShared === 'true' || isShared === true;

    await media.save();
    await media.populate('uploadedBy', 'name email avatar');

    res.json({
      message: "Media updated successfully!",
      media
    });

  } catch (error) {
    console.error("Update media error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: "Invalid media ID format" 
      });
    }

    res.status(500).json({ 
      message: "Server error while updating media" 
    });
  }
};

// Delete media
const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({ 
        message: "Media not found" 
      });
    }

    // Check ownership
    if (media.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: "You can only delete your own media" 
      });
    }

    // Delete from Cloudinary
    if (media.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(media.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete from database
    await Media.findByIdAndDelete(id);

    res.json({
      message: "Media deleted successfully!"
    });

  } catch (error) {
    console.error("Delete media error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: "Invalid media ID format" 
      });
    }

    res.status(500).json({ 
      message: "Server error while deleting media" 
    });
  }
};

// Download selected media as ZIP
const downloadZip = async (req, res) => {
  try {
    const { mediaIds } = req.body;

    if (!mediaIds || !Array.isArray(mediaIds) || mediaIds.length === 0) {
      return res.status(400).json({ 
        message: "Please provide an array of media IDs" 
      });
    }

    // Find media files belonging to user
    const mediaFiles = await Media.find({
      _id: { $in: mediaIds },
      $or: [
        { uploadedBy: req.user._id },
        { isShared: true }
      ]
    });

    if (mediaFiles.length === 0) {
      return res.status(404).json({ 
        message: "No accessible media found with provided IDs" 
      });
    }

    // Set response headers for ZIP download
    const zipName = `media-gallery-${Date.now()}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Handle archive errors
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error creating ZIP file' });
      }
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add files to archive
    let addedFiles = 0;
    const totalFiles = mediaFiles.length;

    for (const media of mediaFiles) {
      try {
        // Download file from Cloudinary
        const response = await fetch(media.cloudinaryUrl);
        if (!response.ok) {
          console.error(`Failed to fetch ${media.title}: ${response.statusText}`);
          continue;
        }

        const buffer = await response.arrayBuffer();
        const fileExtension = path.extname(media.originalName) || '.jpg';
        const fileName = `${media.title.replace(/[^a-zA-Z0-9]/g, '_')}${fileExtension}`;

        // Add file to archive
        archive.append(Buffer.from(buffer), { name: fileName });
        addedFiles++;

      } catch (fileError) {
        console.error(`Error processing file ${media.title}:`, fileError);
        continue;
      }
    }

    if (addedFiles === 0) {
      archive.destroy();
      return res.status(500).json({ 
        message: "Failed to process any files for ZIP creation" 
      });
    }

    // Finalize archive
    await archive.finalize();

  } catch (error) {
    console.error("ZIP download error:", error);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        message: "Server error during ZIP creation" 
      });
    }
  }
};

module.exports = {
    uploadMedia,
    getAllMedia,
    getMediaById,
    updateMedia,
    deleteMedia,
    downloadZip,
}
