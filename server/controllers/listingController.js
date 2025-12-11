const Listing = require('../models/Listing');

exports.searchListings = async (req, res) => {
    try {
        const { city, country, minPrice, maxPrice, minRating, amenities, page = 1, limit = 10 } = req.query;
        const query = {};

        if (city) query['location.city'] = { $regex: city, $options: 'i' };
        if (country) query['location.country'] = { $regex: country, $options: 'i' };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (minRating) query.rating = { $gte: Number(minRating) };
        if (amenities) {
            const amenitiesArray = amenities.split(',');
            query.amenities = { $all: amenitiesArray };
        }

        const listings = await Listing.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Listing.countDocuments(query);

        res.json({
            listings,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        res.json(listing);
    } catch (error) {
        res.status(404).json({ message: 'Listing not found' });
    }
};
