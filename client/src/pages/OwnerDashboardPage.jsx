import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  PlusCircle, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit3, 
  Clock, 
  ExternalLink,
  Users,
  Eye,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function OwnerDashboardPage() {
  const { user, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'requests'
  
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal for responding to request
  const [respondingTo, setRespondingTo] = useState(null);
  const [ownerNote, setOwnerNote] = useState('');

  const loadOwnerData = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getListings();
      // Filter listings for this owner or all if in demo
      const ownerListings = (data.listings || []).filter(l => l.owner_id === user?.id || user?.role === 'admin' || true);
      setListings(ownerListings);

      const ownerRequests = await apiClient.getOwnerBookings();
      setRequests(ownerRequests || []);
    } catch (err) {
      console.error('Failed to load owner data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerData();
  }, [user]);

  const handleToggleAvailability = async (listingId, currentStatus) => {
    try {
      await apiClient.toggleListingAvailability(listingId, !currentStatus);
      showToast(`Listing marked as ${!currentStatus ? 'Available' : 'Booked/Unavailable'}`);
      setListings(listings.map(l => l.id === listingId ? { ...l, is_available: !currentStatus } : l));
    } catch (err) {
      showToast('Failed to update availability', 'error');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing permanently?')) return;
    try {
      await apiClient.deleteListing(listingId);
      showToast('Listing removed successfully');
      setListings(listings.filter(l => l.id !== listingId));
    } catch (err) {
      showToast('Failed to delete listing', 'error');
    }
  };

  const handleBookingAction = async (bookingId, status) => {
    try {
      await apiClient.updateBookingStatus(bookingId, status, ownerNote);
      showToast(`Booking request marked as ${status}`);
      setRespondingTo(null);
      setOwnerNote('');
      loadOwnerData();
    } catch (err) {
      showToast('Failed to update booking status', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase">
              Property Partner Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Welcome, {user?.full_name}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your student rentals, review prospective student tenants, and approve booking terms.
          </p>
        </div>

        <Link
          to="/list-rental"
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-brand-500 text-white font-extrabold text-sm hover:brightness-110 shadow-lg shadow-teal-500/20 transition whitespace-nowrap"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add New Rental</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Listings</p>
          <p className="text-2xl font-extrabold text-slate-900">{listings.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-semibold uppercase">Pending Requests</p>
          <p className="text-2xl font-extrabold text-amber-600">
            {requests.filter(r => r.status === 'pending').length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-semibold uppercase">Confirmed Bookings</p>
          <p className="text-2xl font-extrabold text-teal-600">
            {requests.filter(r => r.status === 'accepted').length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-semibold uppercase">Owner Rating</p>
          <p className="text-2xl font-extrabold text-slate-900">4.9 ★</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-sm font-bold">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'listings'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>My Listings ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition relative ${
            activeTab === 'requests'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Incoming Student Requests ({requests.length})</span>
          {requests.some(r => r.status === 'pending') && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </button>
      </div>

      {/* TAB 1: MY LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {listings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">You have no active listings yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add your available rooms, student PGs, study furniture, or campus commuter bicycles.
              </p>
              <Link to="/list-rental" className="px-5 py-2.5 rounded-xl bg-teal-500 text-white text-xs font-bold inline-block">
                Create Listing Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                      <img src={item.images?.[0]} alt={item.title} className="w-full h-full object-cover" />
                      <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.is_available ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-200'
                      }`}>
                        {item.is_available ? 'Available' : 'Booked'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-slate-500">{item.location}, {item.city}</p>
                      <p className="text-sm font-extrabold text-navy-900 mt-1">${item.price} / {item.price_period}</p>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                    {/* Availability toggle */}
                    <button
                      onClick={() => handleToggleAvailability(item.id, item.is_available)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                        item.is_available
                          ? 'bg-teal-50 text-teal-700 border-teal-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                      title="Toggle availability"
                    >
                      {item.is_available ? <ToggleRight className="w-4 h-4 text-teal-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                      <span>{item.is_available ? 'Mark Occupied' : 'Mark Available'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/listings/${item.id}`}
                        className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDeleteListing(item.id)}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INCOMING BOOKING REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No incoming booking requests yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When students request your room or essential item, you will be able to review their student credentials and approve the booking here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                          Student Request
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'accepted' ? 'bg-teal-100 text-teal-800' :
                          req.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          ● {req.status?.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{req.listing_title}</h4>
                      <p className="text-xs text-slate-500">
                        Student: <strong className="text-slate-700">{req.student_name}</strong> ({req.student_email})
                      </p>
                    </div>

                    <div className="text-left sm:text-right text-xs text-slate-500">
                      <p>Move-In: <strong className="text-slate-800">{req.move_in_date}</strong></p>
                      <p>Duration: <strong className="text-slate-800">{req.rental_duration_months} Months</strong></p>
                    </div>
                  </div>

                  {req.message && (
                    <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-600 border border-slate-100">
                      <strong>Student Note:</strong> "{req.message}"
                    </div>
                  )}

                  {/* Actions for Pending Requests */}
                  {req.status === 'pending' && (
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="text"
                        placeholder="Optional note / check-in instructions to student..."
                        value={respondingTo === req.id ? ownerNote : ''}
                        onChange={(e) => { setRespondingTo(req.id); setOwnerNote(e.target.value); }}
                        className="w-full sm:flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleBookingAction(req.id, 'accepted')}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept & Confirm</span>
                        </button>
                        <button
                          onClick={() => handleBookingAction(req.id, 'rejected')}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
