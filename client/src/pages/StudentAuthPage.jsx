import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Phone, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StudentAuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [forgotPasswordView, setForgotPasswordView] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    college: 'Stanford University',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const { login, register, quickSwitchUser, showToast } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register({ ...formData, role: 'student' });
        navigate('/student-dashboard');
      } else {
        await login(formData.email, formData.password);
        navigate('/student-dashboard');
      }
    } catch (err) {
      // Error handled by AuthContext toast
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudentLogin = () => {
    quickSwitchUser('student');
    navigate('/student-dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 mx-auto flex items-center justify-center">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {forgotPasswordView ? 'Reset Student Password' : isRegister ? 'Student Registration' : 'Student Portal Login'}
          </h1>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'Join RentEase to access student-rate rentals & book items near your campus.'
              : 'Sign in to manage your bookings, shortlist favorites, and explore campus rentals.'}
          </p>
        </div>

        {/* Demo Fast Login Button */}
        <div className="mb-6 p-3 rounded-2xl bg-teal-50 border border-teal-200/80 text-center space-y-2">
          <span className="text-[11px] font-bold text-teal-800 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Instant Demo Access
          </span>
          <button
            type="button"
            onClick={handleDemoStudentLogin}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition"
          >
            Quick 1-Click Login as Alex (Student)
          </button>
        </div>

        {forgotPasswordView ? (
          <form onSubmit={(e) => { e.preventDefault(); showToast('Reset instructions sent to your email.'); setForgotPasswordView(false); }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                University Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@university.edu"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-500 text-white font-bold text-sm shadow-md"
            >
              Send Password Reset Link
            </button>
            <button
              type="button"
              onClick={() => setForgotPasswordView(false)}
              className="w-full text-xs text-slate-500 hover:text-teal-600 font-semibold"
            >
              Back to Student Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Registration specific fields */}
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Alex Rivera"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    University / College
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Stanford University"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 234-5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@rentease.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => setForgotPasswordView(true)}
                    className="text-[11px] font-semibold text-teal-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-brand-600 hover:brightness-105 text-white font-bold text-sm shadow-lg shadow-teal-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Processing...' : isRegister ? 'Create Student Account' : 'Sign In as Student'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Toggle Register / Login */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            {isRegister ? 'Already registered as a student?' : "Don't have a student account yet?"}{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setForgotPasswordView(false); }}
              className="font-bold text-teal-600 hover:underline ml-1"
            >
              {isRegister ? 'Sign In Here' : 'Register Now'}
            </button>
          </p>

          <p className="text-xs text-slate-400 mt-3">
            Are you a landlord or item owner?{' '}
            <Link to="/login/owner" className="font-semibold text-brand-600 hover:underline">
              Owner Portal →
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
