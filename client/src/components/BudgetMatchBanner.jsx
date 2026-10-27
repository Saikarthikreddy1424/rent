import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, DollarSign, ArrowRight, GraduationCap } from 'lucide-react';

export default function BudgetMatchBanner() {
  const [budget, setBudget] = useState(800);
  const [college, setCollege] = useState('Stanford University');
  const navigate = useNavigate();

  const handleMatch = (e) => {
    e.preventDefault();
    navigate(`/explore?college=${encodeURIComponent(college)}&maxPrice=${budget}`);
  };

  return (
    <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-slate-900 rounded-3xl p-8 sm:p-10 border border-teal-500/30 text-white relative overflow-hidden shadow-2xl">
      {/* Background glow decoration */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Smart Feature • Budget Match AI
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Find student rentals that fit your exact monthly stipend.
        </h2>
        <p className="text-slate-300 text-sm mt-2 leading-relaxed">
          Set your college campus and spending limit. Our matching algorithm automatically filters all verified rooms, shared flats, and study essentials within bike or walking distance.
        </p>

        <form onSubmit={handleMatch} className="mt-6 flex flex-col sm:flex-row items-center gap-4 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/15">
          
          {/* University selector */}
          <div className="w-full sm:w-1/2 flex items-center gap-2 px-3 py-2 bg-navy-950/60 rounded-xl border border-white/10">
            <GraduationCap className="w-5 h-5 text-teal-400 flex-shrink-0" />
            <select
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full bg-transparent text-sm text-white focus:outline-none font-medium cursor-pointer"
            >
              <option value="Stanford University" className="bg-navy-900">Stanford University</option>
              <option value="UC Berkeley" className="bg-navy-900">UC Berkeley</option>
              <option value="Harvard University" className="bg-navy-900">Harvard University</option>
              <option value="MIT" className="bg-navy-900">MIT</option>
              <option value="Columbia University" className="bg-navy-900">Columbia University</option>
              <option value="University of Washington" className="bg-navy-900">University of Washington</option>
            </select>
          </div>

          {/* Budget input with slider */}
          <div className="w-full sm:w-1/2 flex items-center gap-3 px-3 py-2 bg-navy-950/60 rounded-xl border border-white/10">
            <DollarSign className="w-5 h-5 text-teal-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Budget Max</span>
                <span className="text-teal-300 font-bold">${budget}/mo</span>
              </div>
              <input
                type="range"
                min="30"
                max="2000"
                step="25"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-teal-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-brand-500 text-navy-950 font-bold text-sm hover:brightness-110 shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 whitespace-nowrap transition"
          >
            <span>Match Rentals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
