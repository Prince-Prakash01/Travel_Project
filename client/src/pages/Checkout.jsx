import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
    const [loading, setLoading] = useState(false);
    const [bookingResponse, setBookingResponse] = useState(null);

    // Booking data passed from ListingDetails
    const bookingData = location.state?.bookingData;
    const listing = location.state?.listing;

    const [guestInfo, setGuestInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: ''
    });

    const [additionalGuests, setAdditionalGuests] = useState([]);

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiry: '',
        cvc: '',
        nameOnCard: ''
    });

    useEffect(() => {
        // Check if user is logged in
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!user || !token) {
            // Redirect to login if not authenticated
            navigate('/login');
            return;
        }

        if (!bookingData || !listing) {
            navigate('/'); // Redirect if no data
        }
        // Pre-fill user info if logged in
        const userData = JSON.parse(user);
        if (userData) {
            setGuestInfo(prev => ({
                ...prev,
                firstName: userData.name.split(' ')[0],
                lastName: userData.name.split(' ')[1] || '',
                email: userData.email
            }));
        }

        // Initialize additional guest forms if guests > 1
        if (bookingData && bookingData.guests > 1) {
            const guestForms = [];
            for (let i = 1; i < bookingData.guests; i++) {
                guestForms.push({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: ''
                });
            }
            setAdditionalGuests(guestForms);
        }
    }, [bookingData, listing, navigate]);

    const handleGuestInfoChange = (e) => {
        setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
    };

    const handleAdditionalGuestChange = (index, field, value) => {
        const updatedGuests = [...additionalGuests];
        updatedGuests[index][field] = value;
        setAdditionalGuests(updatedGuests);
    };

    const handlePaymentInfoChange = (e) => {
        setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
    };

    const handleSubmitBooking = async () => {
        setLoading(true);
        try {
            // Validate guest info
            if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
                alert('Payment Failed: Please fill in all required guest information');
                setLoading(false);
                return;
            }

            // Validate additional guests if any
            if (additionalGuests.length > 0) {
                for (let i = 0; i < additionalGuests.length; i++) {
                    const guest = additionalGuests[i];
                    if (!guest.firstName || !guest.lastName || !guest.email || !guest.phone) {
                        alert(`Payment Failed: Please fill in all required information for Guest ${i + 2}`);
                        setLoading(false);
                        return;
                    }
                }
            }

            // Validate payment info
            if (!paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvc || !paymentInfo.nameOnCard) {
                alert('Payment Failed: Please fill in all payment details');
                setLoading(false);
                return;
            }

            // Basic card number validation (must be 16 digits)
            const cardNumberClean = paymentInfo.cardNumber.replace(/\s/g, '');
            if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
                alert('Payment Failed: Invalid card number');
                setLoading(false);
                return;
            }

            // Expiry validation (MM/YY format)
            if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiry)) {
                alert('Payment Failed: Invalid expiry date format (use MM/YY)');
                setLoading(false);
                return;
            }

            // CVC validation (3-4 digits)
            if (paymentInfo.cvc.length < 3 || paymentInfo.cvc.length > 4) {
                alert('Payment Failed: Invalid CVC');
                setLoading(false);
                return;
            }

            const user = JSON.parse(localStorage.getItem('user'));

            console.log('Submitting booking...');
            console.log('Listing:', listing);
            console.log('Booking data:', bookingData);
            console.log('Guest info:', guestInfo);

            const payload = {
                listingId: listing._id,
                userId: user ? user._id : null,
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
                guests: bookingData.guests,
                totalPrice: calculateTotal(),
                guestDetails: guestInfo,
                additionalGuests: additionalGuests,
                paymentDetails: { ...paymentInfo, method: 'credit_card' }
            };

            console.log('Payload:', payload);

            const res = await axios.post('http://localhost:5000/api/bookings/new', payload);

            console.log('Booking response:', res.data);

            if (res.data.success) {
                // Set booking response first
                setBookingResponse(res.data);
                // Then update step to show success message
                setLoading(false);
                setStep(3); // Success - Payment Successful message will show
            } else {
                throw new Error(res.data.message || 'Booking failed');
            }
        } catch (error) {
            console.error('Booking error:', error);

            let errorMessage = 'Payment Failed: Booking could not be completed. Please try again.';

            if (error.response) {
                // Server responded with error
                errorMessage = 'Payment Failed: ' + (error.response.data?.message || errorMessage);
            } else if (error.request) {
                // Request made but no response
                errorMessage = 'Payment Failed: Cannot connect to server. Please make sure the backend is running.';
            }

            alert(errorMessage);
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        const nights = 5; // Calculate actual nights
        const basePrice = listing.price * nights;
        const cleaningFee = 50;
        const serviceFee = 80;
        return basePrice + cleaningFee + serviceFee;
    };

    if (!listing) return null;

    return (
        <div className="min-h-screen bg-black font-sans">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8">
                        {step === 3 ? 'Booking Confirmed!' : 'Request to book'}
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left Column: Forms */}
                        <div className="w-full lg:w-2/3">
                            {step === 1 && (
                                <div className="bg-black rounded-xl shadow-sm border border-gray-700 p-8">
                                    <h2 className="text-xl font-bold text-white mb-6">Your Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={guestInfo.firstName}
                                                onChange={handleGuestInfoChange}
                                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={guestInfo.lastName}
                                                onChange={handleGuestInfoChange}
                                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={guestInfo.email}
                                                onChange={handleGuestInfoChange}
                                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={guestInfo.phone}
                                                onChange={handleGuestInfoChange}
                                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-white mb-2">Special Requests (Optional)</label>
                                            <textarea
                                                name="specialRequests"
                                                value={guestInfo.specialRequests}
                                                onChange={handleGuestInfoChange}
                                                rows="3"
                                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* Additional Guests Forms */}
                                    {additionalGuests.length > 0 && (
                                        <div className="mt-8 space-y-6">
                                            {additionalGuests.map((guest, index) => (
                                                <div key={index} className="border-t border-gray-700 pt-6">
                                                    <h3 className="text-lg font-bold text-white mb-4">Guest {index + 2} Details</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block text-sm font-medium text-white mb-2">First Name</label>
                                                            <input
                                                                type="text"
                                                                value={guest.firstName}
                                                                onChange={(e) => handleAdditionalGuestChange(index, 'firstName', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                                                            <input
                                                                type="text"
                                                                value={guest.lastName}
                                                                onChange={(e) => handleAdditionalGuestChange(index, 'lastName', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                                                            <input
                                                                type="email"
                                                                value={guest.email}
                                                                onChange={(e) => handleAdditionalGuestChange(index, 'email', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                                                            <input
                                                                type="tel"
                                                                value={guest.phone}
                                                                onChange={(e) => handleAdditionalGuestChange(index, 'phone', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="bg-black rounded-xl shadow-sm border border-gray-700 p-8">
                                    <h2 className="text-xl font-bold text-white mb-6">Payment Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-white mb-2">Card Number</label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={paymentInfo.cardNumber}
                                                onChange={handlePaymentInfoChange}
                                                placeholder="0000 0000 0000 0000"
                                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">Expiration Date</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                value={paymentInfo.expiry}
                                                onChange={handlePaymentInfoChange}
                                                placeholder="MM/YY"
                                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white mb-2">CVC</label>
                                            <input
                                                type="text"
                                                name="cvc"
                                                value={paymentInfo.cvc}
                                                onChange={handlePaymentInfoChange}
                                                placeholder="123"
                                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-white mb-2">Name on Card</label>
                                            <input
                                                type="text"
                                                name="nameOnCard"
                                                value={paymentInfo.nameOnCard}
                                                onChange={handlePaymentInfoChange}
                                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="px-6 py-3 border border-gray-600 text-gray-300 font-bold rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleSubmitBooking}
                                            disabled={loading}
                                            className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                                        >
                                            {loading ? 'Processing...' : 'Confirm and Pay'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-8">
                                    <div className="text-center mb-8">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <span className="text-4xl">✅</span>
                                        </div>
                                        <h2 className="text-3xl font-bold text-green-400 mb-2">Payment Successful!</h2>
                                        <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                                        <p className="text-lg text-gray-300 mb-4">
                                            {bookingResponse?.message || 'Your payment has been processed and booking confirmed successfully!'}
                                        </p>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-6 mb-6">
                                        <h3 className="text-lg font-bold text-white mb-4">Booking Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">Booking Reference:</span>
                                                <span className="font-bold text-blue-400 text-lg">
                                                    {bookingResponse?.bookingReference || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">Payment ID:</span>
                                                <span className="font-mono text-sm text-white">
                                                    {bookingResponse?.paymentId || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">Guest Name:</span>
                                                <span className="font-semibold text-white">
                                                    {guestInfo.firstName} {guestInfo.lastName}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">Email:</span>
                                                <span className="text-white">{guestInfo.email}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">Total Paid:</span>
                                                <span className="font-bold text-green-400 text-xl">
                                                    ${calculateTotal()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <div className="border-t border-gray-700 pt-6 mb-6">
                                        <h3 className="text-lg font-bold text-white mb-4">Property Information</h3>
                                        <div className="flex gap-4 mb-4">
                                            <img
                                                src={listing.images[0]}
                                                alt={listing.title}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                            <div>
                                                <h4 className="font-bold text-white text-lg">{listing.title}</h4>
                                                <p className="text-sm text-gray-300">{listing.location.city}, {listing.location.country}</p>
                                                <p className="text-sm text-gray-300 mt-1">
                                                    📅 Check-in: {bookingData.checkIn}
                                                </p>
                                                <p className="text-sm text-gray-300">
                                                    📅 Check-out: {bookingData.checkOut}
                                                </p>
                                                <p className="text-sm text-gray-300">
                                                    👥 {bookingData.guests} guest{bookingData.guests > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Confirmation Message */}
                                    <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-blue-200">
                                            📧 A confirmation email has been sent to <strong>{guestInfo.email}</strong>
                                        </p>
                                        <p className="text-sm text-blue-200 mt-2">
                                            💾 Your booking has been saved to the database and can be viewed in your dashboard.
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => navigate('/dashboard')}
                                            className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                        >
                                            View My Bookings
                                        </button>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="flex-1 px-8 py-3 border-2 border-gray-600 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Back to Home
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-black rounded-xl shadow-xl border border-gray-700 p-6 sticky top-24">
                                <div className="flex gap-4 mb-6">
                                    <img
                                        src={listing.images[0]}
                                        alt={listing.title}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div>
                                        <h3 className="font-bold text-white line-clamp-2">{listing.title}</h3>
                                        <p className="text-sm text-gray-300 mt-1">{listing.type}</p>
                                        <p className="text-sm text-gray-300">⭐ 4.8 (120 reviews)</p>
                                    </div>
                                </div>

                                <div className="border-t border-b border-gray-700 py-4 mb-4 space-y-3">
                                    <h4 className="font-bold text-white">Your Trip</h4>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Dates</span>
                                        <span className="font-medium text-white">{bookingData.checkIn} – {bookingData.checkOut}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Guests</span>
                                        <span className="font-medium text-white">{bookingData.guests} guests</span>
                                    </div>
                                </div>

                                <h4 className="font-bold text-white mb-4">Price Details</h4>
                                <div className="space-y-3 text-gray-300 text-sm mb-4">
                                    <div className="flex justify-between">
                                        <span>${listing.price} x 5 nights</span>
                                        <span>${listing.price * 5}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Cleaning fee</span>
                                        <span>$50</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Service fee</span>
                                        <span>$80</span>
                                    </div>
                                </div>
                                <div className="border-t border-gray-700 pt-4 flex justify-between font-bold text-lg text-white">
                                    <span>Total (USD)</span>
                                    <span>${calculateTotal()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
