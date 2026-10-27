import express from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockBookings, mockListings } from '../data/mockStore.js';
import { authenticateUser } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// POST /api/bookings - Student creates a booking/rental request
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { listing_id, move_in_date, rental_duration_months = 1, message } = req.body;

    if (!listing_id || !move_in_date) {
      return res.status(400).json({ error: 'Listing ID and move-in date are required' });
    }

    const listing = mockListings.find(l => l.id === listing_id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Security Rule: Owners cannot book their own listing
    if (listing.owner_id === req.user.id) {
      return res.status(400).json({ error: 'You cannot book your own listing' });
    }

    // Check duplicate pending requests from same student
    const duplicate = mockBookings.find(
      b => b.listing_id === listing_id && b.student_id === req.user.id && b.status === 'pending'
    );
    if (duplicate) {
      return res.status(400).json({ error: 'You already have a pending booking request for this rental' });
    }

    const newBooking = {
      id: crypto.randomUUID ? crypto.randomUUID() : `book-${Date.now()}`,
      listing_id,
      listing_title: listing.title,
      listing_image: listing.images?.[0] || '',
      listing_price: listing.price,
      listing_price_period: listing.price_period,
      student_id: req.user.id,
      student_name: req.user.full_name || 'Alex Rivera',
      student_email: req.user.email,
      move_in_date,
      rental_duration_months: Number(rental_duration_months),
      message: message || '',
      status: 'pending',
      owner_notes: '',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('booking_requests').insert([newBooking]).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    mockBookings.unshift(newBooking);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking request' });
  }
});

// GET /api/bookings/my - Student views their booking requests
router.get('/my', authenticateUser, async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*, listing:listing_id(title, price, price_period, images, location, nearby_college)')
        .eq('student_id', req.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.json(data);
    }

    const userBookings = mockBookings.filter(b => b.student_id === req.user.id);
    res.json(userBookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student bookings' });
  }
});

// GET /api/bookings/owner - Owner views incoming requests for their properties
router.get('/owner', authenticateUser, async (req, res) => {
  try {
    // Find all listings belonging to this owner
    const ownerListingIds = mockListings
      .filter(l => l.owner_id === req.user.id)
      .map(l => l.id);

    // If admin, show all
    if (req.user.role === 'admin') {
      return res.json(mockBookings);
    }

    const incoming = mockBookings.filter(b => ownerListingIds.includes(b.listing_id));
    res.json(incoming);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch owner bookings' });
  }
});

// PATCH /api/bookings/:id/status - Update booking status (accept, reject, cancel)
router.patch('/:id/status', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, owner_notes } = req.body;

    if (!['pending', 'accepted', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status' });
    }

    const booking = mockBookings.find(b => b.id === id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking request not found' });
    }

    const listing = mockListings.find(l => l.id === booking.listing_id);

    // Authorization checks
    if (status === 'cancelled') {
      // Students can cancel their own bookings
      if (booking.student_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only the requesting student can cancel this booking' });
      }
    } else if (status === 'accepted' || status === 'rejected') {
      // Security rule: Students CANNOT approve their own booking request
      if (booking.student_id === req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Students cannot accept or reject their own booking requests' });
      }
      // Must be owner or admin
      if (listing && listing.owner_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only the property owner can accept or reject this request' });
      }
    }

    booking.status = status;
    if (owner_notes !== undefined) {
      booking.owner_notes = owner_notes;
    }
    booking.updated_at = new Date().toISOString();

    res.json({ message: `Booking request marked as ${status}`, booking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

export default router;
