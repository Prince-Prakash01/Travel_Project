const mongoose = require('mongoose');

const safetyDataSchema = new mongoose.Schema({
    location: {
        city: { type: String, required: true },
        country: { type: String, required: true }
    },
    crimeRate: { type: Number, required: true }, // 0-100, lower is better? Or score? The prompt says "local police data (crime rate)"
    nightlifeSafety: { type: Number, required: true }, // 0-100
    transportAvailability: { type: Number, required: true }, // 0-100
    coordinates: {
        lat: Number,
        lng: Number
    }
});

module.exports = mongoose.model('SafetyData', safetyDataSchema);
