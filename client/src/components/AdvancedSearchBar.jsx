import React, { useState } from 'react';

const AdvancedSearchBar = ({ onSearch, compact = false }) => {
    const [activeTab, setActiveTab] = useState('hotels');
    const [searchData, setSearchData] = useState({
        // Hotels
        destination: '',
        checkIn: '',
        checkOut: '',
        guests: 2,
        rooms: 1,

        // Flights
        from: '',
        to: '',
        departDate: '',
        returnDate: '',
        passengers: 1,
        flightClass: 'economy',

        // Activities
        location: '',
        activityDate: '',
        category: ''
    });

    const handleInputChange = (e) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = () => {
        const filters = { type: activeTab === 'hotels' ? 'hotel' : activeTab === 'flights' ? 'flight' : 'activity' };

        if (activeTab === 'hotels') {
            if (searchData.destination) filters.location = searchData.destination;
        } else if (activeTab === 'flights') {
            if (searchData.from) filters.from = searchData.from;
            if (searchData.to) filters.to = searchData.to;
        } else if (activeTab === 'activities') {
            if (searchData.location) filters.location = searchData.location;
        }

        onSearch(filters);
    };

    const tabs = [
        { id: 'hotels', label: 'Hotels', icon: '🏨' },
        { id: 'activities', label: 'Activities', icon: '🎯' }
    ];

    return (
        <div className={`bg-white overflow-hidden ${compact ? 'rounded-lg shadow-none' : 'rounded-2xl shadow-2xl'}`}>
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-6 py-4 font-semibold text-lg transition-all duration-200 ${activeTab === tab.id
                            ? 'bg-white text-blue-600 border-b-4 border-blue-600'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            } ${compact ? 'py-3 text-base' : ''}`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search Forms */}
            <div className={`${compact ? 'p-4' : 'p-6'}`}>
                {/* Hotels Tab */}
                {activeTab === 'hotels' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                📍 Destination
                            </label>
                            <input
                                type="text"
                                name="destination"
                                value={searchData.destination}
                                onChange={handleInputChange}
                                placeholder="Where are you going?"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                📅 Check-in
                            </label>
                            <input
                                type="date"
                                name="checkIn"
                                value={searchData.checkIn}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                📅 Check-out
                            </label>
                            <input
                                type="date"
                                name="checkOut"
                                value={searchData.checkOut}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                👥 Guests
                            </label>
                            <select
                                name="guests"
                                value={searchData.guests}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                🛏️ Rooms
                            </label>
                            <select
                                name="rooms"
                                value={searchData.rooms}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2 opacity-0">
                                Search
                            </label>
                            <button
                                onClick={handleSearch}
                                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                            >
                                🔍 Search Hotels
                            </button>
                        </div>
                    </div>
                )}

                {/* Activities Tab */}
                {activeTab === 'activities' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                📍 Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={searchData.location}
                                onChange={handleInputChange}
                                placeholder="Where do you want to explore?"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                📅 Date
                            </label>
                            <input
                                type="date"
                                name="activityDate"
                                value={searchData.activityDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                🎯 Category
                            </label>
                            <select
                                name="category"
                                value={searchData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            >
                                <option value="">All Categories</option>
                                <option value="adventure">Adventure</option>
                                <option value="cultural">Cultural</option>
                                <option value="food">Food & Dining</option>
                                <option value="nature">Nature</option>
                                <option value="water">Water Sports</option>
                                <option value="sightseeing">Sightseeing</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2 opacity-0">
                                Search
                            </label>
                            <button
                                onClick={handleSearch}
                                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                            >
                                🔍 Search Activities
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvancedSearchBar;
