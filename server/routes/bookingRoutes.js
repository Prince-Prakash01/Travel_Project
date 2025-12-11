const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, cancelBooking } = require('../controllers/bookingController');
// Middleware to check auth should be added here
// const auth = require('../middleware/auth');

router.post('/new', createBooking);
router.get('/user/:userId', getUserBookings);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
