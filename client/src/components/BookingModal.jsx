import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, Send, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function BookingModal({ listing, isOpen, onClose, onSuccess }) {
  const { user, showToast } = useAuth();
  const [moveInDate, setMoveInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [rentalDuration, setRentalDuration] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !listing) return null;

  const totalEstimate = Number(listing.price) * Number(rentalDuration) + (Number(listing.deposit) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!moveInDate) {
      showToast('Please select a move-in or start date', 'error');
      return;
    }

    setLoading(true);
    try {
      await apiClient.createBooking({
        listing_id: listing.id,
        move_in_date: moveInDate,
        rental_duration_months: Number(rentalDuration),
        message: message || `Hi! I am interested in renting this for ${rentalDuration} month(s).`
      });

      setSubmitted(true);
      showToast('Booking request submitted to owner!');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      showToast(err.message || 'Failed to submit booking request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Request Sent!</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Your rental request has been sent to the owner. You can track status updates in your <span className="font-semibold text-slate-700">My Bookings</span> dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Book or Rent</span>
              <h2 className="text-xl font-bold text-slate-900 mt-1 line-clamp-1">{listing.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ${listing.price} / {listing.price_period || 'month'} • {listing.nearby_college || 'Campus Area'}
              </p>
            </div>

            {/* Move-in Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                Preferred Move-in / Start Date
              </label>
              <input
                type="date"
                required
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            {/* Rental Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                Duration (Months / Academic Term)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setRentalDuration(m)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      rentalDuration === m
                        ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m} {m === 1 ? 'Month' : 'Months'}
                  </button>
                ))}
              </div>
            </div>

            {/* Student Intro Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Message to Property/Item Owner
              </label>
              <textarea
                rows={3}
                placeholder="Introduce yourself! (e.g. university major, move-in preferences, quiet study habits)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Estimated Total Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Rent (${listing.price} × {rentalDuration} mo):</span>
                <span className="font-semibold text-slate-800">${listing.price * rentalDuration}</span>
              </div>
              {listing.deposit > 0 && (
                <div className="flex justify-between">
                  <span>Refundable Security Deposit:</span>
                  <span className="font-semibold text-slate-800">${listing.deposit}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Term Value:</span>
                <span className="text-teal-600 font-extrabold">${totalEstimate}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-brand-600 text-white font-bold text-sm shadow-lg shadow-teal-500/20 hover:brightness-105 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting Request...' : 'Send Rental Request to Owner'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
