const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    // Coupon Details
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, required: true },

    // Discount
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    maxDiscount: { type: Number, default: 0 }, // Max discount for percentage type

    // Conditions
    minPurchase: { type: Number, default: 0 },
    maxPurchase: { type: Number, default: 0 },

    // Applicability
    applicableFor: {
        type: String,
        enum: ['all', 'hotel', 'flight', 'activity', 'package'],
        default: 'all'
    },

    specificListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],

    // User Restrictions
    userType: { type: String, enum: ['all', 'new', 'existing'], default: 'all' },
    specificUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usagePerUser: { type: Number, default: 1 },

    // Validity
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },

    // Status
    isActive: { type: Boolean, default: true },

    // Statistics
    timesUsed: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ isActive: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
