import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  DollarSign, 
  Building2, 
  ShieldCheck, 
  Check, 
  GraduationCap, 
  SlidersHorizontal 
} from 'lucide-react';

const COMMON_AMENITIES = [
  'High-Speed Wi-Fi',
  'Furnished',
  'Laundry in Building',
  'Air Conditioning',
  'Study Desk',
  'Meal Service (3x)',
  'Power Backup',
  'Biometric Security',
  'Bicycle Rack',
  'Full Kitchen',
  'Balcony'
];

const POPULAR_COLLEGES = [
  'Stanford University',
  'UC Berkeley',
  'Harvard University',
  'MIT',
  'Columbia University',
  'University of Washington'
];

export default function FilterSidebar({
  filters,
  setFilters,
  onReset
}) {
  const handleAmenityToggle = (amenity) => {
    const current = filters.amenities ? filters.amenities.split(',').filter(Boolean) : [];
    let updated;
    if (current.includes(amenity)) {
      updated = current.filter(a => a !== amenity);
    } else {
      updated = [...current, amenity];
    }
    setFilters({ ...filters, amenities: updated.join(',') });
  };

  const selectedAmenities = filters.amenities ? filters.amenities.split(',').filter(Boolean) : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <SlidersHorizontal className="w-5 h-5 text-teal-600" />
          <span>Filters & Match</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-teal-600 flex items-center gap-1 font-semibold transition"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* College Proximity Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-teal-600" />
          Near Campus / University
        </label>
        <select
          value={filters.college || ''}
          onChange={(e) => setFilters({ ...filters, college: e.target.value })}
          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition font-medium"
        >
          <option value="">Any University Campus</option>
          {POPULAR_COLLEGES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Maximum Distance to Campus */}
      <div>
        <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          <span>Max Campus Distance</span>
          <span className="text-teal-600">{filters.maxDistance || 'Any'} km</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="10"
          step="0.5"
          value={filters.maxDistance || 10}
          onChange={(e) => setFilters({ ...filters, maxDistance: e.target.value })}
          className="w-full accent-teal-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>0.5 km (Walking)</span>
          <span>10 km</span>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-teal-600" />
          Monthly / Rental Budget
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 mb-1 block">Min ($)</span>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 mb-1 block">Max ($)</span>
            <input
              type="number"
              placeholder="2000"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Room Type & Occupancy */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Room Type / Sharing
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { id: 'all', label: 'All Types' },
            { id: 'single', label: 'Single Private' },
            { id: 'shared_2', label: 'Double Sharing' },
            { id: 'entire_flat', label: 'Entire Flat' },
            { id: 'item', label: 'Item Only' },
          ].map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => setFilters({ ...filters, roomType: type.id === 'all' ? '' : type.id })}
              className={`px-2.5 py-2 rounded-xl text-left font-medium transition border ${
                (filters.roomType === type.id || (!filters.roomType && type.id === 'all'))
                  ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verified & Availability Toggles */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isVerified === 'true'}
            onChange={(e) => setFilters({ ...filters, isVerified: e.target.checked ? 'true' : '' })}
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600"
          />
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            Verified Listings Only
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isAvailable === 'true'}
            onChange={(e) => setFilters({ ...filters, isAvailable: e.target.checked ? 'true' : '' })}
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600"
          />
          <span className="text-xs font-semibold text-slate-700">
            Available Now (Instant Move-In)
          </span>
        </label>
      </div>

      {/* Amenities Checklist */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Student Amenities
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {COMMON_AMENITIES.map((amenity) => {
            const checked = selectedAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 accent-teal-600"
                />
                <span className={checked ? 'font-semibold text-teal-700' : ''}>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>

    </div>
  );
}
