import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ListingCard from '../components/ListingCard';

const Home = () => {
    const [listings, setListings] = useState([]);
    const [featuredListings, setFeaturedListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Hero images for slider
    const heroImages = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', // Mountain landscape
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80', // Beach sunset
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80', // Travel luggage
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80', // Tropical beach
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80', // Mountain road
    ];

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [heroImages.length]);

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

    useEffect(() => {
        fetchListings();
        // Fetch featured listings (you can add a separate endpoint later)
        fetchListings({ featured: true });
    }, []);

    const navigate = useNavigate();

    const handleSearch = (filters) => {
        const params = new URLSearchParams(filters).toString();
        navigate(`/search?${params}`);
    };

    // Popular destinations data
    const popularDestinations = [
        { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', trips: '2,500+ trips' },
        { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', trips: '3,200+ trips' },
        { name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', trips: '1,800+ trips' },
        { name: 'New York, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', trips: '4,100+ trips' },
        { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', trips: '2,900+ trips' },
        { name: 'London, UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', trips: '3,500+ trips' }
    ];

    // Why choose us features
    const features = [
        { icon: '🏆', title: 'Best Price Guarantee', description: 'Find a lower price? We\'ll refund the difference.' },
        { icon: '🌍', title: 'Worldwide Coverage', description: 'Over 1 million properties in 200+ countries.' },
        { icon: '⚡', title: 'Instant Confirmation', description: 'Book now and get instant confirmation.' },
        { icon: '🛡️', title: 'Secure Booking', description: 'Your data is safe with SSL encryption.' },
        { icon: '💬', title: '24/7 Support', description: 'We\'re here to help, anytime, anywhere.' },
        { icon: '⭐', title: 'Trusted Reviews', description: 'Real reviews from verified travelers.' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />

            {/* Hero Section with Sliding Travel Background Images */}
            <div className="relative h-[600px] overflow-hidden">
                {/* Image Slider */}
                <div className="absolute inset-0">
                    {/* Sliding Images */}
                    <div className="relative w-full h-full">
                        {heroImages.map((image, index) => (
                            <div
                                key={index}
                                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                                style={{
                                    opacity: currentSlide === index ? 1 : 0,
                                    zIndex: currentSlide === index ? 1 : 0
                                }}
                            >
                                <img
                                    src={image}
                                    alt={`Travel Destination ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                </div>

                <div className="relative container mx-auto px-4 h-full flex items-center justify-center z-20">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                            Your Journey Begins Here
                        </h1>
                        <p className="text-2xl md:text-3xl text-white mb-8 max-w-3xl mx-auto">
                            Discover amazing destinations and experiences around the world
                        </p>
                    </div>
                </div>

                {/* Slider Indicators */}
                <div className="absolute bottom-24 left-0 right-0 z-20 flex justify-center gap-2">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index
                                    ? 'bg-white w-8'
                                    : 'bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0 z-20">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB" />
                    </svg>
                </div>
            </div>

            {/* Popular Destinations */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Popular Destinations
                    </h2>
                    <p className="text-lg text-gray-600">
                        Explore the world's most loved travel destinations
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularDestinations.map((dest, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                // Extract city and country from destination name
                                const [city, country] = dest.name.split(', ');
                                navigate(`/destinations/${city.toLowerCase().replace(/\s+/g, '-')}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`);
                            }}
                            className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                        >
                            <img
                                src={dest.image}
                                alt={dest.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-2xl font-bold mb-2">{dest.name}</h3>
                                <p className="text-blue-200">{dest.trips}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Deals */}
            <div className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
                                Featured Deals
                            </h2>
                            <p className="text-lg text-gray-600">
                                Handpicked properties with the best value
                            </p>
                        </div>
                        <button className="hidden md:block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                            View All Deals
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                                <p className="mt-4 text-gray-600">Loading amazing places...</p>
                            </div>
                        ) : listings.length > 0 ? (
                            listings.slice(0, 6).map(listing => (
                                <ListingCard key={listing._id} listing={listing} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-600 text-lg">No listings found. Try adjusting your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Why Choose DreamRoute
                    </h2>
                    <p className="text-lg text-gray-600">
                        Your trusted travel companion for unforgettable experiences
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-1"
                        >
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-black">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>



            {/* Statistics Section */}
            <div className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-black mb-2">1M+</div>
                            <div className="text-black">Properties</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-black mb-2">200+</div>
                            <div className="text-black">Countries</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-black mb-2">10M+</div>
                            <div className="text-black">Happy Travelers</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-black mb-2">4.8★</div>
                            <div className="text-black">Average Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Home;
