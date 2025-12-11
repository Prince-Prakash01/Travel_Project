import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ListingCard from '../components/ListingCard';

const Destination = () => {
    const { destination } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all'); // all, hotel, package

    const city = searchParams.get('city') || '';
    const country = searchParams.get('country') || '';

    useEffect(() => {
        fetchDestinationListings();
    }, [city, country, activeFilter]);

    const fetchDestinationListings = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (city) params.append('city', city);
            if (country) params.append('country', country);
            if (activeFilter !== 'all') params.append('type', activeFilter);

            const res = await axios.get(`http://localhost:5000/api/listings/search?${params.toString()}`);
            setListings(res.data.listings || []);
        } catch (error) {
            console.error('Error fetching destination listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredListings = listings;

    return (
        <div className="min-h-screen bg-black font-sans flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-96 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={`https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80`}
                        alt={`${city}, ${country}`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="relative container mx-auto px-4 h-full flex items-center">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                            {city}, {country}
                        </h1>
                        <p className="text-xl text-gray-200">
                            Explore amazing hotels and tour packages
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters and Map Section */}
            <div className="container mx-auto px-4 py-8">
                {/* Filter Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeFilter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        All ({listings.length})
                    </button>
                    <button
                        onClick={() => setActiveFilter('hotel')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeFilter === 'hotel'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        🏨 Hotels
                    </button>
                    <button
                        onClick={() => setActiveFilter('package')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeFilter === 'package'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        🎒 Tour Packages
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Map Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 rounded-xl p-6 sticky top-24 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">📍 Location Map</h3>

                            {/* Interactive Map Placeholder */}
                            <div className="relative h-96 bg-gray-800 rounded-lg overflow-hidden">
                                <iframe
                                    title={`Map of ${city}`}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(city + ', ' + country)}&zoom=12`}
                                    allowFullScreen
                                ></iframe>
                            </div>

                            {/* Map Info */}
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-blue-400">📌</span>
                                    <span className="text-sm">{city}, {country}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-green-400">🏨</span>
                                    <span className="text-sm">{listings.filter(l => l.type === 'hotel').length} Hotels Available</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-purple-400">🎒</span>
                                    <span className="text-sm">{listings.filter(l => l.type === 'package').length} Tour Packages</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Listings Section */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {activeFilter === 'all' && 'All Listings'}
                            {activeFilter === 'hotel' && 'Hotels'}
                            {activeFilter === 'package' && 'Tour Packages'}
                        </h2>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-600"></div>
                            </div>
                        ) : filteredListings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredListings.map(listing => (
                                    <ListingCard key={listing._id} listing={listing} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-700">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-white mb-2">No listings found</h3>
                                <p className="text-gray-400 mb-6">
                                    We couldn't find any {activeFilter === 'all' ? 'listings' : activeFilter === 'hotel' ? 'hotels' : 'tour packages'} in {city}, {country}
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Explore Other Destinations
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Destination;
