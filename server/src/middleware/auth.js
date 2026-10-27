import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockUsers } from '../data/mockStore.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const customUserId = req.headers['x-user-id'];
    const customUserRole = req.headers['x-user-role'];

    // 1. If live Supabase is configured and a Bearer token is provided
    if (isSupabaseConfigured && authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid authentication token' });
      }

      // Fetch user profile for role
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      req.user = {
        id: user.id,
        email: user.email,
        role: profile?.role || 'student',
        full_name: profile?.full_name || user.user_metadata?.full_name || 'RentEase User'
      };
      return next();
    }

    // 2. Demo / Dev header mode or fallback
    if (customUserId) {
      const existingUser = mockUsers.find(u => u.id === customUserId);
      if (existingUser) {
        req.user = existingUser;
        return next();
      }
      // If user ID was created during demo
      req.user = {
        id: customUserId,
        email: req.headers['x-user-email'] || 'user@rentease.edu',
        role: customUserRole || 'student',
        full_name: req.headers['x-user-name'] || 'RentEase User'
      };
      return next();
    }

    // 3. Fallback default to demo student if no auth provided
    req.user = mockUsers[0];
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    res.status(500).json({ error: 'Authentication internal failure' });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Requires one of roles: [${roles.join(', ')}]. Current role: ${req.user.role}` 
      });
    }
    next();
  };
};
