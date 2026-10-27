import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  Home, 
  Bed, 
  Building, 
  Armchair, 
  Laptop, 
  Bike, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Users,
  Compass
} from 'lucide-react';
import ListingCard from '../components/ListingCard';
import BudgetMatchBanner from '../components/BudgetMatchBanner';
import { apiClient } from '../api/apiClient';

const CATEGORIES = [
  { id: 'room', label: 'Rooms & Shared', desc: 'Furnished single & double rooms', icon: Bed, color: 'from-blue-500 to-indigo-600' },
  { id: 'pg_hostel', label: 'PG & Hostels', desc: 'Full co-living with meals & Wi-Fi', icon: Building, color: 'from-purple-500 to-pink-600' },
  { id: 'flat', label: 'Flats & Apartments', desc: '1-3 BHK student shared spaces', icon: Home, color: 'from-emerald-500 to-teal-600' },
  { id: 'furniture', label: 'Study Furniture', desc: 'Desks, ergonomic chairs & beds', icon: Armchair, color: 'from-amber-500 to-orange-600' },
  { id: 'electronics', label: 'Electronics', desc: 'Monitors, mini fridges & microwaves', icon: Laptop, color: 'from-cyan-500 to-blue-600' },
  { id: 'bicycle', label: 'Campus Bicycles', desc: 'Commuter bikes with locks & helmets', icon: Bike, color: 'from-teal-500 to-emerald-600' },
];

export default function HomePage() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hero Search States
  const [searchCity, setSearchCity] = useState('');
  const [searchCollege, setSearchCollege] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await apiClient.getListings({ limit: 6 });
        setFeaturedListings(data.listings || []);
      } catch (err) {
        console.error('Failed to load featured rentals', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.append('city', searchCity);
    if (searchCollege) params.append('college', searchCollege);
    if (searchCategory) params.append('category', searchCategory);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative hero-gradient text-white pt-14 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-[40px] shadow-2xl">
        {/* Glow ambient background rings */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Top trust pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-teal-300">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>The #1 Verified Rental Platform for College Students</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Find Affordable <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-brand-300">Housing & Essentials</span> Near Your Campus.
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Connect directly with verified property owners and item lenders. Rent private rooms, shared PGs, desks, and bicycles with zero broker fees.
          </p>

          {/* MULTI-TAB SEARCH BAR */}
          <div className="max-w-4xl mx-auto pt-4">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-slate-200 text-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
            >
              {/* City Input */}
              <div className="sm:col-span-4 flex items-center gap-3 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div className="text-left w-full">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">City / Locality</label>
                  <input
                    type="text"
                    placeholder="e.g. Palo Alto, Berkeley, Seattle"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* College Selector */}
              <div className="sm:col-span-4 flex items-center gap-3 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <GraduationCap className="w-5 h-5 text-brand-600 flex-shrink-0" />
                <div className="text-left w-full">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">University / College</label>
                  <input
                    type="text"
                    placeholder="Stanford, UC Berkeley, Harvard..."
                    value={searchCollege}
                    onChange={(e) => setSearchCollege(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="sm:col-span-3 flex items-center gap-2 px-3 py-2">
                <Home className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div className="text-left w-full">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    <option value="room">Private / Shared Room</option>
                    <option value="pg_hostel">PG & Hostel</option>
                    <option value="flat">Flat / Apartment</option>
                    <option value="furniture">Study Furniture</option>
                    <option value="electronics">Electronics</option>
                    <option value="bicycle">Campus Bicycle</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="sm:col-span-1 flex justify-center">
                <button
                  type="submit"
                  className="w-full sm:w-12 h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-brand-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 hover:scale-105 transition"
                  title="Search rentals"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs text-slate-300">
              <span className="font-semibold text-slate-400">Popular Campuses:</span>
              {['Stanford University', 'UC Berkeley', 'Harvard', 'MIT', 'UW Seattle'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => navigate(`/explore?college=${encodeURIComponent(c)}`)}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition text-slate-200"
                >
                  {c}
                </button>
              ))}
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 text-center border-t border-white/10">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-400">1,500+</p>
              <p className="text-xs text-slate-400">Student Listings</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">40+</p>
              <p className="text-xs text-slate-400">Universities Covered</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-400">0%</p>
              <p className="text-xs text-slate-400">Brokerage Fees</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">4.9★</p>
              <p className="text-xs text-slate-400">Verified Student Rating</p>
            </div>
          </div>

        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Explore Options</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Browse by Category</h2>
          </div>
          <Link to="/explore" className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-2 sm:mt-0">
            <span>View All Rentals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/explore?category=${cat.id}`}
                className="group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex items-start gap-4 relative overflow-hidden"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                  <span className="text-xs font-semibold text-teal-600 mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explore Listings →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SMART INNOVATION BANNER: BUDGET MATCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BudgetMatchBanner />
      </section>

      {/* FEATURED RENTALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Verified Accommodations & Gear
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured Student Listings</h2>
          </div>
          <Link to="/explore" className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-2 sm:mt-0">
            <span>Explore full catalog ({featuredListings.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-200/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* INNOVATIVE FEATURE HIGHLIGHTS */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Built for Student Life</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Why Students & Landlords Choose RentEase</h2>
            <p className="text-sm text-slate-500 mt-2">
              Everything an undergraduate or graduate needs to settle into campus life affordably.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Campus Proximity Matching</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter rentals by exact walking or bicycle distance to university lecture halls, labs, and student centers. Never run late for 8 AM classes again.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Roommate-Friendly Co-Living</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Discover shared flats with vetted college peers. Filter by occupancy (single or double sharing), study habits, and semester terms.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Verified Rental Guarantees</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every owner profile and property is checked against student safety standards. Only real students with confirmed stays can write verified rental reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION FOR OWNERS & STUDENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 text-white rounded-3xl p-10 sm:p-14 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Are you a Property or Item Owner?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              List your room or study equipment in under 3 minutes.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Reach thousands of college students seeking reliable housing and semester rentals. Manage booking requests, verify student IDs, and maintain full occupancy year-round.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/list-rental"
              className="px-8 py-4 rounded-xl bg-teal-500 text-slate-950 font-extrabold text-sm hover:bg-teal-400 transition text-center shadow-lg shadow-teal-500/25 whitespace-nowrap"
            >
              List a Rental Free
            </Link>
            <Link
              to="/explore"
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition text-center whitespace-nowrap"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
