import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Help = () => {
    const [activeCategory, setActiveCategory] = useState('general');
    const [openFaq, setOpenFaq] = useState(null);

    const categories = [
        { id: 'general', name: 'General', icon: '👋' },
        { id: 'booking', name: 'Bookings', icon: '📅' },
        { id: 'payment', name: 'Payments', icon: '💳' },
        { id: 'cancellation', name: 'Cancellations', icon: '❌' },
        { id: 'account', name: 'Account', icon: '👤' }
    ];

    const faqs = {
        general: [
            { q: "What is DreamRoute?", a: "DreamRoute is a premier travel booking platform that helps you discover and book amazing destinations, hotels, and experiences worldwide using AI-powered recommendations." },
            { q: "Is DreamRoute free to use?", a: "Yes, searching and exploring destinations on DreamRoute is completely free. You only pay when you make a booking." },
            { q: "How do I contact support?", a: "You can reach our 24/7 support team via the contact form below, or email us at support@dreamroute.com." }
        ],
        booking: [
            { q: "How do I make a booking?", a: "Simply search for your desired destination, select a listing, choose your dates, and click 'Book Now'. Follow the checkout process to confirm your reservation." },
            { q: "Can I book for someone else?", a: "Yes, you can enter the guest's details during the checkout process." },
            { q: "Where can I see my bookings?", a: "You can view all your upcoming and past bookings in your Dashboard under the 'My Bookings' tab." }
        ],
        payment: [
            { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and select digital wallets." },
            { q: "Is my payment information secure?", a: "Absolutely. We use industry-standard SSL encryption and trusted payment gateways to ensure your data is always safe." },
            { q: "When will I be charged?", a: "Depending on the property's policy, you may be charged immediately upon booking or pay at the property. This information is clearly displayed before you confirm." }
        ],
        cancellation: [
            { q: "Can I cancel my booking?", a: "Yes, you can cancel your booking through your Dashboard. Cancellation policies vary by property, so please check the specific terms of your reservation." },
            { q: "How long do refunds take?", a: "Refunds are typically processed within 5-10 business days, depending on your bank or card issuer." },
            { q: "What if the host cancels?", a: "In the rare event a host cancels, you will receive a full refund and our support team will help you find alternative accommodation." }
        ],
        account: [
            { q: "How do I reset my password?", a: "Click on 'Login', then select 'Forgot Password?'. Enter your email address to receive a secure OTP for password reset." },
            { q: "Can I update my profile?", a: "Yes, you can update your personal information, preferences, and security settings in your Dashboard under the 'Profile' tab." }
        ]
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        How can we help you?
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Browse our frequently asked questions to find answers
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 flex-grow">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Categories */}
                    <div className="w-full md:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setActiveCategory(cat.id);
                                        setOpenFaq(null);
                                    }}
                                    className={`w-full flex items-center gap-3 px-6 py-4 text-left font-medium transition-colors border-b border-gray-100 last:border-0 ${activeCategory === cat.id
                                        ? 'bg-blue-50 text-blue-600 border-l-4 border-l-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 border-l-4 border-l-transparent'
                                        }`}
                                >
                                    <span>{cat.icon}</span>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Content */}
                    <div className="w-full md:w-3/4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
                            {categories.find(c => c.id === activeCategory)?.name} Questions
                        </h2>

                        <div className="space-y-4">
                            {faqs[activeCategory].map((faq, index) => (
                                <div key={index} className="bg-black rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex justify-between items-center p-6 text-left font-semibold text-white transition-colors"
                                    >
                                        <span>{faq.q}</span>
                                        <span className={`transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                                            ▼
                                        </span>
                                    </button>
                                    <div
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <div className="p-6 pt-0 text-white border-t border-gray-700 bg-black">
                                            {faq.a}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Help;
