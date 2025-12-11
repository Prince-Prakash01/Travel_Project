const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Basic Information
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile Information
    profilePicture: { type: String, default: '' },
    phone: { type: String, default: '' },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },

    // Address Information
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        country: { type: String, default: '' },
        postalCode: { type: String, default: '' }
    },

    // Travel Documents
    passport: {
        number: { type: String, default: '' },
        expiryDate: { type: Date },
        country: { type: String, default: '' }
    },

    // Preferences
    preferences: {
        currency: { type: String, default: 'USD' },
        language: { type: String, default: 'en' },
        newsletter: { type: Boolean, default: true },
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            push: { type: Boolean, default: true }
        }
    },

    // Loyalty & Rewards
    loyaltyPoints: { type: Number, default: 0 },
    membershipTier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },

    // Account Status
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'admin', 'host'], default: 'user' },

    // Password Reset
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpires: { type: Date },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date }
});

// Index for faster queries
// userSchema.index({ email: 1 }); // Redundant with unique: true
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
