import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black shadow-lg' : 'bg-black/95 backdrop-blur-sm'
            }`}>
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src={logo}
                            alt="DreamRoute Logo"
                            className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="text-2xl font-bold text-white">
                            DreamRoute
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-white hover:text-blue-400 font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/destinations"
                            className="text-white hover:text-blue-400 font-medium transition-colors"
                        >
                            Destinations
                        </Link>
                        <Link
                            to="/deals"
                            className="text-white hover:text-blue-400 font-medium transition-colors"
                        >
                            Deals
                        </Link>
                        <Link
                            to="/help"
                            className="text-white hover:text-blue-400 font-medium transition-colors"
                        >
                            Help
                        </Link>
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-white hover:text-blue-400 font-medium transition-colors"
                                >
                                    👋 Hi, {user.name}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-white hover:text-red-400 font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-white hover:text-blue-400"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
                        <div className="flex flex-col space-y-3">
                            <Link
                                to="/"
                                className="text-white hover:text-blue-400 font-medium py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/destinations"
                                className="text-white hover:text-blue-400 font-medium py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Destinations
                            </Link>
                            <Link
                                to="/deals"
                                className="text-white hover:text-blue-400 font-medium py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Deals
                            </Link>
                            <Link
                                to="/help"
                                className="text-white hover:text-blue-400 font-medium py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Help
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="text-white hover:text-blue-400 font-medium py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="text-left text-red-400 hover:text-red-300 font-medium py-2"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center font-semibold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
