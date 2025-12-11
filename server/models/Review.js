const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    // References
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },

    // Rating
    overallRating: { type: Number, required: true, min: 1, max: 5 },

    // Category Ratings
    categoryRatings: {
        cleanliness: { type: Number, min: 1, max: 5, default: 0 },
        location: { type: Number, min: 1, max: 5, default: 0 },
        service: { type: Number, min: 1, max: 5, default: 0 },
        value: { type: Number, min: 1, max: 5, default: 0 },
        facilities: { type: Number, min: 1, max: 5, default: 0 }
    },

    // Review Content
    title: { type: String, default: '' },
    comment: { type: String, required: true },

    // Media
    photos: [String],

    // Trip Details
    tripType: { type: String, enum: ['solo', 'couple', 'family', 'business', 'friends', ''], default: '' },
    stayDate: { type: Date },

    // Verification
    verified: { type: Boolean, default: false }, // Verified booking

    // Helpful Votes
    helpfulCount: { type: Number, default: 0 },
    notHelpfulCount: { type: Number, default: 0 },

    // Host Response
    hostResponse: {
        comment: { type: String, default: '' },
        respondedAt: { type: Date }
    },

    // Status
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'flagged'], default: 'pending' },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes
reviewSchema.index({ listing: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ overallRating: -1 });

// Update timestamp
reviewSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Review', reviewSchema);
