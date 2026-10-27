import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Heart, Mail, MapPin, Phone, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-brand-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white">Rent<span className="text-teal-400">Ease</span></span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier student rental network connecting university students with verified accommodation, 
              budget-friendly shared flats, PGs, and essential item rentals right next to campus.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Student Verified Rentals
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
                <GraduationCap className="w-3.5 h-3.5" /> Campus Proximity Match
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Rentals</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/explore?category=room" className="hover:text-teal-400 transition">Private & Shared Rooms</Link></li>
              <li><Link to="/explore?category=pg_hostel" className="hover:text-teal-400 transition">PG & Hostel Accommodations</Link></li>
              <li><Link to="/explore?category=flat" className="hover:text-teal-400 transition">Student Flats & Apartments</Link></li>
              <li><Link to="/explore?category=furniture" className="hover:text-teal-400 transition">Study Desks & Chairs</Link></li>
              <li><Link to="/explore?category=electronics" className="hover:text-teal-400 transition">Monitors & Appliances</Link></li>
              <li><Link to="/explore?category=bicycle" className="hover:text-teal-400 transition">Campus Commuter Bikes</Link></li>
            </ul>
          </div>

          {/* Student Hub */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/login/student" className="hover:text-teal-400 transition">Student Login & Perks</Link></li>
              <li><Link to="/login/owner" className="hover:text-teal-400 transition">Property Owner Portal</Link></li>
              <li><Link to="/list-rental" className="hover:text-teal-400 transition">List Your Property or Item</Link></li>
              <li><Link to="/bookings" className="hover:text-teal-400 transition">Booking Requests Tracker</Link></li>
              <li><Link to="/favorites" className="hover:text-teal-400 transition">Saved Rental Shortlist</Link></li>
              <li><Link to="/admin-dashboard" className="hover:text-teal-400 transition">Admin Moderation</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support & Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                <span>support@rentease.edu</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400" />
                <span>+1 (800) 555-RENT</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>University District Hub</span>
              </li>
              <li className="pt-2">
                <Link to="/about" className="hover:text-teal-400 transition block">About RentEase</Link>
                <Link to="/contact" className="hover:text-teal-400 transition block mt-1">Campus Partnerships</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RentEase Technologies Inc. Built with care for university students worldwide.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              API & Database Services Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
