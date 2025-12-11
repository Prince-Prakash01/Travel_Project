const express = require('express');
const router = express.Router();
const { getSafetyScore } = require('../controllers/safetyController');

router.get('/score/:location', getSafetyScore);

module.exports = router;
