require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dreamroute')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/safety', require('./routes/safetyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/deals', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.send('DreamRoute API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
