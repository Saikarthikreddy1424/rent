import React, { useState } from 'react';
import { User, Mail, Phone, GraduationCap, ShieldCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateUserProfile, showToast } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    college: user?.college || '',
    phone: user?.phone || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfile(formData);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 space-y-8">
        
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{user?.full_name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-teal-600" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              University Campus / Organization
            </label>
            <input
              type="text"
              required
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-teal-600" />
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-slate-400" />
              Email (Account Identity)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full text-sm bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-400 mt-1">Email is tied to your university verified authentication account.</p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm shadow-md transition"
          >
            Update Account Settings
          </button>
        </form>

      </div>
    </div>
  );
}
