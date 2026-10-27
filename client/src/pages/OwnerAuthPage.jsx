import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Mail, Lock, User, Phone, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OwnerAuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    college: 'Campus Housing Partner',
  });
  const [loading, setLoading] = useState(false);

  const { login, register, quickSwitchUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register({ ...formData, role: 'owner' });
        navigate('/owner-dashboard');
      } else {
        await login(formData.email, formData.password);
        navigate('/owner-dashboard');
      }
    } catch (err) {
      // Handled in context toast
    } finally {
      setLoading(false);
    }
  };

  const handleDemoOwnerLogin = () => {
    quickSwitchUser('owner');
    navigate('/owner-dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 relative overflow-hidden">
        
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 mx-auto flex items-center justify-center">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {isRegister ? 'List as Property / Item Owner' : 'Owner Portal Sign In'}
          </h1>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'List properties, hostel beds, desks, and electronics for verified university students.'
              : 'Manage your listings, accept or reject incoming booking requests, and track reviews.'}
          </p>
        </div>

        {/* Demo Fast Login Button */}
        <div className="mb-6 p-3 rounded-2xl bg-brand-50 border border-brand-200/80 text-center space-y-2">
          <span className="text-[11px] font-bold text-brand-800 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Instant Demo Access
          </span>
          <button
            type="button"
            onClick={handleDemoOwnerLogin}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition"
          >
            Quick 1-Click Login as Marcus (Owner)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name / Organization
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Marcus Vance Rentals"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 876-5432"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Business / Owner Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="owner@rentease.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-navy-800 hover:brightness-105 text-white font-bold text-sm shadow-lg shadow-brand-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Processing...' : isRegister ? 'Register as Property Owner' : 'Sign In to Owner Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            {isRegister ? 'Already registered as an owner?' : 'New property owner?'}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="font-bold text-brand-600 hover:underline ml-1"
            >
              {isRegister ? 'Sign In Here' : 'Register Here'}
            </button>
          </p>
          <p className="text-xs text-slate-400 mt-3">
            Looking to rent a room as a student?{' '}
            <Link to="/login/student" className="font-semibold text-teal-600 hover:underline">
              Student Portal →
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
