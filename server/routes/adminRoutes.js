const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password -resetPasswordOTP -resetPasswordOTPExpires').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Approve user (verify user)
router.put('/users/:id/approve', auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isVerified: true },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User approved successfully', user });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add package (listing)
router.post('/packages', auth, isAdmin, async (req, res) => {
    try {
        const { title, description, price, location, images, type } = req.body;

        const listing = new Listing({
            title,
            description,
            price,
            location,
            images,
            host: req.user.id,
            type: type || 'hotel',
            amenities: [],
            maxGuests: 2,
            bedrooms: 1,
            bathrooms: 1,
            rating: 0,
            reviews: []
        });

        await listing.save();
        res.status(201).json({ message: 'Package added successfully', listing });
    } catch (error) {
        console.error('Error adding package:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete package (listing)
router.delete('/packages/:id', auth, isAdmin, async (req, res) => {
    try {
        const listing = await Listing.findByIdAndDelete(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Package not found' });
        }

        res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        console.error('Error deleting package:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update package (listing)
router.put('/packages/:id', auth, isAdmin, async (req, res) => {
    try {
        const { title, description, price, location, images, type } = req.body;

        const listing = await Listing.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                price,
                location,
                images,
                type: type || 'hotel'
            },
            { new: true }
        );

        if (!listing) {
            return res.status(404).json({ message: 'Package not found' });
        }

        res.json({ message: 'Package updated successfully', listing });
    } catch (error) {
        console.error('Error updating package:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Deal model (simple in-memory for now, you can create a proper model later)
let deals = [];

// Get all deals
router.get('/deals', async (req, res) => {
    res.json(deals);
});

// Add deal (package-based)
router.post('/deals', auth, isAdmin, async (req, res) => {
    try {
        const { packageId, discount, validUntil } = req.body;

        // Verify package exists
        const packageExists = await Listing.findById(packageId);
        if (!packageExists) {
            return res.status(404).json({ message: 'Package not found' });
        }

        const deal = {
            _id: Date.now().toString(),
            packageId,
            discount,
            validUntil,
            createdAt: new Date()
        };

        deals.push(deal);
        res.status(201).json({ message: 'Deal added successfully', deal });
    } catch (error) {
        console.error('Error adding deal:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update deal
router.put('/deals/:id', auth, isAdmin, async (req, res) => {
    try {
        const { discount, validUntil } = req.body;
        const dealIndex = deals.findIndex(d => d._id === req.params.id);

        if (dealIndex === -1) {
            return res.status(404).json({ message: 'Deal not found' });
        }

        deals[dealIndex] = {
            ...deals[dealIndex],
            discount,
            validUntil
        };

        res.json({ message: 'Deal updated successfully', deal: deals[dealIndex] });
    } catch (error) {
        console.error('Error updating deal:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete deal
router.delete('/deals/:id', auth, isAdmin, async (req, res) => {
    try {
        const dealIndex = deals.findIndex(d => d._id === req.params.id);

        if (dealIndex === -1) {
            return res.status(404).json({ message: 'Deal not found' });
        }

        deals.splice(dealIndex, 1);
        res.json({ message: 'Deal deleted successfully' });
    } catch (error) {
        console.error('Error deleting deal:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
