const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Notification Details
    type: {
        type: String,
        enum: ['booking', 'payment', 'review', 'promotion', 'price-alert', 'reminder', 'system'],
        required: true
    },

    title: { type: String, required: true },
    message: { type: String, required: true },

    // Related Data
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // Booking, Listing, etc.
    relatedType: { type: String, enum: ['booking', 'listing', 'review', ''], default: '' },

    // Action
    actionUrl: { type: String, default: '' },
    actionText: { type: String, default: '' },

    // Status
    read: { type: Boolean, default: false },
    readAt: { type: Date },

    // Priority
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date } // Auto-delete old notifications
});

// Indexes
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

module.exports = mongoose.model('Notification', notificationSchema);
