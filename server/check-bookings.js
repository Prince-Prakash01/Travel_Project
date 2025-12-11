require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/Booking');

async function checkBookings() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dreamroute');
        console.log('MongoDB Connected\n');

        const bookings = await Booking.find({})
            .populate('listing')
            .populate('user')
            .sort({ createdAt: -1 });

        console.log('=== ALL BOOKINGS IN DATABASE ===');
        console.log(`Total bookings: ${bookings.length}\n`);

        if (bookings.length === 0) {
            console.log('No bookings found in database.');
        } else {
            bookings.forEach((booking, index) => {
                console.log(`Booking ${index + 1}:`);
                console.log(`  Reference: ${booking.bookingReference}`);
                console.log(`  Status: ${booking.status}`);
                console.log(`  Guest: ${booking.primaryGuest.firstName} ${booking.primaryGuest.lastName}`);
                console.log(`  Email: ${booking.primaryGuest.email}`);
                console.log(`  Phone: ${booking.primaryGuest.phone}`);
                console.log(`  Property: ${booking.listing?.title || 'N/A'}`);
                console.log(`  Check-in: ${booking.checkIn.toLocaleDateString()}`);
                console.log(`  Check-out: ${booking.checkOut.toLocaleDateString()}`);
                console.log(`  Guests: ${booking.guests.adults} adults, ${booking.guests.children} children`);
                console.log(`  Total Price: $${booking.totalPrice}`);
                console.log(`  Payment Status: ${booking.paymentStatus}`);
                console.log(`  Payment ID: ${booking.paymentId}`);
                console.log(`  Created: ${booking.createdAt.toLocaleString()}`);
                if (booking.specialRequests) {
                    console.log(`  Special Requests: ${booking.specialRequests}`);
                }
                console.log('---');
            });
        }

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkBookings();
