import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/signin', formData);

            // Check if user is admin
            if (res.data.result.role !== 'admin') {
                setError('Access denied. Admin credentials required.');
                return;
            }

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.result));
            navigate('/admin/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex justify-center flex-grow items-center">
                <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="text-4xl mb-4">🔐</div>
                        <h2 className="text-3xl font-bold text-white">Admin Login</h2>
                        <p className="text-gray-400 mt-2">Access the admin control panel</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-white mb-2 font-medium">Admin Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border border-gray-300 bg-white text-black p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                            placeholder="Enter admin email"
                            required
                        />
                    </div>
                    <div className="mb-6 relative">
                        <label className="block text-white mb-2 font-medium">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full border border-gray-300 bg-white text-black p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition pr-10"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold">
                        Login as Admin
                    </button>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 text-sm transition">
                            ← Back to User Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
