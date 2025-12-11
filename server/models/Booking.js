const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    // References
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Allow guest bookings
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },

    // Booking Reference
    bookingReference: { type: String, unique: true, required: true },

    // Dates
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    bookingDate: { type: Date, default: Date.now },

    // Guest Information
    guests: {
        adults: { type: Number, required: true, default: 1 },
        children: { type: Number, default: 0 },
        infants: { type: Number, default: 0 }
    },

    // Guest Details
    primaryGuest: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        country: { type: String, default: '' }
    },

    // Booking Details
    roomType: { type: String, default: '' },
    numberOfRooms: { type: Number, default: 1 },
    seatNumbers: [String], // For flights
    specialRequests: { type: String, default: '' },

    // Add-ons
    addOns: [{
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 1 }
    }],

    // Pricing
    basePrice: { type: Number, required: true },
    taxesAndFees: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'USD' },

    // Payment
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded', 'partially-refunded'], default: 'pending' },
    paymentMethod: { type: String, default: '' },
    paymentId: { type: String, default: '' },
    paidAmount: { type: Number, default: 0 },

    // Status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled', 'no-show', 'completed'],
        default: 'pending'
    },

    // Cancellation
    cancellation: {
        isCancelled: { type: Boolean, default: false },
        cancelledAt: { type: Date },
        cancelledBy: { type: String, enum: ['user', 'host', 'admin', ''], default: '' },
        reason: { type: String, default: '' },
        refundAmount: { type: Number, default: 0 },
        refundStatus: { type: String, enum: ['pending', 'processed', 'rejected', ''], default: '' }
    },

    // Modifications
    modifications: [{
        modifiedAt: { type: Date, default: Date.now },
        field: { type: String },
        oldValue: { type: String },
        newValue: { type: String },
        reason: { type: String }
    }],

    // Communication
    messages: [{
        from: { type: String },
        message: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],

    // Review
    reviewSubmitted: { type: Boolean, default: false },
    review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Generate unique booking reference
bookingSchema.pre('save', async function () {
    if (!this.bookingReference) {
        this.bookingReference = 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    this.updatedAt = Date.now();
});

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
