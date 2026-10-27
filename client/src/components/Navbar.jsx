import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  PlusCircle, 
  Bookmark, 
  Calendar, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X, 
  Building2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, quickSwitchUser, favorites, isStudent, isOwner, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-brand-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-white">Rent<span className="text-teal-400">Ease</span></span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">STUDENT</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Campus Housing & Essentials</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/') ? 'text-teal-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>

            <Link
              to="/explore"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/explore') ? 'text-teal-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Search className="w-4 h-4" />
              Explore Rentals
            </Link>

            {/* List Rental (Owners or general) */}
            <Link
              to="/list-rental"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/list-rental') ? 'text-teal-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-teal-400" />
              List a Rental
            </Link>

            <Link
              to="/bookings"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/bookings') ? 'text-teal-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              My Bookings
            </Link>

            <Link
              to="/favorites"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
                isActive('/favorites') ? 'text-teal-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Favorites
              {favorites.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-teal-500 text-slate-900 text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
          </nav>

          {/* Right Action / Role Switcher / User Profile */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Quick Demo Role Switcher Badge */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-navy-800/90 border border-teal-500/30 text-xs font-medium text-teal-300 hover:bg-navy-800 transition shadow-sm"
                title="Switch demo persona for testing"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Role: <strong className="uppercase text-white">{user?.role || 'Guest'}</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                    Instant Persona Switcher
                  </div>
                  <button
                    onClick={() => { quickSwitchUser('student'); setRoleSwitcherOpen(false); }}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-teal-500/10 hover:text-teal-400 flex items-center justify-between"
                  >
                    <span>🎓 Alex (Student)</span>
                    {isStudent && <span className="text-teal-400">✓</span>}
                  </button>
                  <button
                    onClick={() => { quickSwitchUser('owner'); setRoleSwitcherOpen(false); }}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-teal-500/10 hover:text-teal-400 flex items-center justify-between"
                  >
                    <span>🏠 Marcus (Property Owner)</span>
                    {isOwner && <span className="text-teal-400">✓</span>}
                  </button>
                  <button
                    onClick={() => { quickSwitchUser('admin'); setRoleSwitcherOpen(false); }}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-teal-500/10 hover:text-teal-400 flex items-center justify-between"
                  >
                    <span>🛡️ Sarah (Administrator)</span>
                    {isAdmin && <span className="text-teal-400">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* User Profile or Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition"
                >
                  <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                    {user.full_name}
                  </span>
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full object-cover border border-teal-400"
                  />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-sm">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="font-semibold text-white truncate">{user.full_name}</p>
                      <p className="text-xs text-teal-400 capitalize">{user.role} • {user.college || 'College Member'}</p>
                    </div>

                    {isStudent && (
                      <Link
                        to="/student-dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-teal-400"
                      >
                        🎓 Student Dashboard
                      </Link>
                    )}

                    {isOwner && (
                      <Link
                        to="/owner-dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-teal-400"
                      >
                        🏠 Owner Dashboard
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin-dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-teal-400"
                      >
                        🛡️ Admin Console
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-teal-400"
                    >
                      👤 Account Settings
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-t border-slate-800 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login/student"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition"
                >
                  Student Login
                </Link>
                <Link
                  to="/login/owner"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-teal-500 to-brand-500 text-white shadow-md hover:shadow-teal-500/25 hover:brightness-110 transition"
                >
                  List / Partner
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
          >
            Home
          </Link>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
          >
            Explore Rentals
          </Link>
          <Link
            to="/list-rental"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
          >
            List a Rental
          </Link>
          <Link
            to="/bookings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
          >
            My Bookings
          </Link>
          <Link
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
          >
            Favorites ({favorites.length})
          </Link>
          {user && (
            <div className="pt-3 border-t border-slate-800">
              <p className="px-3 text-xs text-teal-400 font-semibold uppercase">Logged in as {user.full_name} ({user.role})</p>
              <div className="flex gap-2 mt-2 px-3">
                <button onClick={() => quickSwitchUser('student')} className="text-xs px-2 py-1 bg-white/10 rounded text-slate-200">🎓 Student</button>
                <button onClick={() => quickSwitchUser('owner')} className="text-xs px-2 py-1 bg-white/10 rounded text-slate-200">🏠 Owner</button>
                <button onClick={() => quickSwitchUser('admin')} className="text-xs px-2 py-1 bg-white/10 rounded text-slate-200">🛡️ Admin</button>
              </div>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="mt-3 w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
