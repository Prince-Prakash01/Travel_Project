import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListingCard = ({ listing }) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkWishlistStatus();
    }, [listing._id]);

    const checkWishlistStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await axios.get(`http://localhost:5000/api/wishlist/check/${listing._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsInWishlist(res.data.inWishlist);
        } catch (error) {
            // User not logged in or error checking
            console.error('Error checking wishlist:', error);
        }
    };

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if not authenticated
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            if (isInWishlist) {
                await axios.delete(`http://localhost:5000/api/wishlist/${listing._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsInWishlist(false);
            } else {
                await axios.post('http://localhost:5000/api/wishlist',
                    { listingId: listing._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsInWishlist(true);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            alert('Failed to update wishlist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={listing.images[0] || 'https://via.placeholder.com/400x250'}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-black shadow-sm">
                    {listing.type}
                </div>
                {/* Wishlist Heart Icon */}
                <button
                    onClick={toggleWishlist}
                    disabled={loading}
                    className="absolute top-3 left-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all duration-200 disabled:opacity-50"
                >
                    <span className={`text-2xl transition-transform duration-200 ${isInWishlist ? 'scale-110' : ''}`}>
                        {isInWishlist ? '❤️' : '🤍'}
                    </span>
                </button>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-blue-600 line-clamp-1 group-hover:text-blue-700 transition-colors">
                        {listing.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm font-medium">
                        <span className="text-yellow-400">★</span>
                        <span className="text-gray-700">{listing.rating || 'New'}</span>
                    </div>
                </div>

                <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                    <span>📍</span> {listing.location.city}, {listing.location.country}
                </p>

                <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                    <div>
                        <span className="text-xs text-gray-500 block">Starts from</span>
                        <span className="text-xl font-bold text-blue-600">${listing.price}</span>
                        <span className="text-xs text-gray-500"> / night</span>
                    </div>

                    <Link
                        to={`/listing/${listing._id}`}
                        className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
