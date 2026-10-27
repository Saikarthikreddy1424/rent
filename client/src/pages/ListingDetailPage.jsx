import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Heart, 
  Share2, 
  Star, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft,
  Clock,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import BookingModal from '../components/BookingModal';
import ReviewModal from '../components/ReviewModal';
import ReportModal from '../components/ReportModal';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, favorites, toggleFavorite, showToast } = useAuth();

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getListingById(id);
      setListing(data);

      const reviewData = await apiClient.getListingReviews(id);
      setReviews(reviewData || []);
    } catch (err) {
      console.error('Failed to load listing details', err);
      showToast('Listing not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-[450px] bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Rental Not Found</h2>
        <Link to="/explore" className="px-5 py-2.5 rounded-xl bg-teal-500 text-white font-bold text-sm inline-block">
          Return to Explore
        </Link>
      </div>
    );
  }

  const isFav = favorites.includes(listing.id);
  const images = listing.images && listing.images.length > 0 ? listing.images : [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button & Action controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard!');
              }
            }}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Share rental"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleFavorite(listing.id)}
            className={`p-2.5 rounded-xl border transition ${
              isFav ? 'bg-red-500 text-white border-red-500 shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:text-red-500'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => setReportModalOpen(true)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition text-xs font-semibold flex items-center gap-1"
            title="Report suspicious listing"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>
      </div>

      {/* PHOTO GALLERY */}
      <div className="space-y-3">
        {/* Main Large Image */}
        <div className="relative aspect-[21/9] sm:aspect-[16/7] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-lg">
          <img
            src={images[activeImageIdx]}
            alt={listing.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-md uppercase">
              {listing.category?.replace('_', ' ')}
            </span>
            {listing.is_verified && (
              <span className="badge-verified text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Verified Rental
              </span>
            )}
          </div>
        </div>

        {/* Thumbnails row */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`w-24 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                  activeImageIdx === idx ? 'border-teal-500 scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TITLE & BASIC INFO BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Details, Amenities, Rules, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg w-max mb-2">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              <span>{listing.nearby_college || 'Campus Area'}</span>
              {listing.distance_to_college_km && (
                <span>• {listing.distance_to_college_km} km away</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {listing.title}
            </h1>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              {listing.location}, {listing.city}
            </p>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="text-lg font-bold text-slate-900">About this Student Rental</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Amenities & Inclusions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {listing.amenities?.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                  <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules & Requirements */}
          {listing.rental_rules && listing.rental_rules.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">House Rules & Terms</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {listing.rental_rules.map((rule, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Map Location */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Campus Location</h3>
              <span className="text-xs font-semibold text-teal-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {listing.location}
              </span>
            </div>
            <div className="h-64 rounded-2xl overflow-hidden">
              <MapView listings={[listing]} activeListingId={listing.id} />
            </div>
          </div>

          {/* REVIEWS & RATINGS SECTION */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Student Reviews & Ratings</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-bold text-slate-900">{listing.rating || '5.0'}</span>
                  </div>
                  <span className="text-xs text-slate-400">({reviews.length} reviews)</span>
                </div>
              </div>

              <button
                onClick={() => setReviewModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                Write Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No reviews yet. Be the first student to review this rental!
              </p>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{rev.user_name || rev.user?.full_name || 'Student'}</p>
                          <div className="flex items-center gap-1">
                            <div className="flex text-amber-400">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                            {rev.is_verified_rental && (
                              <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-1.5 py-0.2 rounded">
                                ✓ Verified Tenant
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-10">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Sticky Column: Price, Booking CTA & Owner Details */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
          
          {/* Booking / Rental Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xl space-y-6">
            
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rental Price</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-navy-900">${listing.price}</span>
                <span className="text-sm font-semibold text-slate-500">/ {listing.price_period || 'month'}</span>
              </div>
              {listing.deposit > 0 && (
                <p className="text-xs text-slate-400 mt-1">
                  ${listing.deposit} refundable security deposit
                </p>
              )}
            </div>

            {/* Availability status */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <span className="font-semibold text-slate-600">Availability:</span>
              <span className={`font-bold px-2 py-0.5 rounded-full ${
                listing.is_available ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700'
              }`}>
                {listing.is_available ? '● Available Now' : '● Booked'}
              </span>
            </div>

            {/* Request Booking CTA */}
            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-brand-600 hover:brightness-105 text-white font-extrabold text-sm shadow-xl shadow-teal-500/25 transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Send Booking Request</span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              No immediate charge. The owner reviews your request first.
            </p>

            {/* Property / Item Owner Contact Box */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Listed by Owner
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={listing.owner?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'}
                  alt="owner"
                  className="w-11 h-11 rounded-full object-cover border-2 border-teal-500"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {listing.owner?.full_name || listing.owner_name || 'Marcus Vance'}
                  </h4>
                  <p className="text-xs text-teal-600 font-medium">Verified Property Partner</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-600">
                <a
                  href={`tel:${listing.contact_phone || '+15558765432'}`}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 font-semibold text-slate-800 transition"
                >
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span>{listing.contact_phone || '+1 (555) 876-5432'}</span>
                </a>
                <a
                  href={`mailto:${listing.contact_email || 'owner@rentease.com'}`}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 font-semibold text-slate-800 transition"
                >
                  <Mail className="w-4 h-4 text-brand-600" />
                  <span>{listing.contact_email || 'owner@rentease.com'}</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* MODALS */}
      <BookingModal
        listing={listing}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onSuccess={() => fetchDetails()}
      />

      <ReviewModal
        listingId={listing.id}
        listingTitle={listing.title}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onReviewAdded={() => fetchDetails()}
      />

      <ReportModal
        listingId={listing.id}
        listingTitle={listing.title}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

    </div>
  );
}
