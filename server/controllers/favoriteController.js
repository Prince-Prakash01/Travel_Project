const Favorite = require('../models/Favorite');

// Get user's favorites
exports.getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user.id })
            .populate('listingId')
            .sort({ createdAt: -1 });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add to favorites
exports.addFavorite = async (req, res) => {
    try {
        const { listingId } = req.body;
        const favorite = new Favorite({
            userId: req.user.id,
            listingId
        });
        await favorite.save();
        res.status(201).json(favorite);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Already in favorites' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Remove from favorites
exports.removeFavorite = async (req, res) => {
    try {
        await Favorite.findOneAndDelete({
            userId: req.user.id,
            listingId: req.params.listingId
        });
        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check if listing is favorited
exports.checkFavorite = async (req, res) => {
    try {
        const favorite = await Favorite.findOne({
            userId: req.user.id,
            listingId: req.params.listingId
        });
        res.json({ isFavorite: !!favorite });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
