import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, XCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function BookingsPage() {
  const { user, isOwner, isAdmin, showToast } = useAuth();
  const [viewType, setViewType] = useState(isOwner ? 'owner' : 'student');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      if (viewType === 'owner') {
        const data = await apiClient.getOwnerBookings();
        setBookings(data || []);
      } else {
        const data = await apiClient.getMyBookings();
        setBookings(data || []);
      }
    } catch (err) {
      console.error('Error fetching bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [viewType]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await apiClient.updateBookingStatus(id, status);
      showToast(`Request updated to ${status}`);
      fetchBookings();
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Bookings & Leases</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Rental Requests Tracker</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track move-in dates, terms, and status between students and property owners.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setViewType('student')}
            className={`px-4 py-2 rounded-xl transition ${
              viewType === 'student' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎓 Sent Requests (Student)
          </button>
          <button
            onClick={() => setViewType('owner')}
            className={`px-4 py-2 rounded-xl transition ${
              viewType === 'owner' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏠 Received Requests (Owner)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => <div key={n} className="h-28 rounded-3xl bg-slate-200/60 animate-pulse" />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">
            No {viewType === 'owner' ? 'received' : 'sent'} requests found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse through student rentals or list your property to start receiving verified booking requests.
          </p>
          <Link to="/explore" className="px-5 py-2.5 rounded-xl bg-teal-500 text-white font-bold text-xs inline-block">
            Browse Rentals Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <img
                  src={b.listing_image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300'}
                  alt="listing"
                  className="w-20 h-16 rounded-2xl object-cover flex-shrink-0"
                />
                <div className="space-y-1">
                  <Link
                    to={`/listings/${b.listing_id}`}
                    className="text-base font-bold text-slate-900 hover:text-teal-600 flex items-center gap-1"
                  >
                    <span>{b.listing_title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                  <p className="text-xs text-slate-500">
                    Move-in: <strong className="text-slate-800">{b.move_in_date}</strong> • Term: <strong className="text-slate-800">{b.rental_duration_months} mo</strong>
                  </p>
                  {viewType === 'owner' && (
                    <p className="text-xs text-teal-700 font-semibold">
                      Student: {b.student_name} ({b.student_email})
                    </p>
                  )}
                  {b.message && (
                    <p className="text-xs text-slate-600 italic">"{b.message}"</p>
                  )}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  b.status === 'accepted' ? 'bg-teal-100 text-teal-800' :
                  b.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  b.status === 'cancelled' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800'
                }`}>
                  ● {b.status?.toUpperCase()}
                </span>

                {viewType === 'owner' && b.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(b.id, 'accepted')}
                      className="px-3 py-1.5 rounded-xl bg-teal-500 text-white font-bold text-xs hover:bg-teal-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(b.id, 'rejected')}
                      className="px-3 py-1.5 rounded-xl bg-red-100 text-red-700 font-bold text-xs hover:bg-red-200"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {viewType === 'student' && b.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                    className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
