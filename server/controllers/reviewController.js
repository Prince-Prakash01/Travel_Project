const Review = require('../models/Review');
const Listing = require('../models/Listing');

// Get reviews for a listing
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ listing: req.params.listingId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a review
exports.addReview = async (req, res) => {
    try {
        const { overallRating, comment } = req.body;
        const review = new Review({
            user: req.user.id,
            listing: req.params.listingId,
            overallRating,
            comment
        });
        await review.save();

        // Update listing's average rating
        const reviews = await Review.find({ listing: req.params.listingId });
        const avgRating = reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length;
        await Listing.findByIdAndUpdate(req.params.listingId, {
            rating: avgRating.toFixed(1),
            reviewsCount: reviews.length
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await review.deleteOne();
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
