const express = require('express');
const router = express.Router();
const { searchListings, getListing } = require('../controllers/listingController');

router.get('/', searchListings);
router.get('/search', searchListings);
router.get('/:id', getListing);

module.exports = router;
