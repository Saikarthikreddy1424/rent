import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  GraduationCap, 
  Star, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ListingCard({ listing }) {
  const { favorites, toggleFavorite } = useAuth();
  const isFav = favorites.includes(listing.id);

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'room': return 'Private Room';
      case 'pg_hostel': return 'PG / Hostel';
      case 'flat': return 'Shared Flat';
      case 'furniture': return 'Furniture';
      case 'electronics': return 'Electronics';
      case 'bicycle': return 'Campus Bike';
      default: return 'Student Essential';
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'room': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'pg_hostel': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'flat': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'furniture': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'electronics': return 'bg-cyan-500/10 text-cyan-600 border-cyan-200';
      case 'bicycle': return 'bg-teal-500/10 text-teal-600 border-teal-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const primaryImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Link to={`/listings/${listing.id}`}>
          <img
            src={primaryImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(listing.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
            isFav
              ? 'bg-red-500 text-white scale-110 shadow-red-500/30'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-red-500 hover:scale-105'
          }`}
          title={isFav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Category Tag */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md bg-white/90 shadow-sm ${getCategoryColor(listing.category)}`}>
            {getCategoryLabel(listing.category)}
          </span>
          {listing.is_verified && (
            <span className="badge-verified text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified
            </span>
          )}
        </div>

        {/* Room Type / Occupancy Overlay */}
        {listing.room_type && listing.room_type !== 'item' && (
          <div className="absolute bottom-2.5 left-3">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-200 backdrop-blur-sm flex items-center gap-1">
              <Users className="w-3 h-3 text-teal-400" />
              {listing.room_type === 'single' ? 'Single Room' : listing.room_type === 'shared_2' ? 'Double Sharing' : listing.room_type === 'shared_3' ? 'Triple Sharing' : 'Entire Place'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* College Proximity Badge */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1 text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md">
              <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
              {listing.nearby_college || 'Campus Area'}
            </span>
            {listing.distance_to_college_km && (
              <span className="text-[11px] font-medium text-slate-500">
                {listing.distance_to_college_km} km away
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/listings/${listing.id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1 mb-1.5">
              {listing.title}
            </h3>
          </Link>

          {/* Location */}
          <p className="text-xs text-slate-500 flex items-center gap-1 mb-3 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {listing.location}, {listing.city}
          </p>

          {/* Amenities Chips (Top 3) */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {listing.amenities.slice(0, 3).map((amenity, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                  {amenity}
                </span>
              ))}
              {listing.amenities.length > 3 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 font-medium">
                  +{listing.amenities.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Rating Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-navy-900">${listing.price}</span>
              <span className="text-xs text-slate-500 font-medium">/ {listing.price_period || 'month'}</span>
            </div>
            {listing.deposit > 0 && (
              <span className="text-[10px] text-slate-400 block">${listing.deposit} deposit</span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{listing.rating || '5.0'}</span>
            {listing.review_count > 0 && (
              <span className="text-[10px] text-amber-600 font-normal">({listing.review_count})</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
