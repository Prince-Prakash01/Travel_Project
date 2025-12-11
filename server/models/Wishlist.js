const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },

    // Collection/Folder
    collection: { type: String, default: 'My Favorites' },

    // Notes
    notes: { type: String, default: '' },

    // Price Alert
    priceAlert: {
        enabled: { type: Boolean, default: false },
        targetPrice: { type: Number, default: 0 },
        notified: { type: Boolean, default: false }
    },

    // Availability Alert
    availabilityAlert: {
        enabled: { type: Boolean, default: false },
        checkIn: { type: Date },
        checkOut: { type: Date },
        notified: { type: Boolean, default: false }
    },

    // Timestamps
    createdAt: { type: Date, default: Date.now }
});

// Indexes
wishlistSchema.index({ user: 1, listing: 1 }, { unique: true });
wishlistSchema.index({ user: 1, collection: 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);
