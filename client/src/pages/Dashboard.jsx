import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        dob: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
        } else {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setProfileData({
                name: parsedUser.name || '',
                phone: parsedUser.phone || '',
                dob: parsedUser.dob ? new Date(parsedUser.dob).toISOString().split('T')[0] : ''
            });
            fetchBookings(parsedUser._id);
            fetchWishlist();
        }
    }, [navigate]);

    const handleProfileUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5000/api/auth/profile', profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local storage and state
            const updatedUser = { ...user, ...res.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    const fetchBookings = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/bookings/user/${userId}`);
            setBookings(res.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(res.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const removeFromWishlist = async (listingId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/wishlist/${listingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh wishlist
            fetchWishlist();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            alert('Failed to remove from wishlist');
        }
    };

    const cancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Booking cancelled successfully!');
            fetchBookings(user._id);
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black font-sans flex flex-col">
            <Navbar />

            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4">
                        <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6 sticky top-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="font-bold text-white">{user.name}</h2>
                                    <p className="text-sm text-white">{user.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('bookings')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'bookings'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-white hover:bg-gray-800'
                                        }`}
                                >
                                    <span>📅</span> My Bookings
                                </button>
                                <button
                                    onClick={() => setActiveTab('wishlist')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'wishlist'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-white hover:bg-gray-800'
                                        }`}
                                >
                                    <span>❤️</span> Wishlist
                                </button>
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'profile'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-white hover:bg-gray-800'
                                        }`}
                                >
                                    <span>👤</span> Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'settings'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-white hover:bg-gray-800'
                                        }`}
                                >
                                    <span>⚙️</span> Settings
                                </button>
                                <div className="pt-4 mt-4 border-t border-gray-700">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <span>🚪</span> Logout
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full lg:w-3/4">
                        {activeTab === 'bookings' && (
                            <div>
                                <h1 className="text-2xl font-bold text-black mb-6">My Bookings</h1>
                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
                                    </div>
                                ) : bookings.length > 0 ? (
                                    <div className="space-y-4">
                                        {bookings.map(booking => (
                                            <div key={booking._id} className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6 flex flex-col md:flex-row gap-6">
                                                <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden">
                                                    {booking.listing && booking.listing.images && booking.listing.images[0] ? (
                                                        <img src={booking.listing.images[0]} alt={booking.listing.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                                    )}
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-xl font-bold text-white">
                                                            {booking.listing ? booking.listing.title : 'Unknown Listing'}
                                                        </h3>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${(() => {
                                                            // Check if check-out date has passed
                                                            const checkOutDate = new Date(booking.checkOut);
                                                            const today = new Date();
                                                            const isPast = checkOutDate < today;

                                                            if (booking.status === 'cancelled') {
                                                                return 'bg-red-100 text-red-700';
                                                            } else if (isPast && booking.status === 'confirmed') {
                                                                return 'bg-blue-100 text-blue-700';
                                                            } else if (booking.status === 'confirmed') {
                                                                return 'bg-green-100 text-green-700';
                                                            } else {
                                                                return 'bg-yellow-100 text-yellow-700';
                                                            }
                                                        })()}`}>
                                                            {(() => {
                                                                const checkOutDate = new Date(booking.checkOut);
                                                                const today = new Date();
                                                                const isPast = checkOutDate < today;

                                                                if (booking.status === 'cancelled') {
                                                                    return 'Cancelled';
                                                                } else if (isPast && booking.status === 'confirmed') {
                                                                    return 'Done';
                                                                } else {
                                                                    return booking.status;
                                                                }
                                                            })()}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-300 mb-4">
                                                        {booking.listing && booking.listing.location ? `${booking.listing.location.city}, ${booking.listing.location.country}` : ''}
                                                    </p>
                                                    <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                                                        <div>
                                                            <span className="block font-medium text-white">Dates</span>
                                                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                                        </div>
                                                        <div>
                                                            <span className="block font-medium text-white">Total Price</span>
                                                            ${booking.totalPrice}
                                                        </div>
                                                        <div>
                                                            <span className="block font-medium text-white">Booking ID</span>
                                                            #{booking._id.slice(-6).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex justify-end">
                                                        {booking.status !== 'cancelled' && (() => {
                                                            // Check if check-in is more than 1 day away
                                                            const checkInDate = new Date(booking.checkIn);
                                                            const today = new Date();
                                                            const timeDiff = checkInDate - today;
                                                            const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

                                                            // Only show cancel button if more than 1 day before check-in
                                                            if (daysDiff > 1) {
                                                                return (
                                                                    <button
                                                                        onClick={() => cancelBooking(booking._id)}
                                                                        className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
                                                                    >
                                                                        Cancel Booking
                                                                    </button>
                                                                );
                                                            }
                                                            return null;
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-12 text-center">
                                        <div className="text-6xl mb-4">✈️</div>
                                        <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
                                        <p className="text-gray-300 mb-6">Time to dust off your bags and start planning your next adventure</p>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Start Exploring
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-6">My Wishlist</h1>
                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
                                    </div>
                                ) : wishlist.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {wishlist.map(item => (
                                            <div key={item._id} className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 overflow-hidden hover:shadow-xl transition-all">
                                                <div className="flex gap-4 p-4">
                                                    <img
                                                        src={item.listing?.images?.[0] || 'https://via.placeholder.com/150'}
                                                        alt={item.listing?.title || 'Listing'}
                                                        className="w-32 h-32 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-grow">
                                                        <h3 className="text-lg font-bold text-white mb-2">
                                                            {item.listing?.title || 'Unknown Listing'}
                                                        </h3>
                                                        <p className="text-gray-300 text-sm mb-2">
                                                            {item.listing?.location ? `${item.listing.location.city}, ${item.listing.location.country}` : ''}
                                                        </p>
                                                        <p className="text-blue-400 font-bold text-lg mb-2">
                                                            ${item.listing?.price || 0} / night
                                                        </p>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => navigate(`/listing/${item.listing._id}`)}
                                                                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                                            >
                                                                View Details
                                                            </button>
                                                            <button
                                                                onClick={() => removeFromWishlist(item.listing._id)}
                                                                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-12 text-center">
                                        <div className="text-6xl mb-4">❤️</div>
                                        <h3 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
                                        <p className="text-gray-300 mb-6">Save places you'd like to visit to keep track of them</p>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Explore Destinations
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-8">
                                <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue={user.email}
                                            disabled
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-200 text-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={profileData.dob}
                                            onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-black"
                                        />
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <button
                                        onClick={handleProfileUpdate}
                                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-8">
                                <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between py-4 border-b border-gray-700">
                                        <div>
                                            <h3 className="font-medium text-white">Email Notifications</h3>
                                            <p className="text-sm text-gray-300">Receive emails about your bookings and deals</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-b border-gray-700">
                                        <div>
                                            <h3 className="font-medium text-white">Two-Factor Authentication</h3>
                                            <p className="text-sm text-gray-300">Add an extra layer of security to your account</p>
                                        </div>
                                        <button className="text-blue-600 font-medium hover:underline">Enable</button>
                                    </div>
                                    <div className="pt-4">
                                        <button className="text-red-600 font-medium hover:underline">Delete Account</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;

