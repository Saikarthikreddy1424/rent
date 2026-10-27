import React, { useState } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function ReviewModal({ listingId, listingTitle, isOpen, onClose, onReviewAdded }) {
  const { user, showToast } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please provide your review feedback', 'error');
      return;
    }

    setLoading(true);
    try {
      await apiClient.createReview({
        listing_id: listingId,
        rating,
        comment
      });
      showToast('Review submitted! Thank you for helping other students.');
      if (onReviewAdded) onReviewAdded();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Student Feedback</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Rate this Rental</h2>
            <p className="text-xs text-slate-500 line-clamp-1">{listingTitle}</p>
          </div>

          {/* Star selector */}
          <div className="flex flex-col items-center py-2 space-y-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-600">
              {rating === 5 ? 'Excellent (5.0)' : rating === 4 ? 'Very Good (4.0)' : rating === 3 ? 'Average (3.0)' : rating === 2 ? 'Below Expectations (2.0)' : 'Poor (1.0)'}
            </span>
          </div>

          {/* Review comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              Your Review & Campus Experience
            </label>
            <textarea
              rows={4}
              required
              placeholder="How was the landlord, amenities, Wi-Fi speed, distance to class, and study atmosphere?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-brand-600 text-white font-bold text-sm shadow-lg shadow-teal-500/20 hover:brightness-105 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Post Student Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
