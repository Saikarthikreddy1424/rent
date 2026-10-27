import express from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockReviews, mockBookings, mockListings } from '../data/mockStore.js';
import { authenticateUser } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// GET /api/reviews/listing/:listingId - Get reviews for a listing
router.get('/listing/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, user:user_id(full_name, avatar_url, role)')
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.json(data || []);
    }

    const reviews = mockReviews.filter(r => r.listing_id === listingId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews - Create review
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { listing_id, rating, comment } = req.body;

    if (!listing_id || !rating || !comment) {
      return res.status(400).json({ error: 'Listing ID, rating (1-5), and comment are required' });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check duplicate review
    const duplicate = mockReviews.find(r => r.listing_id === listing_id && r.user_id === req.user.id);
    if (duplicate) {
      return res.status(400).json({ error: 'You have already submitted a review for this listing. You can edit your existing review instead.' });
    }

    // Verify if student has an accepted booking for this listing
    const hasVerifiedRental = mockBookings.some(
      b => b.listing_id === listing_id && b.student_id === req.user.id && b.status === 'accepted'
    );

    const newReview = {
      id: crypto.randomUUID ? crypto.randomUUID() : `rev-${Date.now()}`,
      listing_id,
      user_id: req.user.id,
      user_name: req.user.full_name || 'RentEase Student',
      rating: numRating,
      comment,
      is_verified_rental: hasVerifiedRental,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('reviews').insert([newReview]).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    mockReviews.unshift(newReview);

    // Recalculate listing rating
    const listing = mockListings.find(l => l.id === listing_id);
    if (listing) {
      const listingReviews = mockReviews.filter(r => r.listing_id === listing_id);
      const avg = listingReviews.reduce((sum, r) => sum + r.rating, 0) / listingReviews.length;
      listing.rating = Number(avg.toFixed(1));
      listing.review_count = listingReviews.length;
    }

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// PUT /api/reviews/:id - Edit own review
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = mockReviews.find(r => r.id === id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to edit this review' });
    }

    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment;
    review.updated_at = new Date().toISOString();

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit review' });
  }
});

// DELETE /api/reviews/:id - Delete own review
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const index = mockReviews.findIndex(r => r.id === id);

    if (index === -1) return res.status(404).json({ error: 'Review not found' });

    const review = mockReviews[index];
    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this review' });
    }

    mockReviews.splice(index, 1);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;
