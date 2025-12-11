const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist, checkWishlist, updateWishlistItem } = require('../controllers/wishlistController');
const auth = require('../middleware/auth');

router.get('/', auth, getWishlist);
router.post('/', auth, addToWishlist);
router.delete('/:listingId', auth, removeFromWishlist);
router.get('/check/:listingId', auth, checkWishlist);
router.put('/:listingId', auth, updateWishlistItem);

module.exports = router;
