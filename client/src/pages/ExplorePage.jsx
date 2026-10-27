import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  LayoutGrid, 
  Map, 
  SlidersHorizontal, 
  ArrowUpDown, 
  AlertCircle,
  Building2,
  X
} from 'lucide-react';
import ListingCard from '../components/ListingCard';
import FilterSidebar from '../components/FilterSidebar';
import MapView from '../components/MapView';
import { apiClient } from '../api/apiClient';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map' | 'split'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state initialized from URL query parameters
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    city: searchParams.get('city') || '',
    college: searchParams.get('college') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    maxDistance: searchParams.get('maxDistance') || '',
    roomType: searchParams.get('roomType') || '',
    amenities: searchParams.get('amenities') || '',
    isVerified: searchParams.get('isVerified') || '',
    isAvailable: searchParams.get('isAvailable') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  // Sync state when URL params change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: searchParams.get('category') || prev.category,
      college: searchParams.get('college') || prev.college,
      city: searchParams.get('city') || prev.city,
      maxPrice: searchParams.get('maxPrice') || prev.maxPrice,
    }));
  }, [searchParams]);

  // Fetch listings on filter changes
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const queryParams = { ...filters };
        if (queryParams.category === 'all') delete queryParams.category;
        
        const data = await apiClient.getListings(queryParams);
        setListings(data.listings || []);
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      city: '',
      college: '',
      minPrice: '',
      maxPrice: '',
      maxDistance: '',
      roomType: '',
      amenities: '',
      isVerified: '',
      isAvailable: '',
      sort: 'newest',
    });
    setSearchParams({});
  };

  const CATEGORY_TABS = [
    { id: 'all', label: 'All Rentals' },
    { id: 'room', label: 'Rooms & Shared' },
    { id: 'pg_hostel', label: 'PGs & Hostels' },
    { id: 'flat', label: 'Flats & Apts' },
    { id: 'furniture', label: 'Furniture' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'bicycle', label: 'Bicycles' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keywords, amenities, or street..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>

          {/* Right controls: View mode + Sort + Mobile filter trigger */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
            >
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="bg-transparent focus:outline-none font-semibold cursor-pointer text-xs"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="distance">Campus Proximity</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-lg transition hidden md:block ${viewMode === 'split' ? 'bg-white shadow-sm text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                title="Split Grid & Map"
              >
                <div className="flex gap-0.5">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <Map className="w-3.5 h-3.5" />
                </div>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'map' ? 'bg-white shadow-sm text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                title="Full Map View"
              >
                <Map className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORY_TABS.map((tab) => {
            const active = (filters.category === tab.id) || (tab.id === 'all' && (!filters.category || filters.category === 'all'));
            return (
              <button
                key={tab.id}
                onClick={() => setFilters({ ...filters, category: tab.id })}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-bold transition border ${
                  active
                    ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Content Area: Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-navy-950/70 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-6 space-y-4 ml-auto shadow-2xl relative">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-lg font-bold text-slate-900">Filter Rentals</h3>
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
              />
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-teal-500 text-white font-bold"
              >
                Show Results
              </button>
            </div>
          </div>
        )}

        {/* Listings Display Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Results count banner */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-900">{listings.length}</strong> rental{listings.length === 1 ? '' : 's'} available
              {filters.college && <span> near <strong className="text-teal-700">{filters.college}</strong></span>}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-slate-200/60 animate-pulse" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No matching student rentals found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, removing amenity filters, or selecting a nearby campus.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-teal-500 text-white text-xs font-bold hover:bg-teal-600 transition shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'map' ? (
            /* Full Map View */
            <div className="h-[650px] w-full">
              <MapView listings={listings} />
            </div>
          ) : viewMode === 'split' ? (
            /* Split Map & Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                {listings.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>
              <div className="h-[700px] sticky top-28">
                <MapView listings={listings} />
              </div>
            </div>
          ) : (
            /* Standard Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
