const Wishlist = require('../models/Wishlist');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ user: req.user.id })
            .populate('listing')
            .sort({ createdAt: -1 });
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { listingId, collection, notes } = req.body;

        const wishlistItem = new Wishlist({
            user: req.user.id,
            listing: listingId,
            collection: collection || 'My Favorites',
            notes: notes || ''
        });

        await wishlistItem.save();
        const populated = await Wishlist.findById(wishlistItem._id).populate('listing');
        res.status(201).json(populated);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Already in wishlist' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        await Wishlist.findOneAndDelete({
            user: req.user.id,
            listing: req.params.listingId
        });
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check if listing is in wishlist
exports.checkWishlist = async (req, res) => {
    try {
        const item = await Wishlist.findOne({
            user: req.user.id,
            listing: req.params.listingId
        });
        res.json({ inWishlist: !!item });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update wishlist item
exports.updateWishlistItem = async (req, res) => {
    try {
        const { collection, notes, priceAlert, availabilityAlert } = req.body;

        const updateData = {};
        if (collection) updateData.collection = collection;
        if (notes !== undefined) updateData.notes = notes;
        if (priceAlert) updateData.priceAlert = priceAlert;
        if (availabilityAlert) updateData.availabilityAlert = availabilityAlert;

        const item = await Wishlist.findOneAndUpdate(
            { user: req.user.id, listing: req.params.listingId },
            { $set: updateData },
            { new: true }
        ).populate('listing');

        if (!item) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
