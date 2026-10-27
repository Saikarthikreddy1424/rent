import express from 'express';
import { mockListings, mockUsers, mockBookings, mockReviews, mockReports } from '../data/mockStore.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/stats - Basic Platform Statistics
router.get('/stats', authenticateUser, requireRole('admin'), (req, res) => {
  try {
    const totalListings = mockListings.length;
    const verifiedListings = mockListings.filter(l => l.is_verified).length;
    const availableListings = mockListings.filter(l => l.is_available).length;
    const totalUsers = mockUsers.length;
    const studentCount = mockUsers.filter(u => u.role === 'student').length;
    const ownerCount = mockUsers.filter(u => u.role === 'owner').length;
    const totalBookings = mockBookings.length;
    const acceptedBookings = mockBookings.filter(b => b.status === 'accepted').length;
    const pendingBookings = mockBookings.filter(b => b.status === 'pending').length;
    const pendingReports = mockReports.filter(r => r.status === 'pending').length;

    res.json({
      totalListings,
      verifiedListings,
      availableListings,
      totalUsers,
      studentCount,
      ownerCount,
      totalBookings,
      acceptedBookings,
      pendingBookings,
      pendingReports,
      totalReviews: mockReviews.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve admin stats' });
  }
});

// GET /api/admin/users - User Management
router.get('/users', authenticateUser, requireRole('admin'), (req, res) => {
  res.json(mockUsers);
});

// PATCH /api/admin/listings/:id/verify - Admin toggle verified status
router.patch('/listings/:id/verify', authenticateUser, requireRole('admin'), (req, res) => {
  try {
    const { id } = req.params;
    const { is_verified } = req.body;

    const listing = mockListings.find(l => l.id === id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    listing.is_verified = is_verified !== undefined ? is_verified : !listing.is_verified;
    res.json({ message: 'Listing verification status updated', is_verified: listing.is_verified });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify listing' });
  }
});

export default router;
