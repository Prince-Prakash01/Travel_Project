import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({ onSearch }) => {
    const [city, setCity] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const inputRef = useRef(null);

    // Popular destination recommendations
    const popularDestinations = [
        'Paris, France',
        'Tokyo, Japan',
        'New York, USA',
        'London, UK',
        'Dubai, UAE',
        'Barcelona, Spain',
        'Rome, Italy',
        'Bali, Indonesia',
        'Sydney, Australia',
        'Bangkok, Thailand',
        'Amsterdam, Netherlands',
        'Singapore',
        'Los Angeles, USA',
        'Istanbul, Turkey',
        'Prague, Czech Republic',
        'Vienna, Austria',
        'Maldives',
        'Santorini, Greece',
        'Mumbai, India',
        'Delhi, India'
    ];

    useEffect(() => {
        // Filter suggestions based on input
        if (city) {
            const filtered = popularDestinations.filter(destination =>
                destination.toLowerCase().includes(city.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions(popularDestinations);
        }
    }, [city]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ city, minPrice, maxPrice });
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (destination) => {
        setCity(destination);
        setShowSuggestions(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg flex flex-wrap gap-4 items-end">
            <div className="flex-1 relative" ref={inputRef}>
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Where to?"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black placeholder:text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-2 bg-gray-50 border-b border-gray-200">
                            <p className="text-xs font-semibold text-gray-600">POPULAR DESTINATIONS</p>
                        </div>
                        {filteredSuggestions.map((destination, index) => (
                            <div
                                key={index}
                                onClick={() => handleSuggestionClick(destination)}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition flex items-center gap-2"
                            >
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm text-gray-700">{destination}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="w-32">
                <label className="block text-sm font-medium text-gray-700">Min Price</label>
                <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="$0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black placeholder:text-gray-700"
                />
            </div>
            <div className="w-32">
                <label className="block text-sm font-medium text-gray-700">Max Price</label>
                <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="$1000"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black placeholder:text-gray-700"
                />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                Search
            </button>
        </form>
    );
};

export default SearchBar;
