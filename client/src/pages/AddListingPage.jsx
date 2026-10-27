import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  GraduationCap, 
  Sparkles, 
  Upload, 
  Plus, 
  X, 
  CheckCircle,
  Users,
  ShieldCheck
} from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const AVAILABLE_AMENITIES = [
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
  'Balcony',
  'Parking Spot',
  'RO Purified Water'
];

export default function AddListingPage() {
  const { user, isOwner, isAdmin, showToast } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'room',
    price: '',
    price_period: 'month',
    deposit: '',
    location: '',
    city: '',
    nearby_college: 'Stanford University',
    distance_to_college_km: '0.8',
    room_type: 'single',
    gender_preference: 'any',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80'],
    amenities: ['High-Speed Wi-Fi', 'Furnished', 'Study Desk'],
    rental_rules: ['Quiet study hours after 10 PM', 'No smoking inside'],
    contact_phone: user?.phone || '+1 (555) 876-5432',
    contact_email: user?.email || 'owner@rentease.com'
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newRule, setNewRule] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAmenityToggle = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl.trim()] });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      setFormData({ ...formData, rental_rules: [...formData.rental_rules, newRule.trim()] });
      setNewRule('');
    }
  };

  const handleRemoveRule = (index) => {
    setFormData({ ...formData, rental_rules: formData.rental_rules.filter((_, i) => i !== index) });
  };

  const handleFillSample = () => {
    setFormData({
      title: 'Cozy Sunlit Attic Suite near UC Berkeley Haas',
      description: 'Charming private studio loft designed for university students. Features high-speed gigabit Wi-Fi, custom solid oak study desk, en-suite bathroom, and shared gourmet kitchen.',
      category: 'room',
      price: '780',
      price_period: 'month',
      deposit: '400',
      location: '2415 Dwight Way, Berkeley',
      city: 'Berkeley',
      nearby_college: 'UC Berkeley',
      distance_to_college_km: '0.5',
      room_type: 'single',
      gender_preference: 'any',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80'
      ],
      amenities: ['High-Speed Wi-Fi', 'Furnished', 'Study Desk', 'Air Conditioning', 'Laundry in Building'],
      rental_rules: ['Student ID required', 'Quiet hours 10 PM - 7 AM', 'No smoking'],
      contact_phone: '+1 (555) 876-5432',
      contact_email: 'marcus@berkeleyrentals.com'
    });
    showToast('Sample listing form populated!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.createListing(formData);
      showToast('Rental listing published successfully!');
      navigate('/owner-dashboard');
    } catch (err) {
      showToast(err.message || 'Failed to publish listing', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Owner Portal</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">List a Property or Student Item</h1>
            <p className="text-xs text-slate-500 mt-1">
              Provide accurate details to attract university students searching near campus.
            </p>
          </div>

          <button
            type="button"
            onClick={handleFillSample}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 font-bold text-xs transition self-start sm:self-auto shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Autofill Sample Data</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Listing Overview</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Listing Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modern Private Studio near Stanford Quad"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="room">Private / Shared Room</option>
                  <option value="pg_hostel">PG & Hostel (with meals/amenities)</option>
                  <option value="flat">Entire Flat / Apartment</option>
                  <option value="furniture">Study Furniture (Desks & Chairs)</option>
                  <option value="electronics">Electronics & Student Appliances</option>
                  <option value="bicycle">Campus Commuter Bicycle</option>
                  <option value="essentials">Other Student Essentials</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Room Type / Occupancy
                </label>
                <select
                  value={formData.room_type}
                  onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="single">Single Private Room</option>
                  <option value="shared_2">Double Sharing (2 Beds)</option>
                  <option value="shared_3">Triple Sharing (3 Beds)</option>
                  <option value="entire_flat">Entire Apartment / Flat</option>
                  <option value="item">Non-Housing Student Item</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description & Student Features *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Highlight study quiet hours, natural lighting, high-speed Wi-Fi, proximity to bus/shuttle routes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Deposit */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Pricing & Deposits</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Rental Price ($) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="850"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Billing Period
                </label>
                <select
                  value={formData.price_period}
                  onChange={(e) => setFormData({ ...formData, price_period: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="month">Per Month</option>
                  <option value="semester">Per Academic Semester</option>
                  <option value="day">Per Day (Short Term)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Security Deposit ($)
                </label>
                <input
                  type="number"
                  placeholder="300"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Campus Proximity & Location */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">3. Campus & Location Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nearby University / College *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stanford University"
                  value={formData.nearby_college}
                  onChange={(e) => setFormData({ ...formData, nearby_college: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Distance to Campus (km) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="0.8"
                  value={formData.distance_to_college_km}
                  onChange={(e) => setFormData({ ...formData, distance_to_college_km: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 452 College Ave"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palo Alto"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Amenities Checklist */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">4. Amenities Included</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const checked = formData.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition text-left ${
                      checked
                        ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                      checked ? 'bg-teal-600 text-white' : 'border border-slate-300'
                    }`}>
                      {checked && '✓'}
                    </span>
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Photos & Rules */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">5. Photos & House Rules</h3>
            
            {/* Image URLs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Add Photo URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2.5 rounded-xl bg-teal-500 text-white font-bold text-xs hover:bg-teal-600"
                >
                  Add Image
                </button>
              </div>

              {/* Thumbnails list */}
              <div className="flex flex-wrap gap-3 mt-3">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative w-24 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition shadow"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules list */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Add House Rule / Term
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Quiet hours 10 PM - 7 AM"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900"
                >
                  Add Rule
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.rental_rules.map((rule, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                    <span>{rule}</span>
                    <button type="button" onClick={() => handleRemoveRule(idx)} className="text-slate-400 hover:text-red-500">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Contact Info */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">6. Owner Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-brand-600 hover:brightness-105 text-white font-extrabold text-base shadow-xl shadow-teal-500/25 transition disabled:opacity-50"
          >
            {loading ? 'Publishing Student Rental...' : 'Publish Rental Listing Now'}
          </button>
        </form>

      </div>
    </div>
  );
}
