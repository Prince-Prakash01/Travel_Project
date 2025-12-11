import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('pending-users');
    const [users, setUsers] = useState([]);
    const [packages, setPackages] = useState([]);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // New Package Form
    const [newPackage, setNewPackage] = useState({
        title: '',
        description: '',
        price: '',
        location: { city: '', country: '' },
        images: [''],
        type: 'hotel', // Default type
        imageFile: null
    });

    // Edit Package State
    const [editingPackage, setEditingPackage] = useState(null);

    // New Deal Form (based on existing packages)
    const [newDeal, setNewDeal] = useState({
        packageId: '',
        discount: '',
        validUntil: ''
    });

    // Edit Deal State
    const [editingDeal, setEditingDeal] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user || user.role !== 'admin') {
            alert('Access denied. Admin only.');
            navigate('/');
            return;
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [usersRes, packagesRes, dealsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/listings/search'), // Using search endpoint to get all listings safely
                axios.get('http://localhost:5000/api/admin/deals', {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: [] }))
            ]);
            setUsers(usersRes.data);
            // Handle both array and object response structures for listings
            const listingsData = packagesRes.data.listings || packagesRes.data || [];
            setPackages(Array.isArray(listingsData) ? listingsData : []);
            setDeals(dealsRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const approveUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('User approved successfully!');
            fetchData();
        } catch (error) {
            console.error('Error approving user:', error);
            alert('Failed to approve user');
        }
    };

    const rejectUser = async (userId) => {
        if (!window.confirm('Are you sure you want to reject this user registration?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('User registration rejected!');
            fetchData();
        } catch (error) {
            console.error('Error rejecting user:', error);
            alert('Failed to reject user');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPackage({ ...newPackage, images: [reader.result], imageFile: file });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingPackage({ ...editingPackage, images: [reader.result], imageFile: file });
            };
            reader.readAsDataURL(file);
        }
    };

    const addPackage = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/admin/packages', newPackage, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Package added successfully!');
            setNewPackage({ title: '', description: '', price: '', location: { city: '', country: '' }, images: [''], type: 'hotel', imageFile: null });
            fetchData();
        } catch (error) {
            console.error('Error adding package:', error);
            alert('Failed to add package');
        }
    };

    const updatePackage = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/packages/${editingPackage._id}`, editingPackage, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Package updated successfully!');
            setEditingPackage(null);
            fetchData();
        } catch (error) {
            console.error('Error updating package:', error);
            alert('Failed to update package');
        }
    };

    const deletePackage = async (packageId) => {
        if (!window.confirm('Are you sure you want to delete this package?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/admin/packages/${packageId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Package deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting package:', error);
            alert('Failed to delete package');
        }
    };

    const addDeal = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/admin/deals', newDeal, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Deal added successfully!');
            setNewDeal({ packageId: '', discount: '', validUntil: '' });
            fetchData();
        } catch (error) {
            console.error('Error adding deal:', error);
            alert('Failed to add deal');
        }
    };

    const updateDeal = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/deals/${editingDeal._id}`, editingDeal, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Deal updated successfully!');
            setEditingDeal(null);
            fetchData();
        } catch (error) {
            console.error('Error updating deal:', error);
            alert('Failed to update deal');
        }
    };

    const deleteDeal = async (dealId) => {
        if (!window.confirm('Are you sure you want to delete this deal?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/admin/deals/${dealId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Deal deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting deal:', error);
            alert('Failed to delete deal');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const pendingUsers = users.filter(u => !u.isVerified);
    const approvedUsers = users.filter(u => u.isVerified);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Admin Header */}
            <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <span className="text-4xl">🔐</span>
                                Admin Control Panel
                            </h1>
                            <p className="text-purple-200 mt-1">Manage your travel platform</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
                <div className="container mx-auto px-6">
                    <div className="flex gap-2 overflow-x-auto">
                        <button
                            onClick={() => setActiveSection('pending-users')}
                            className={`px-6 py-4 font-semibold whitespace-nowrap transition-all ${activeSection === 'pending-users'
                                ? 'bg-purple-600 text-white border-b-4 border-purple-400'
                                : 'text-purple-200 hover:bg-white/10'
                                }`}
                        >
                            ⏳ Pending Registrations ({pendingUsers.length})
                        </button>
                        <button
                            onClick={() => setActiveSection('approved-users')}
                            className={`px-6 py-4 font-semibold whitespace-nowrap transition-all ${activeSection === 'approved-users'
                                ? 'bg-purple-600 text-white border-b-4 border-purple-400'
                                : 'text-purple-200 hover:bg-white/10'
                                }`}
                        >
                            ✅ Approved Users ({approvedUsers.length})
                        </button>
                        <button
                            onClick={() => setActiveSection('add-package')}
                            className={`px-6 py-4 font-semibold whitespace-nowrap transition-all ${activeSection === 'add-package'
                                ? 'bg-purple-600 text-white border-b-4 border-purple-400'
                                : 'text-purple-200 hover:bg-white/10'
                                }`}
                        >
                            ➕ Add Package
                        </button>
                        <button
                            onClick={() => setActiveSection('manage-packages')}
                            className={`px-6 py-4 font-semibold whitespace-nowrap transition-all ${activeSection === 'manage-packages'
                                ? 'bg-purple-600 text-white border-b-4 border-purple-400'
                                : 'text-purple-200 hover:bg-white/10'
                                }`}
                        >
                            📦 Manage Packages ({packages.length})
                        </button>
                        <button
                            onClick={() => setActiveSection('manage-deals')}
                            className={`px-6 py-4 font-semibold whitespace-nowrap transition-all ${activeSection === 'manage-deals'
                                ? 'bg-purple-600 text-white border-b-4 border-purple-400'
                                : 'text-purple-200 hover:bg-white/10'
                                }`}
                        >
                            🎁 Manage Deals ({deals.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
                {/* Pending User Registrations */}
                {activeSection === 'pending-users' && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span>⏳</span> Pending User Registrations
                        </h2>
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white mx-auto"></div>
                            </div>
                        ) : pendingUsers.length > 0 ? (
                            <div className="space-y-4">
                                {pendingUsers.map(user => (
                                    <div key={user._id} className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                                                <p className="text-purple-200">{user.email}</p>
                                                <p className="text-sm text-purple-300 mt-1">
                                                    Registered: {new Date(user.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => approveUser(user._id)}
                                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                                                >
                                                    ✅ Accept
                                                </button>
                                                <button
                                                    onClick={() => rejectUser(user._id)}
                                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                                                >
                                                    ❌ Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-xl text-purple-200">No pending registrations</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Approved Users */}
                {activeSection === 'approved-users' && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span>✅</span> Approved Users
                        </h2>
                        {approvedUsers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {approvedUsers.map(user => (
                                    <div key={user._id} className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                                        <h3 className="text-lg font-bold text-white">{user.name}</h3>
                                        <p className="text-purple-200 text-sm">{user.email}</p>
                                        <p className="text-xs text-purple-300 mt-2">
                                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-xl text-purple-200">No approved users yet</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Add Package */}
                {activeSection === 'add-package' && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span>➕</span> Add New Package
                        </h2>
                        <form onSubmit={addPackage} className="space-y-6">
                            <div>
                                <label className="block text-white font-semibold mb-2">Package Title</label>
                                <input
                                    type="text"
                                    value={newPackage.title}
                                    onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., Luxury Beach Resort in Maldives"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white font-semibold mb-2">Description</label>
                                <textarea
                                    value={newPackage.description}
                                    onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    rows="4"
                                    placeholder="Describe the package..."
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-white font-semibold mb-2">Price (per night)</label>
                                    <input
                                        type="number"
                                        value={newPackage.price}
                                        onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="299"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white font-semibold mb-2">City</label>
                                    <input
                                        type="text"
                                        value={newPackage.location.city}
                                        onChange={(e) => setNewPackage({ ...newPackage, location: { ...newPackage.location, city: e.target.value } })}
                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Malé"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white font-semibold mb-2">Country</label>
                                    <input
                                        type="text"
                                        value={newPackage.location.country}
                                        onChange={(e) => setNewPackage({ ...newPackage, location: { ...newPackage.location, country: e.target.value } })}
                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Maldives"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-white font-semibold mb-2">Type</label>
                                <select
                                    value={newPackage.type}
                                    onChange={(e) => setNewPackage({ ...newPackage, type: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="hotel" className="text-black">Hotel</option>
                                    <option value="package" className="text-black">Tour Package</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-white font-semibold mb-2">Package Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required={!newPackage.images[0]}
                                />
                                {newPackage.images[0] && (
                                    <img src={newPackage.images[0]} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105"
                            >
                                ➕ Add Listing
                            </button>
                        </form>
                    </div>
                )}

                {/* Manage Packages */}
                {activeSection === 'manage-packages' && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span>📦</span> Manage Packages
                        </h2>

                        {/* Edit Package Form */}
                        {editingPackage && (
                            <div className="bg-purple-900/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-purple-400">
                                <h3 className="text-xl font-bold text-white mb-4">Edit Package</h3>
                                <form onSubmit={updatePackage} className="space-y-4">
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Package Title</label>
                                        <input
                                            type="text"
                                            value={editingPackage.title}
                                            onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Description</label>
                                        <textarea
                                            value={editingPackage.description}
                                            onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            rows="3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-white font-semibold mb-2">Price</label>
                                            <input
                                                type="number"
                                                value={editingPackage.price}
                                                onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white font-semibold mb-2">City</label>
                                            <input
                                                type="text"
                                                value={editingPackage.location?.city || ''}
                                                onChange={(e) => setEditingPackage({ ...editingPackage, location: { ...editingPackage.location, city: e.target.value } })}
                                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white font-semibold mb-2">Country</label>
                                            <input
                                                type="text"
                                                value={editingPackage.location?.country || ''}
                                                onChange={(e) => setEditingPackage({ ...editingPackage, location: { ...editingPackage.location, country: e.target.value } })}
                                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Type</label>
                                        <select
                                            value={editingPackage.type}
                                            onChange={(e) => setEditingPackage({ ...editingPackage, type: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="hotel" className="text-black">Hotel</option>
                                            <option value="package" className="text-black">Tour Package</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Update Image (optional)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleEditImageUpload}
                                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        {editingPackage.images?.[0] && (
                                            <img src={editingPackage.images[0]} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                                        >
                                            ✅ Update Package
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingPackage(null)}
                                            className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"
                                        >
                                            ❌ Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {packages.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {packages.map(pkg => (
                                    <div key={pkg._id} className="bg-white/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/30">
                                        <img
                                            src={pkg.images?.[0] || 'https://via.placeholder.com/400x200'}
                                            alt={pkg.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-white mb-2">{pkg.title}</h3>
                                            <p className="text-purple-200 text-sm mb-2 line-clamp-2">{pkg.description}</p>
                                            <p className="text-sm text-purple-300 mb-2">
                                                📍 {pkg.location?.city}, {pkg.location?.country}
                                            </p>
                                            <p className="text-sm text-blue-300 mb-2">
                                                Type: {pkg.type === 'package' ? 'Tour Package' : 'Hotel'}
                                            </p>
                                            <p className="text-2xl font-bold text-green-400 mb-4">${pkg.price}/night</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingPackage(pkg)}
                                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => deletePackage(pkg._id)}
                                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-xl text-purple-200">No packages available</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Manage Deals */}
                {activeSection === 'manage-deals' && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span>🎁</span> Manage Deals
                        </h2>

                        {/* Add/Edit Deal Form */}
                        <div className="bg-purple-900/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-purple-400">
                            <h3 className="text-xl font-bold text-white mb-4">
                                {editingDeal ? 'Edit Deal' : 'Add New Deal'}
                            </h3>
                            <form onSubmit={editingDeal ? updateDeal : addDeal} className="space-y-4">
                                <div>
                                    <label className="block text-white font-semibold mb-2">Select Package</label>
                                    <select
                                        value={editingDeal ? editingDeal.packageId : newDeal.packageId}
                                        onChange={(e) => editingDeal
                                            ? setEditingDeal({ ...editingDeal, packageId: e.target.value })
                                            : setNewDeal({ ...newDeal, packageId: e.target.value })
                                        }
                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                        disabled={!!editingDeal}
                                    >
                                        <option value="" className="text-black">-- Select a Package --</option>
                                        {packages.map(pkg => (
                                            <option key={pkg._id} value={pkg._id} className="text-black">
                                                {pkg.title} - ${pkg.price}/night
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Discount (%)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="99"
                                            value={editingDeal ? editingDeal.discount : newDeal.discount}
                                            onChange={(e) => editingDeal
                                                ? setEditingDeal({ ...editingDeal, discount: e.target.value })
                                                : setNewDeal({ ...newDeal, discount: e.target.value })
                                            }
                                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="30"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Valid Until</label>
                                        <input
                                            type="date"
                                            value={editingDeal ? editingDeal.validUntil : newDeal.validUntil}
                                            onChange={(e) => editingDeal
                                                ? setEditingDeal({ ...editingDeal, validUntil: e.target.value })
                                                : setNewDeal({ ...newDeal, validUntil: e.target.value })
                                            }
                                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105"
                                    >
                                        {editingDeal ? '✅ Update Deal' : '🎁 Add Deal'}
                                    </button>
                                    {editingDeal && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingDeal(null);
                                                setNewDeal({ packageId: '', discount: '', validUntil: '' });
                                            }}
                                            className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-bold text-lg rounded-lg transition-colors"
                                        >
                                            ❌ Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Existing Deals */}
                        <h3 className="text-xl font-bold text-white mb-4">Active Deals</h3>
                        {deals.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {deals.map(deal => {
                                    const pkg = packages.find(p => p._id === deal.packageId);
                                    if (!pkg) return null;
                                    const discountedPrice = pkg.price - (pkg.price * deal.discount / 100);
                                    return (
                                        <div key={deal._id} className="bg-white/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/30 relative">
                                            <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                                                {deal.discount}% OFF
                                            </div>
                                            <img
                                                src={pkg.images?.[0] || 'https://via.placeholder.com/400x200'}
                                                alt={pkg.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-6">
                                                <h3 className="text-lg font-bold text-white mb-2">{pkg.title}</h3>
                                                <p className="text-purple-200 text-sm mb-2 line-clamp-2">{pkg.description}</p>
                                                <p className="text-sm text-purple-300 mb-2">
                                                    📍 {pkg.location?.city}, {pkg.location?.country}
                                                </p>
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-400 line-through">${pkg.price}/night</p>
                                                    <p className="text-2xl font-bold text-green-400">${discountedPrice.toFixed(2)}/night</p>
                                                </div>
                                                <p className="text-sm text-yellow-300 mb-4">
                                                    ⏰ Valid until: {new Date(deal.validUntil).toLocaleDateString()}
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingDeal(deal)}
                                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteDeal(deal._id)}
                                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                                                    >
                                                        🗑️ Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-xl text-purple-200">No active deals. Create one above!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
