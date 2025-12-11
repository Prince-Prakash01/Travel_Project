import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ListingCard from '../components/ListingCard';
import AdvancedSearchBar from '../components/AdvancedSearchBar';

const SearchResults = () => {
    const location = useLocation();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        priceRange: [0, 1000],
        rating: 0,
        amenities: [],
        propertyType: []
    });
    const [sortBy, setSortBy] = useState('recommended');

    // Parse query params on load
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const initialFilters = {};
        for (const [key, value] of searchParams.entries()) {
            initialFilters[key] = value;
        }
        fetchListings(initialFilters);
    }, [location.search]);

    const fetchListings = async (searchFilters) => {
        setLoading(true);
        try {
            const params = new URLSearchParams(searchFilters).toString();
            // In a real app, we'd pass all filters here. 
            // For now, we'll just use the search endpoint we have.
            const res = await axios.get(`http://localhost:5000/api/listings/search?${params}`);
            setListings(res.data.listings || []);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: value
        }));
        // Trigger refetch or local filter
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        // Implement sorting logic
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />

            {/* Search Bar Compact Version */}
            <div className="bg-blue-600 py-6 shadow-md">
                <div className="container mx-auto px-4">
                    <AdvancedSearchBar onSearch={(f) => fetchListings(f)} compact={true} />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-full lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                                <button className="text-blue-600 text-sm font-medium hover:underline">Reset</button>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-800 mb-3">Price Range</h4>
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    />
                                </div>
                            </div>

                            {/* Star Rating */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-800 mb-3">Star Rating</h4>
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map(star => (
                                        <label key={star} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                                            <div className="flex text-yellow-400 text-sm">
                                                {[...Array(star)].map((_, i) => <span key={i}>★</span>)}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-800 mb-3">Amenities</h4>
                                <div className="space-y-2">
                                    {['WiFi', 'Pool', 'Parking', 'Restaurant', 'Gym', 'Spa'].map(amenity => (
                                        <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                                            <span className="text-gray-600 text-sm">{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Property Type */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3">Property Type</h4>
                                <div className="space-y-2">
                                    {['Hotel', 'Resort', 'Apartment', 'Villa', 'Hostel'].map(type => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                                            <span className="text-gray-600 text-sm">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="w-full lg:w-3/4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">
                                {listings.length} Properties Found
                            </h2>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-600 text-sm">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    className="border-none bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                >
                                    <option value="recommended">Recommended</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>
                        </div>

                        {/* Listings Grid */}
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                            </div>
                        ) : listings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {listings.map(listing => (
                                    <ListingCard key={listing._id} listing={listing} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                                <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SearchResults;
