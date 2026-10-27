import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Calendar, 
  Heart, 
  Clock, 
  User, 
  Star, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Building2,
  ExternalLink
} from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';

export default function StudentDashboardPage() {
  const { user, updateUserProfile, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'favorites' | 'profile' | 'reviews'
  
  const [bookings, setBookings] = useState([]);
  const [favoritesListings, setFavoritesListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    college: user?.college || '',
    phone: user?.phone || '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const myBookings = await apiClient.getMyBookings();
      setBookings(myBookings || []);

      const favs = await apiClient.getFavorites();
      setFavoritesListings(favs || []);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) return;
    try {
      await apiClient.updateBookingStatus(bookingId, 'cancelled');
      showToast('Booking request cancelled');
      loadData();
    } catch (err) {
      showToast('Failed to cancel booking', 'error');
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(profileData);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted & Confirmed
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
            <XCircle className="w-3.5 h-3.5" /> Declined by Owner
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-teal-500/30 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt="Avatar"
          className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
        />
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold">{user?.full_name}</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
              Student Account
            </span>
          </div>
          <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
            <GraduationCap className="w-4 h-4 text-teal-400" />
            {user?.college || 'University Campus Member'} • {user?.email}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition shadow-sm"
          >
            Explore Rentals
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto text-sm font-bold">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'bookings'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Booking Requests ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'favorites'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Favorites ({favoritesListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'profile'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* TAB 1: BOOKING REQUESTS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No booking requests submitted yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore student rooms, PGs, or items near your college and send your preferred move-in dates.
              </p>
              <Link to="/explore" className="px-5 py-2.5 rounded-xl bg-teal-500 text-white text-xs font-bold inline-block">
                Browse Campus Listings
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={booking.listing_image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300'}
                      alt="listing"
                      className="w-24 h-20 rounded-2xl object-cover flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <Link
                        to={`/listings/${booking.listing_id}`}
                        className="text-base font-bold text-slate-900 hover:text-teal-600 flex items-center gap-1"
                      >
                        <span>{booking.listing_title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>Move-in: <strong className="text-slate-700">{booking.move_in_date}</strong></span>
                        <span>•</span>
                        <span>Duration: <strong className="text-slate-700">{booking.rental_duration_months} mo</strong></span>
                        <span>•</span>
                        <span>Price: <strong className="text-teal-600">${booking.listing_price || '850'} / mo</strong></span>
                      </div>
                      {booking.owner_notes && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl mt-1">
                          💬 <strong>Owner message:</strong> {booking.owner_notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    {getStatusBadge(booking.status)}

                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-bold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FAVORITES */}
      {activeTab === 'favorites' && (
        <div>
          {favoritesListings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">Your favorites shortlist is empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the heart icon on any room or item card to save it for easy comparison later.
              </p>
              <Link to="/explore" className="px-5 py-2.5 rounded-xl bg-teal-500 text-white text-xs font-bold inline-block">
                Discover Rentals
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritesListings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Student Profile Information</h3>
          
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                College or University
              </label>
              <input
                type="text"
                required
                value={profileData.college}
                onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm shadow-md transition"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
