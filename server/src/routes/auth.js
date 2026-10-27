import express from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockUsers } from '../data/mockStore.js';
import { authenticateUser } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, role = 'student', phone, college } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    if (!['student', 'owner', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role must be student, owner, or admin' });
    }

    if (isSupabaseConfigured) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, role, phone, college }
        }
      });

      if (authError) return res.status(400).json({ error: authError.message });

      // Create or update profiles row
      if (authData.user) {
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          email,
          full_name,
          role,
          phone,
          college
        });
      }

      return res.status(201).json({
        message: 'Registration successful',
        user: {
          id: authData.user.id,
          email,
          full_name,
          role,
          phone,
          college
        },
        session: authData.session
      });
    }

    // Demo / Local Mode
    const existing = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`,
      email,
      full_name,
      role,
      phone: phone || '',
      college: college || (role === 'student' ? 'Local University' : ''),
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`,
      created_at: new Date().toISOString()
    };

    mockUsers.push(newUser);

    res.status(201).json({
      message: 'Registration successful',
      user: newUser,
      token: `demo-token-${newUser.id}`
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register account' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return res.status(401).json({ error: error.message });

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return res.json({
        user: profile || data.user,
        session: data.session
      });
    }

    // Demo Mode: Allow login with existing mock user or auto-authenticate
    let user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // If user logs in with sample credentials, provide demo profile
      user = {
        id: crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        role: email.includes('owner') ? 'owner' : email.includes('admin') ? 'admin' : 'student',
        phone: '+1 (555) 123-4567',
        college: 'State University',
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
        created_at: new Date().toISOString()
      };
      mockUsers.push(user);
    }

    res.json({
      message: 'Login successful',
      user,
      token: `demo-token-${user.id}`
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// GET /api/auth/profile
router.get('/profile', authenticateUser, (req, res) => {
  res.json(req.user);
});

// PUT /api/auth/profile
router.put('/profile', authenticateUser, (req, res) => {
  const { full_name, phone, college, avatar_url } = req.body;
  const user = mockUsers.find(u => u.id === req.user.id);
  if (user) {
    if (full_name) user.full_name = full_name;
    if (phone) user.phone = phone;
    if (college) user.college = college;
    if (avatar_url) user.avatar_url = avatar_url;
  }
  res.json({ message: 'Profile updated', user: user || req.user });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  if (isSupabaseConfigured) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return res.status(400).json({ error: error.message });
  }

  res.json({ message: `Password reset link has been dispatched to ${email}. Please check your inbox.` });
});

export default router;
