const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        email: { 
            type: String, 
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
        },
        message: { 
            type: String, 
            required: [true, 'Message is required'],
            trim: true,
            minlength: [10, 'Message must be at least 10 characters'],
            maxlength: [1000, 'Message cannot exceed 1000 characters']
        },
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            default: null
        },
        status: {
            type: String,
            enum: ['new', 'read', 'replied', 'archived'],
            default: 'new'
        },
        adminNotes: {
            type: String,
            maxlength: [500, 'Admin notes cannot exceed 500 characters']
        }
    }, 
    { 
        timestamps: true 
    }
);

// Index for better performance
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ userId: 1, createdAt: -1 });
contactSchema.index({ status: 1, createdAt: -1 });

// Instance method to check if user owns this contact
contactSchema.methods.isOwnedBy = function(user) {
    return (this.userId && this.userId.toString() === user._id.toString()) || 
           (this.email === user.email);
};

// Static method to get user's contact count
contactSchema.statics.getUserContactCount = function(userId, email) {
    return this.countDocuments({
        $or: [
            { userId: userId },
            { email: email }
        ]
    });
};

module.exports = mongoose.model('Contact', contactSchema);