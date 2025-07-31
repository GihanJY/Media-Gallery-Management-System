const Contact = require("../models/Contact");
const User = require("../models/User");
const { validationResult, body } = require("express-validator");

// Validation middleware
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

// Create contact message (Public route)
const createContact = async (req, res) => {
  try {
    // Run validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { name, email, message } = req.body;

    // Create contact message
    const contact = new Contact({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
      userId: req.user ? req.user._id : null // Link to user if authenticated
    });

    await contact.save();

    // Populate user info if userId exists
    if (contact.userId) {
      await contact.populate('userId', 'name email');
    }

    res.status(201).json({
      message: "Your message has been sent successfully! We'll get back to you soon.",
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        createdAt: contact.createdAt,
        user: contact.userId ? {
          id: contact.userId._id,
          name: contact.userId.name,
          email: contact.userId.email
        } : null
      }
    });

  } catch (error) {
    console.error("Create contact error:", error);
    res.status(500).json({ 
      message: "Server error while sending your message. Please try again later." 
    });
  }
};

// Get user's own messages (Authenticated users)
const getUserMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Find messages by user ID or email
    const query = {
      $or: [
        { userId: req.user._id },
        { email: req.user.email }
      ]
    };

    const messages = await Contact.find(query)
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Contact.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      messages: messages.map(msg => ({
        id: msg._id,
        name: msg.name,
        email: msg.email,
        message: msg.message,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        user: msg.userId ? {
          id: msg.userId._id,
          name: msg.userId.name,
          email: msg.userId.email,
          avatar: msg.userId.avatar
        } : null
      })),
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error("Get user messages error:", error);
    res.status(500).json({ 
      message: "Server error while fetching your messages" 
    });
  }
};

// Update user's own message
const updateMessage = async (req, res) => {
  try {
    // Run validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { name, message } = req.body;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ 
        message: "Message not found" 
      });
    }

    // Check ownership - user can only update their own messages
    const isOwner = contact.userId && contact.userId.toString() === req.user._id.toString();
    const isEmailMatch = contact.email === req.user.email;

    if (!isOwner && !isEmailMatch) {
      return res.status(403).json({ 
        message: "You can only update your own messages" 
      });
    }

    // Update message
    contact.name = name ? name.trim() : contact.name;
    contact.message = message ? message.trim() : contact.message;

    await contact.save();
    await contact.populate('userId', 'name email avatar');

    res.json({
      message: "Your message has been updated successfully!",
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
        user: contact.userId ? {
          id: contact.userId._id,
          name: contact.userId.name,
          email: contact.userId.email,
          avatar: contact.userId.avatar
        } : null
      }
    });

  } catch (error) {
    console.error("Update message error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: "Invalid message ID format" 
      });
    }

    res.status(500).json({ 
      message: "Server error while updating your message" 
    });
  }
};

// Delete user's own message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ 
        message: "Message not found" 
      });
    }

    // Check ownership
    const isOwner = contact.userId && contact.userId.toString() === req.user._id.toString();
    const isEmailMatch = contact.email === req.user.email;

    if (!isOwner && !isEmailMatch) {
      return res.status(403).json({ 
        message: "You can only delete your own messages" 
      });
    }

    await Contact.findByIdAndDelete(id);

    res.json({
      message: "Your message has been deleted successfully!"
    });

  } catch (error) {
    console.error("Delete message error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: "Invalid message ID format" 
      });
    }

    res.status(500).json({ 
      message: "Server error while deleting your message" 
    });
  }
};

// Get all messages (Admin only)
const getAllMessages = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      sortBy = 'createdAt', 
      order = 'desc' 
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query for search
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const messages = await Contact.find(query)
      .populate('userId', 'name email avatar role')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    const total = await Contact.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    // Get statistics
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          withUserAccount: { 
            $sum: { $cond: [{ $ne: ["$userId", null] }, 1, 0] } 
          },
          withoutUserAccount: { 
            $sum: { $cond: [{ $eq: ["$userId", null] }, 1, 0] } 
          }
        }
      }
    ]);

    res.json({
      messages: messages.map(msg => ({
        id: msg._id,
        name: msg.name,
        email: msg.email,
        message: msg.message,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        user: msg.userId ? {
          id: msg.userId._id,
          name: msg.userId.name,
          email: msg.userId.email,
          avatar: msg.userId.avatar,
          role: msg.userId.role
        } : null
      })),
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      statistics: stats[0] || {
        totalMessages: 0,
        withUserAccount: 0,
        withoutUserAccount: 0
      },
      filters: { search, sortBy, order }
    });

  } catch (error) {
    console.error("Get all messages error:", error);
    res.status(500).json({ 
      message: "Server error while fetching messages" 
    });
  }
};

// Admin delete any message
const adminDeleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id)
      .populate('userId', 'name email');

    if (!contact) {
      return res.status(404).json({ 
        message: "Message not found" 
      });
    }

    // Store contact info for response
    const deletedContact = {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      message: contact.message.substring(0, 50) + '...',
      createdAt: contact.createdAt,
      user: contact.userId ? {
        name: contact.userId.name,
        email: contact.userId.email
      } : null
    };

    await Contact.findByIdAndDelete(id);

    res.json({
      message: "Message has been deleted successfully!",
      deletedContact
    });

  } catch (error) {
    console.error("Admin delete message error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: "Invalid message ID format" 
      });
    }

    res.status(500).json({ 
      message: "Server error while deleting message" 
    });
  }
};

module.exports = {
  createContact: [contactValidation, createContact],
  getUserMessages,
  updateMessage: [contactValidation, updateMessage],
  deleteMessage,
  getAllMessages,
  adminDeleteMessage,
};