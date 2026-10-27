import express from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockReports, mockListings, mockUsers } from '../data/mockStore.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// POST /api/reports - Users report suspicious listing or user
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { listing_id, reported_user_id, reason, details } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Reason for report is required' });
    }

    const listing = listing_id ? mockListings.find(l => l.id === listing_id) : null;

    const newReport = {
      id: crypto.randomUUID ? crypto.randomUUID() : `rep-${Date.now()}`,
      reporter_id: req.user.id,
      reporter_name: req.user.full_name,
      listing_id: listing_id || null,
      listing_title: listing?.title || 'General Report',
      reported_user_id: reported_user_id || null,
      reason,
      details: details || '',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('reports').insert([newReport]).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    mockReports.unshift(newReport);
    res.status(201).json({ message: 'Report submitted for administrative review', report: newReport });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// GET /api/reports - Admin views reports
router.get('/', authenticateUser, requireRole('admin'), async (req, res) => {
  try {
    res.json(mockReports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// PATCH /api/reports/:id - Admin updates report status
router.patch('/:id', authenticateUser, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, action } = req.body;

    const report = mockReports.find(r => r.id === id);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    if (status) report.status = status;

    // Optional admin action: remove listing if flagged
    if (action === 'delete_listing' && report.listing_id) {
      const idx = mockListings.findIndex(l => l.id === report.listing_id);
      if (idx > -1) mockListings.splice(idx, 1);
      report.status = 'action_taken';
    }

    res.json({ message: 'Report updated', report });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update report' });
  }
});

export default router;
