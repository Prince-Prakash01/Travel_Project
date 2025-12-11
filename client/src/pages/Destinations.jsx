import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ListingCard from '../components/ListingCard';

const Destinations = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async (filters = {}) => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters).toString();
            const res = await axios.get(`http://localhost:5000/api/listings/search?${params}`);
            setListings(res.data.listings || []);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAiSearch = async (e) => {
        e.preventDefault();
        if (!aiPrompt.trim()) return;

        setIsAiThinking(true);

        // Simulate AI processing
        setTimeout(() => {
            const prompt = aiPrompt.toLowerCase();
            let filters = {};

            // Simple keyword matching "AI"
            if (prompt.includes('cheap') || prompt.includes('budget')) {
                filters.maxPrice = 200;
            }
            if (prompt.includes('luxury') || prompt.includes('expensive')) {
                filters.minPrice = 500;
            }
            if (prompt.includes('beach') || prompt.includes('sea')) {
                filters.amenities = 'Beach Access'; // Assuming backend supports partial match or we need exact
            }
            if (prompt.includes('city') || prompt.includes('urban')) {
                // filters.type = 'hotel'; // Example
            }
            if (prompt.includes('paris')) {
                filters.city = 'Paris';
            }
            if (prompt.includes('bali')) {
                filters.city = 'Bali';
            }
            if (prompt.includes('tokyo')) {
                filters.city = 'Tokyo';
            }

            fetchListings(filters);
            setIsAiThinking(false);
            setActiveFilter('custom');
        }, 1500);
    };

    const categories = [
        { id: 'all', name: 'All Destinations', icon: '🌍' },
        { id: 'beach', name: 'Beach Paradise', icon: '🏖️' },
        { id: 'city', name: 'Urban Exploration', icon: 'city' }, // 'city' is not an emoji, using text for logic
        { id: 'nature', name: 'Nature Escapes', icon: '🏔️' },
        { id: 'luxury', name: 'Luxury Stays', icon: '💎' }
    ];

    const handleCategoryClick = (id) => {
        setActiveFilter(id);
        setAiPrompt('');

        let filters = {};
        if (id === 'beach') filters.amenities = 'Beach Access'; // Simplified
        if (id === 'luxury') filters.minPrice = 300;
        // Add more logic as needed

        fetchListings(filters);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />

            {/* AI Hero Section */}
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto max-w-4xl relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6">
                        ✨ Powered by DreamRoute AI
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Where do you want to go?
                    </h1>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Tell our AI travel assistant what you're looking for, and we'll curate the perfect destinations for you.
                    </p>

                    <form onSubmit={handleAiSearch} className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="e.g., 'A romantic getaway in Paris under $300' or 'Beach resort with a spa'"
                            className="w-full px-6 py-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/20 transition-all text-lg shadow-2xl"
                        />
                        <button
                            type="submit"
                            disabled={isAiThinking}
                            className="absolute right-3 top-3 bottom-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isAiThinking ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Thinking...
                                </>
                            ) : (
                                <>
                                    <span>Generate</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Categories & Results */}
            <div className="container mx-auto px-4 py-12 flex-grow">
                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${activeFilter === cat.id
                                    ? 'bg-gray-900 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            <span className="text-xl">{cat.icon === 'city' ? '🏙️' : cat.icon}</span>
                            <span className="font-medium">{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden h-96 animate-pulse">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-20 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : listings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {listings.map(listing => (
                            <ListingCard key={listing._id} listing={listing} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No destinations found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            We couldn't find any matches for your specific criteria. Try adjusting your search or ask our AI for something else!
                        </p>
                        <button
                            onClick={() => {
                                setAiPrompt('');
                                setActiveFilter('all');
                                fetchListings();
                            }}
                            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Show All Destinations
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Destinations;
