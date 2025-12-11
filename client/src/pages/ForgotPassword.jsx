import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage({ type: 'success', text: res.data.message });
            setStep(2);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to send OTP. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            setMessage({ type: 'success', text: res.data.message });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to reset password. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex justify-center flex-grow items-center">
                <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-2 text-center text-black">
                        🔐 Forgot Password
                    </h2>
                    <p className="text-gray-400 text-center mb-6">
                        {step === 1
                            ? "Enter your email to receive an OTP"
                            : "Enter the OTP sent to your email"}
                    </p>

                    {/* Message Display */}
                    {message.text && (
                        <div className={`mb-4 p-3 rounded-lg ${message.type === 'success'
                            ? 'bg-green-900/30 border border-green-700 text-green-400'
                            : 'bg-red-900/30 border border-red-700 text-red-400'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Step 1: Enter Email */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP}>
                            <div className="mb-6">
                                <label className="block text-black mb-2 font-medium">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition placeholder:text-gray-700"
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending OTP...
                                    </span>
                                ) : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Enter OTP and New Password */}
                    {step === 2 && (
                        <form onSubmit={handleResetPassword}>
                            <div className="mb-4">
                                <label className="block text-black mb-2 font-medium">OTP Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-center text-2xl tracking-widest font-mono placeholder:text-gray-700"
                                    placeholder="000000"
                                    maxLength="6"
                                    required
                                    disabled={loading}
                                />
                                <p className="text-gray-500 text-sm mt-1">Enter the 6-digit code sent to {email}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-black mb-2 font-medium">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition placeholder:text-gray-700"
                                    placeholder="Enter new password"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-black mb-2 font-medium">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition placeholder:text-gray-700"
                                    placeholder="Confirm new password"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Resetting Password...
                                    </span>
                                ) : 'Reset Password'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setOtp('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                    setMessage({ type: '', text: '' });
                                }}
                                className="w-full bg-gray-800 text-gray-300 py-2 rounded-lg hover:bg-gray-700 transition"
                                disabled={loading}
                            >
                                ← Back to Email
                            </button>
                        </form>
                    )}

                    {/* Footer Links */}
                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 transition">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
