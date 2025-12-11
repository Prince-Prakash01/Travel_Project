const express = require('express');
const router = express.Router();
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.get('/:listingId', getReviews);
router.post('/:listingId', auth, addReview);
router.delete('/:id', auth, deleteReview);

module.exports = router;
