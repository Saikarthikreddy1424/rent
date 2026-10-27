import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ContactPage() {
  const { showToast } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Student Housing Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been sent to our campus student support desk!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Campus Support Desk</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Get in Touch with RentEase</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Have questions about university partnerships, listing a property, or safety standards? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Contact Info Card */}
        <div className="bg-navy-950 text-white p-8 rounded-3xl shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-teal-400">Direct Contacts</h3>
          
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Student Support Email</p>
                <p className="text-slate-400">support@rentease.edu</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Helpline Phone</p>
                <p className="text-slate-400">+1 (800) 555-RENT (7368)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Headquarters</p>
                <p className="text-slate-400">University Avenue Innovation Center, Suite 400</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            Support hours: Monday to Friday, 8:00 AM – 8:00 PM PST. Emergency safety response available 24/7.
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for contacting us. A RentEase campus representative will respond to your inquiry within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="Student Housing Inquiry">Student Housing Inquiry</option>
                  <option value="Owner Listing Support">Owner / Landlord Listing Support</option>
                  <option value="University Campus Partnership">University Campus Partnership</option>
                  <option value="Safety & Verification Question">Safety & Verification Question</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us how we can help your student living experience..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Support Message</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
