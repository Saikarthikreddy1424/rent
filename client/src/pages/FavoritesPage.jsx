import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ArrowRight } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function FavoritesPage() {
  const { favorites } = useAuth();
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavs = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getFavorites();
        setFavoriteListings(data || []);
      } catch (err) {
        console.error('Failed to load favorites', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavs();
  }, [favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Shortlist</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Saved Rentals & Gear</h1>
        <p className="text-xs text-slate-500 mt-1">
          Compare your shortlisted rooms, shared PGs, desks, and electronics before sending requests.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => <div key={n} className="h-80 rounded-2xl bg-slate-200/60 animate-pulse" />)}
        </div>
      ) : favoriteListings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Your favorites shortlist is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse through university campus rentals and click the heart icon to save listings.
          </p>
          <Link
            to="/explore"
            className="px-6 py-3 rounded-xl bg-teal-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md hover:bg-teal-600 transition"
          >
            <span>Explore Campus Rentals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteListings.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      )}
    </div>
  );
}
