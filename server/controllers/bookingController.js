const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const mongoose = require('mongoose');

exports.createBooking = async (req, res) => {
    try {
        console.log('📝 New booking request received');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        const {
            listingId,
            userId,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            guestDetails,
            paymentDetails
        } = req.body;

        // Validate required fields
        if (!listingId || !checkIn || !checkOut || !totalPrice || !guestDetails) {
            console.log('❌ Missing required fields');
            return res.status(400).json({
                message: 'Missing required booking information',
                required: ['listingId', 'checkIn', 'checkOut', 'totalPrice', 'guestDetails']
            });
        }

        // Validate guest details
        if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
            console.log('❌ Missing guest details');
            return res.status(400).json({
                message: 'Guest details incomplete. Please provide firstName, lastName, email, and phone.'
            });
        }

        console.log('✓ All required fields present');

        // 1. Check if listing exists
        console.log('🔍 Checking if listing exists:', listingId);
        const listing = await Listing.findById(listingId);
        if (!listing) {
            console.log('❌ Listing not found');
            return res.status(404).json({ message: 'Listing not found' });
        }
        console.log('✓ Listing found:', listing.title);

        // 2. Check availability (if applicable)
        if (listing.availableStock !== undefined && listing.availableStock < 1) {
            console.log('❌ No availability');
            return res.status(400).json({ message: 'No availability for selected dates' });
        }

        // 3. Simulate payment processing (dummy payment)
        console.log('💳 Processing payment...');
        const paymentSuccess = simulatePayment(paymentDetails);
        if (!paymentSuccess) {
            console.log('❌ Payment failed');
            return res.status(400).json({ message: 'Payment processing failed. Please try again.' });
        }
        console.log('✓ Payment processed successfully');

        // 4. Decrement stock if applicable
        if (listing.availableStock !== undefined) {
            listing.availableStock -= 1;
            await listing.save();
            console.log('✓ Stock updated');
        }

        // 5. Generate booking reference
        const bookingReference = 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
        const paymentId = 'PAY_' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();

        // 6. Create booking with all details
        const bookingData = {
            user: userId || null, // Allow guest bookings
            listing: listingId,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests: {
                adults: guests?.adults || guests || 1,
                children: guests?.children || 0,
                infants: guests?.infants || 0
            },
            primaryGuest: {
                firstName: guestDetails.firstName,
                lastName: guestDetails.lastName,
                email: guestDetails.email,
                phone: guestDetails.phone,
                country: guestDetails.country || ''
            },
            specialRequests: guestDetails.specialRequests || '',
            basePrice: totalPrice,
            totalPrice: totalPrice,
            paymentStatus: 'paid',
            paymentMethod: paymentDetails?.method || 'credit_card',
            paymentId: paymentId,
            bookingReference: bookingReference,
            paidAmount: totalPrice,
            status: 'confirmed'
        };

        console.log('💾 Creating booking in database...');
        const booking = await Booking.create(bookingData);
        console.log('✅ Booking created successfully:', booking._id);

        // Populate listing details before sending response
        const populatedBooking = await Booking.findById(booking._id).populate('listing');

        console.log('📧 Booking confirmation:');
        console.log('  - Booking ID:', booking._id);
        console.log('  - Reference:', bookingReference);
        console.log('  - Guest:', `${guestDetails.firstName} ${guestDetails.lastName}`);
        console.log('  - Email:', guestDetails.email);
        console.log('  - Total:', `$${totalPrice}`);

        res.status(201).json({
            success: true,
            message: 'Booking confirmed successfully!',
            booking: populatedBooking,
            bookingReference: bookingReference,
            paymentId: paymentId
        });
    } catch (error) {
        console.error('❌ Booking creation error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create booking. Please try again.',
            error: error.message
        });
    }
};

// Dummy payment simulation
function simulatePayment(paymentDetails) {
    // In a real application, this would integrate with Stripe, PayPal, etc.
    // For now, we'll just simulate a successful payment
    console.log('Processing payment:', paymentDetails);

    // Simulate some validation
    if (!paymentDetails || !paymentDetails.method) {
        return false;
    }

    // 95% success rate for demo purposes
    return Math.random() > 0.05;
}

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .populate('listing')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if cancellation is allowed (more than 24 hours before check-in)
        const checkInDate = new Date(booking.checkIn);
        const now = new Date();
        const timeDiff = checkInDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);

        if (hoursDiff < 24) {
            return res.status(400).json({ message: 'Cancellation is only allowed 24 hours before check-in.' });
        }

        booking.status = 'cancelled';
        booking.cancellation = {
            isCancelled: true,
            cancelledAt: new Date(),
            cancelledBy: 'user',
            reason: req.body.reason || 'User requested cancellation'
        };

        await booking.save();
        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
