import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SafetyScoreDisplay from '../components/SafetyScoreDisplay';
import ReviewSection from '../components/ReviewSection';

const ListingDetails = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1
    });

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
                setListing(res.data);
            } catch (error) {
                console.error('Error fetching listing:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [id]);

    const navigate = useNavigate();

    const handleBooking = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            // Redirect to login with return url
            navigate('/login', { state: { from: `/listing/${id}` } });
            return;
        }

        navigate('/checkout', {
            state: {
                bookingData,
                listing
            }
        });
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
        </div>
    );

    if (!listing) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-gray-500 text-xl">Listing not found</div>
        </div>
    );

    // Placeholder images if none exist
    const images = listing.images && listing.images.length > 0
        ? listing.images
        : [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
            'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
            'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'
        ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                        <span className="flex items-center gap-1">
                            📍 {listing.location.city}, {listing.location.country}
                        </span>
                        <span className="flex items-center gap-1">
                            ⭐ 4.8 (120 reviews)
                        </span>
                        <span className="flex items-center gap-1">
                            🏆 Superhost
                        </span>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] mb-8 rounded-2xl overflow-hidden">
                    <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer">
                        <img
                            src={images[0]}
                            alt="Main view"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="hidden md:block relative group cursor-pointer">
                        <img
                            src={images[1] || images[0]}
                            alt="View 2"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="hidden md:block relative group cursor-pointer">
                        <img
                            src={images[2] || images[0]}
                            alt="View 3"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="hidden md:block relative group cursor-pointer">
                        <img
                            src={images[3] || images[0]}
                            alt="View 4"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="hidden md:block relative group cursor-pointer">
                        <img
                            src={images[4] || images[0]}
                            alt="View 5"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-semibold">View All Photos</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="w-full lg:w-2/3">
                        {/* Overview */}
                        <div className="border-b border-gray-200 pb-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this place</h2>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {listing.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="border-b border-gray-200 pb-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">What this place offers</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {listing.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center gap-3 text-gray-700">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Safety Score */}
                        <div className="mb-8">
                            <SafetyScoreDisplay location={listing.location.city} />
                        </div>

                        {/* Reviews */}
                        <ReviewSection listingId={listing._id} />
                    </div>

                    {/* Booking Sidebar */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24 bg-white rounded-xl shadow-xl border border-gray-200 p-6">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <span className="text-3xl font-bold text-gray-900">${listing.price}</span>
                                    <span className="text-gray-600"> / night</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <span>⭐ 4.8</span>
                                    <span className="underline cursor-pointer">120 reviews</span>
                                </div>
                            </div>

                            <div className="border border-gray-300 rounded-lg mb-4 overflow-hidden">
                                <div className="flex border-b border-gray-300">
                                    <div className="w-1/2 p-3 border-r border-gray-300">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">Check-in</label>
                                        <input
                                            type="date"
                                            className="w-full text-sm focus:outline-none text-gray-700"
                                            value={bookingData.checkIn}
                                            onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                                        />
                                    </div>
                                    <div className="w-1/2 p-3">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">Check-out</label>
                                        <input
                                            type="date"
                                            className="w-full text-sm focus:outline-none text-gray-700"
                                            value={bookingData.checkOut}
                                            onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="p-3">
                                    <label className="block text-xs font-bold text-gray-700 uppercase">Guests</label>
                                    <select
                                        className="w-full text-sm focus:outline-none text-gray-700 bg-transparent"
                                        value={bookingData.guests}
                                        onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleBooking}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 mb-4"
                            >
                                Reserve
                            </button>

                            <p className="text-center text-gray-500 text-sm mb-6">You won't be charged yet</p>

                            <div className="space-y-3 text-gray-700">
                                <div className="flex justify-between">
                                    <span className="underline">${listing.price} x 5 nights</span>
                                    <span>${listing.price * 5}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="underline">Cleaning fee</span>
                                    <span>$50</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="underline">Service fee</span>
                                    <span>$80</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                                    <span>Total before taxes</span>
                                    <span>${listing.price * 5 + 130}</span>
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

export default ListingDetails;
