import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';

const AuthContext = createContext();

export const DEMO_PROFILES = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'student@rentease.edu',
    full_name: 'Alex Rivera',
    phone: '+1 (555) 234-5678',
    role: 'student',
    college: 'Stanford University',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'owner@rentease.com',
    full_name: 'Marcus Vance',
    phone: '+1 (555) 876-5432',
    role: 'owner',
    college: 'UC Berkeley Partner',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'admin@rentease.com',
    full_name: 'Sarah Connor (Admin)',
    phone: '+1 (555) 999-0000',
    role: 'admin',
    college: 'RentEase HQ',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rentease_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEMO_PROFILES[0]; }
    }
    return DEMO_PROFILES[0]; // Default logged in as demo student for immediate interactivity
  });

  const [favorites, setFavorites] = useState(['11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111103']);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('rentease_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rentease_user');
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const login = async (email, password) => {
    try {
      const res = await apiClient.login({ email, password });
      setUser(res.user);
      if (res.token) localStorage.setItem('rentease_token', res.token);
      showToast(`Welcome back, ${res.user.full_name}!`);
      return res.user;
    } catch (err) {
      // Fallback demo profile login if server returns error or during test
      const found = DEMO_PROFILES.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
        showToast(`Logged in as ${found.full_name}`);
        return found;
      }
      showToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiClient.register(userData);
      setUser(res.user);
      if (res.token) localStorage.setItem('rentease_token', res.token);
      showToast('Registration successful! Welcome to RentEase.');
      return res.user;
    } catch (err) {
      // Fallback local registration
      const newUser = {
        id: `usr-${Date.now()}`,
        ...userData,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.full_name)}`
      };
      setUser(newUser);
      showToast('Account registered successfully!');
      return newUser;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rentease_user');
    localStorage.removeItem('rentease_token');
    showToast('You have been logged out.');
  };

  const quickSwitchUser = (role) => {
    const target = DEMO_PROFILES.find(p => p.role === role) || DEMO_PROFILES[0];
    setUser(target);
    showToast(`Switched account to: ${target.full_name} (${target.role.toUpperCase()})`);
  };

  const updateUserProfile = async (profileData) => {
    const updated = { ...user, ...profileData };
    setUser(updated);
    try {
      await apiClient.updateProfile(profileData);
    } catch (e) {
      console.warn('Backend sync deferred', e);
    }
    showToast('Profile information updated successfully');
  };

  const toggleFavorite = async (listingId) => {
    const isFav = favorites.includes(listingId);
    let newFavs;
    if (isFav) {
      newFavs = favorites.filter(id => id !== listingId);
      showToast('Removed from favorites');
    } else {
      newFavs = [...favorites, listingId];
      showToast('Saved to your favorites!');
    }
    setFavorites(newFavs);

    try {
      await apiClient.toggleFavorite(listingId);
    } catch (e) {
      // Handled in local state
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        quickSwitchUser,
        updateUserProfile,
        favorites,
        toggleFavorite,
        isStudent: user?.role === 'student',
        isOwner: user?.role === 'owner',
        isAdmin: user?.role === 'admin',
        showToast
      }}
    >
      {children}
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md transition-all animate-bounce duration-300 border bg-navy-900 text-white border-teal-500/30">
          <span className={`w-2.5 h-2.5 rounded-full ${toast.type === 'error' ? 'bg-red-400' : 'bg-teal-400'}`} />
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
