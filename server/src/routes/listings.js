import express from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockListings, mockUsers } from '../data/mockStore.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// GET /api/listings - Browse & Filter Listings
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      city,
      college,
      roomType,
      amenities,
      isAvailable,
      isVerified,
      sort,
      maxDistance,
      page = 1,
      limit = 20
    } = req.query;

    if (isSupabaseConfigured) {
      let query = supabase.from('listings').select('*', { count: 'exact' });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (city) {
        query = query.ilike('city', `%${city}%`);
      }
      if (college) {
        query = query.ilike('nearby_college', `%${college}%`);
      }
      if (roomType && roomType !== 'all') {
        query = query.eq('room_type', roomType);
      }
      if (minPrice) {
        query = query.gte('price', Number(minPrice));
      }
      if (maxPrice) {
        query = query.lte('price', Number(maxPrice));
      }
      if (isAvailable !== undefined && isAvailable !== '') {
        query = query.eq('is_available', isAvailable === 'true');
      }
      if (isVerified === 'true') {
        query = query.eq('is_verified', true);
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%,nearby_college.ilike.%${search}%`);
      }

      // Sort
      if (sort === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (sort === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;

      return res.json({
        listings: data || [],
        total: count || 0,
        page: Number(page),
        limit: Number(limit)
      });
    }

    // Fallback: Local Data Store
    let results = [...mockListings];

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.nearby_college.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'all') {
      results = results.filter(item => item.category === category);
    }

    if (city) {
      results = results.filter(item => item.city.toLowerCase().includes(city.toLowerCase()));
    }

    if (college) {
      results = results.filter(item => item.nearby_college.toLowerCase().includes(college.toLowerCase()));
    }

    if (roomType && roomType !== 'all') {
      results = results.filter(item => item.room_type === roomType);
    }

    if (minPrice) {
      results = results.filter(item => item.price >= Number(minPrice));
    }

    if (maxPrice) {
      results = results.filter(item => item.price <= Number(maxPrice));
    }

    if (maxDistance) {
      results = results.filter(item => item.distance_to_college_km <= Number(maxDistance));
    }

    if (isAvailable !== undefined && isAvailable !== '') {
      results = results.filter(item => item.is_available === (isAvailable === 'true'));
    }

    if (isVerified === 'true') {
      results = results.filter(item => item.is_verified);
    }

    if (amenities) {
      const amenityList = Array.isArray(amenities) ? amenities : amenities.split(',');
      results = results.filter(item => 
        amenityList.every(a => item.amenities?.some(ia => ia.toLowerCase().includes(a.trim().toLowerCase())))
      );
    }

    // Sorting
    if (sort === 'price_asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'distance') {
      results.sort((a, b) => (a.distance_to_college_km || 99) - (b.distance_to_college_km || 99));
    } else {
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + Number(limit));

    res.json({
      listings: paginated,
      total: results.length,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    console.error('Fetch listings error:', error);
    res.status(500).json({ error: 'Failed to retrieve listings' });
  }
});

// GET /api/listings/recommendations - Smart Recommendations for Students
router.get('/recommendations', async (req, res) => {
  try {
    const { college, budget, category } = req.query;
    let recs = [...mockListings];

    if (college) {
      recs = recs.filter(r => r.nearby_college.toLowerCase().includes(college.toLowerCase()));
    }
    if (budget) {
      recs = recs.filter(r => r.price <= Number(budget));
    }
    if (category) {
      recs = recs.filter(r => r.category === category);
    }

    // If filtered list is small, supplement with top rated
    if (recs.length < 3) {
      const topRated = mockListings
        .filter(l => !recs.some(r => r.id === l.id))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));
      recs = [...recs, ...topRated].slice(0, 4);
    }

    res.json(recs.slice(0, 4));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// GET /api/listings/:id - Listing Details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          owner:owner_id(id, full_name, email, phone, avatar_url),
          reviews:reviews(*, user:user_id(full_name, avatar_url))
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      return res.json(data);
    }

    const listing = mockListings.find(l => l.id === id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Attach owner info
    const owner = mockUsers.find(u => u.id === listing.owner_id) || {
      id: listing.owner_id,
      full_name: listing.owner_name || 'Verified Landlord',
      email: listing.contact_email,
      phone: listing.contact_phone,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    };

    res.json({ ...listing, owner });
  } catch (error) {
    console.error('Listing detail error:', error);
    res.status(500).json({ error: 'Failed to fetch listing detail' });
  }
});

// POST /api/listings - Create New Rental Listing (Owner or Admin only)
router.post('/', authenticateUser, requireRole('owner', 'admin'), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      price_period = 'month',
      deposit = 0,
      location,
      city,
      nearby_college,
      distance_to_college_km = 1.0,
      latitude = 37.7749,
      longitude = -122.4194,
      images = [],
      amenities = [],
      rental_rules = [],
      room_type = 'single',
      gender_preference = 'any',
      contact_phone,
      contact_email
    } = req.body;

    if (!title || !description || !category || !price || !location || !city || !nearby_college) {
      return res.status(400).json({ error: 'Missing required listing fields' });
    }

    const newListing = {
      id: crypto.randomUUID ? crypto.randomUUID() : `list-${Date.now()}`,
      owner_id: req.user.id,
      owner_name: req.user.full_name,
      title,
      description,
      category,
      price: Number(price),
      price_period,
      deposit: Number(deposit),
      location,
      city,
      nearby_college,
      distance_to_college_km: Number(distance_to_college_km),
      latitude: Number(latitude),
      longitude: Number(longitude),
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80'],
      amenities,
      rental_rules,
      room_type,
      gender_preference,
      is_verified: req.user.role === 'admin',
      is_available: true,
      contact_phone: contact_phone || req.user.phone || '+1 (555) 000-0000',
      contact_email: contact_email || req.user.email,
      rating: 5.0,
      review_count: 0,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('listings')
        .insert([newListing])
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    mockListings.unshift(newListing);
    res.status(201).json(newListing);
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// PUT /api/listings/:id - Update Listing (Owner or Admin)
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const index = mockListings.findIndex(l => l.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const listing = mockListings[index];
    if (listing.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to update this listing' });
    }

    const updated = {
      ...listing,
      ...req.body,
      id: listing.id,
      owner_id: listing.owner_id,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('listings')
        .update(updated)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.json(data);
    }

    mockListings[index] = updated;
    res.json(updated);
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// PATCH /api/listings/:id/availability - Toggle Availability
router.patch('/:id/availability', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;

    const listing = mockListings.find(l => l.id === id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    if (listing.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to change availability' });
    }

    listing.is_available = is_available;
    res.json({ message: 'Availability updated', is_available: listing.is_available });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

// DELETE /api/listings/:id - Delete Listing
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const index = mockListings.findIndex(l => l.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const listing = mockListings[index];
    if (listing.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to delete this listing' });
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (error) throw error;
    }

    mockListings.splice(index, 1);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

export default router;
