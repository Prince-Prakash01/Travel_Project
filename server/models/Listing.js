const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    // Basic Information
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['hotel', 'flight', 'activity', 'package'], required: true },

    // Location Details
    location: {
        address: { type: String, default: '' },
        city: { type: String, required: true },
        state: { type: String, default: '' },
        country: { type: String, required: true },
        postalCode: { type: String, default: '' },
        region: { type: String, default: '' },
        coordinates: {
            lat: Number,
            lng: Number
        },
        distanceFromCenter: { type: Number, default: 0 } // in km
    },

    // Pricing
    price: { type: Number, required: true },
    originalPrice: { type: Number }, // For showing discounts
    currency: { type: String, default: 'USD' },
    pricePerNight: { type: Boolean, default: true },
    taxesIncluded: { type: Boolean, default: false },

    // Availability
    availableStock: { type: Number, default: 10 },
    minStay: { type: Number, default: 1 }, // Minimum nights
    maxStay: { type: Number, default: 30 }, // Maximum nights
    instantBooking: { type: Boolean, default: false },

    // Hotel Specific
    hotelDetails: {
        starRating: { type: Number, min: 1, max: 5 },
        checkInTime: { type: String, default: '14:00' },
        checkOutTime: { type: String, default: '11:00' },
        propertyType: { type: String, enum: ['hotel', 'resort', 'apartment', 'villa', 'hostel', 'guesthouse', ''], default: '' },
        totalRooms: { type: Number, default: 0 },
        floors: { type: Number, default: 0 },
        yearBuilt: { type: Number },
        lastRenovated: { type: Number }
    },

    // Flight Specific
    flightDetails: {
        airline: { type: String, default: '' },
        flightNumber: { type: String, default: '' },
        departure: {
            airport: { type: String, default: '' },
            time: { type: String, default: '' },
            terminal: { type: String, default: '' }
        },
        arrival: {
            airport: { type: String, default: '' },
            time: { type: String, default: '' },
            terminal: { type: String, default: '' }
        },
        duration: { type: String, default: '' }, // e.g., "2h 30m"
        stops: { type: Number, default: 0 },
        class: { type: String, enum: ['economy', 'premium-economy', 'business', 'first', ''], default: 'economy' },
        baggage: {
            cabin: { type: String, default: '7kg' },
            checked: { type: String, default: '20kg' }
        }
    },

    // Activity Specific
    activityDetails: {
        duration: { type: String, default: '' }, // e.g., "3 hours"
        difficulty: { type: String, enum: ['easy', 'moderate', 'hard', ''], default: '' },
        category: { type: String, default: '' }, // e.g., "Adventure", "Cultural"
        groupSize: { type: Number, default: 0 },
        languages: [String], // Languages offered
        includes: [String], // What's included
        excludes: [String] // What's not included
    },

    // Amenities & Features
    amenities: [String],
    features: [String],

    // Policies
    cancellationPolicy: {
        type: { type: String, enum: ['flexible', 'moderate', 'strict', 'non-refundable'], default: 'moderate' },
        description: { type: String, default: '' },
        refundPercentage: { type: Number, default: 100 },
        daysBeforeCheckIn: { type: Number, default: 7 }
    },

    houseRules: [String],

    // Media
    images: [String],
    videos: [String],
    virtualTour: { type: String, default: '' },

    // Ratings & Reviews
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    categoryRatings: {
        cleanliness: { type: Number, default: 0 },
        location: { type: Number, default: 0 },
        service: { type: Number, default: 0 },
        value: { type: Number, default: 0 },
        facilities: { type: Number, default: 0 }
    },

    // Host/Provider Information
    host: {
        name: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        responseTime: { type: String, default: '' },
        responseRate: { type: Number, default: 0 }
    },

    // Status & Visibility
    status: { type: String, enum: ['active', 'inactive', 'pending', 'suspended'], default: 'active' },
    featured: { type: Boolean, default: false },
    promoted: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },

    // SEO
    slug: { type: String, unique: true, sparse: true },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },

    // Statistics
    views: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes for faster queries
listingSchema.index({ type: 1, 'location.city': 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ rating: -1 });
listingSchema.index({ featured: -1, createdAt: -1 });
listingSchema.index({ slug: 1 });

// Update timestamp on save
// listingSchema.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

module.exports = mongoose.model('Listing', listingSchema);
