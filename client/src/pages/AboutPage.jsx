import React from 'react';
import { Building2, ShieldCheck, GraduationCap, Heart, Users, Sparkles, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="space-y-16 py-12">
      
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
          <GraduationCap className="w-4 h-4 text-teal-600" />
          Our Mission
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Empowering University Students to Live & Learn Affordably
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          RentEase was conceived by college alumni who experienced firsthand the skyrocketing costs of student housing, steep security deposits, and the headaches of purchasing expensive furniture for just one or two academic semesters.
        </p>
      </section>

      {/* 3 Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Safety & Verification First</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every rental listing goes through human moderator review. We check lease rules, safety standards, and campus proximity so students never encounter scams or fake listings.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Community Co-Living</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connecting like-minded peers across university majors. Whether you are looking for single private quiet study suites or lively double shared rooms, RentEase filters by occupancy and preferences.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">All-in-One Essentials Hub</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Why buy when you can rent? We bridge accommodation with semester rental of ergonomic study chairs, height-adjustable desks, monitors, microwaves, and campus commuter bicycles.
            </p>
          </div>
        </div>
      </section>

      {/* University Guarantee */}
      <section className="max-w-4xl mx-auto px-4 bg-slate-900 text-white rounded-3xl p-10 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to explore student housing near your campus?</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/explore"
            className="px-6 py-3.5 rounded-xl bg-teal-400 text-navy-950 font-bold text-sm hover:bg-teal-300 transition"
          >
            Explore Accommodations
          </Link>
          <Link
            to="/list-rental"
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
          >
            Become a Property Partner
          </Link>
        </div>
      </section>

    </div>
  );
}
