const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: String,
        tags: [String],
        filename: { 
            type: String, 
            required: true 
        },
        originalName: String,
        mimeType: String,
        size: Number,
        cloudinaryUrl: String,
        cloudinaryPublicId: String,
        uploadedBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true },
        isShared: { 
            type: Boolean, 
            default: false 
        }
    }, 
    { 
        timestamps: true 
    }
);

module.exports = mongoose.model('Media', mediaSchema);