import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewSection = ({ listingId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newReview, setNewReview] = useState({
        overallRating: 5,
        comment: ''
    });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchReviews();
    }, [listingId]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/reviews/${listingId}`);
            setReviews(res.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5000/api/reviews/${listingId}`,
                newReview,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewReview({ overallRating: 5, comment: '' });
            setShowForm(false);
            fetchReviews(); // Refresh reviews
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review');
        }
    };

    return (
        <div className="py-8 border-t border-gray-200">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    ⭐ {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + (r.overallRating || r.rating || 0), 0) / reviews.length).toFixed(1) : 'New'}
                    <span className="text-gray-500 font-normal ml-2">({reviews.length} reviews)</span>
                </h2>
                {user && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 border border-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Write a Review
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl mb-8">
                    <h3 className="text-lg font-bold mb-4">Share your experience</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewReview({ ...newReview, overallRating: star })}
                                    className={`text-2xl ${star <= newReview.overallRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Tell us about your stay..."
                            required
                        ></textarea>
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Post Review
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-6 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="text-center py-8">Loading reviews...</div>
            ) : reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reviews.map(review => (
                        <div key={review._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                    {review.user?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                                    <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-2">{review.comment}</p>
                            <div className="text-yellow-400 text-sm">
                                {[...Array(review.overallRating || review.rating || 5)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
