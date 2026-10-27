import express from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockFavorites, mockListings } from '../data/mockStore.js';
import { authenticateUser } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// GET /api/favorites - Get user saved listings
router.get('/', authenticateUser, async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('favorites')
        .select('*, listing:listing_id(*)')
        .eq('user_id', req.user.id);
      if (error) throw error;
      return res.json(data.map(f => f.listing));
    }

    const userFavs = mockFavorites.filter(f => f.user_id === req.user.id);
    const listings = userFavs
      .map(f => mockListings.find(l => l.id === f.listing_id))
      .filter(Boolean);

    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve favorites' });
  }
});

// POST /api/favorites/toggle - Add or remove favorite
router.post('/toggle', authenticateUser, async (req, res) => {
  try {
    const { listing_id } = req.body;
    if (!listing_id) return res.status(400).json({ error: 'Listing ID is required' });

    const existingIndex = mockFavorites.findIndex(
      f => f.user_id === req.user.id && f.listing_id === listing_id
    );

    let isFavorite = false;
    if (existingIndex > -1) {
      mockFavorites.splice(existingIndex, 1);
      isFavorite = false;
    } else {
      mockFavorites.push({
        id: crypto.randomUUID ? crypto.randomUUID() : `fav-${Date.now()}`,
        user_id: req.user.id,
        listing_id,
        created_at: new Date().toISOString()
      });
      isFavorite = true;
    }

    res.json({ isFavorite, message: isFavorite ? 'Added to favorites' : 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

export default router;
