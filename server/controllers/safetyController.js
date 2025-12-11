const SafetyData = require('../models/SafetyData');

exports.getSafetyScore = async (req, res) => {
    try {
        const { location } = req.params; // e.g., "Paris"
        // In a real app, we'd query by coordinates or precise location.
        // Here we'll search by city name for simplicity.

        const data = await SafetyData.findOne({ 'location.city': { $regex: location, $options: 'i' } });

        if (!data) {
            // Return a default or mock score if no data found
            return res.json({
                score: 75,
                details: {
                    crime: 80,
                    nightlife: 70,
                    transport: 75
                },
                coordinates: { lat: 0, lng: 0 },
                message: ' precise data not found, returning estimate'
            });
        }

        // Calculate weighted score
        // 40% crime (inverse, higher crime = lower score), 30% nightlife, 30% transport
        // Assuming data stored as 0-100 where 100 is BEST (safe, good nightlife, good transport)
        // If crimeRate is stored as actual rate (bad), we need to invert it.
        // Let's assume stored values are "Scores" (0-100, 100 is best).

        const score = (data.crimeRate * 0.4) + (data.nightlifeSafety * 0.3) + (data.transportAvailability * 0.3);

        res.json({
            score: Math.round(score),
            details: {
                crime: data.crimeRate,
                nightlife: data.nightlifeSafety,
                transport: data.transportAvailability
            },
            coordinates: data.coordinates
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
