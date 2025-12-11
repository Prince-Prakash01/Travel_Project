import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ListingCard from '../components/ListingCard';

const Deals = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        setLoading(true);
        try {
            // Fetch deals and all packages
            const [dealsRes, packagesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/deals'),
                axios.get('http://localhost:5000/api/listings/search')
            ]);

            const dealsData = dealsRes.data || [];
            const allPackages = packagesRes.data.listings || [];

            // Map deals to their packages with discount info
            const dealsWithPackages = dealsData
                .map(deal => {
                    const pkg = allPackages.find(p => p._id === deal.packageId);
                    if (!pkg) return null;

                    const discountedPrice = pkg.price - (pkg.price * deal.discount / 100);
                    return {
                        ...pkg,
                        originalPrice: pkg.price,
                        price: discountedPrice,
                        discountPercentage: deal.discount,
                        validUntil: deal.validUntil
                    };
                })
                .filter(deal => deal !== null);

            setDeals(dealsWithPackages);
        } catch (error) {
            console.error('Error fetching deals:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-bold mb-4 animate-pulse">
                        🔥 Limited Time Offers
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Exclusive Travel Deals
                    </h1>
                    <p className="text-xl text-red-100 max-w-2xl mx-auto">
                        Save up to 50% on your next adventure. Book now before these offers expire!
                    </p>
                </div>
            </div>

            {/* Deals Grid */}
            <div className="container mx-auto px-4 py-12 flex-grow">
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
                ) : deals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {deals.map(deal => (
                            <div key={deal._id} className="relative">
                                <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full font-bold shadow-lg transform -rotate-2">
                                    {deal.discountPercentage}% OFF
                                </div>
                                <ListingCard listing={deal} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No active deals right now</h3>
                        <p className="text-gray-600">Check back later for more amazing offers!</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Deals;
