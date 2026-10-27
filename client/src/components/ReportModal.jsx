import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function ReportModal({ listingId, listingTitle, isOpen, onClose }) {
  const { showToast } = useAuth();
  const [reason, setReason] = useState('Inaccurate pricing or hidden fees');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.submitReport({
        listing_id: listingId,
        reason,
        details
      });
      showToast('Report received. Our Trust & Safety team will review this listing promptly.');
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to submit report', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Report Listing</h2>
              <p className="text-xs text-slate-500 line-clamp-1">{listingTitle}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Suspicion / Concern
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            >
              <option value="Inaccurate pricing or hidden fees">Inaccurate pricing or hidden fees</option>
              <option value="Fake or misleading property photos">Fake or misleading property photos</option>
              <option value="Listing already occupied or unavailable">Listing already occupied or unavailable</option>
              <option value="Suspicious off-platform payment request">Suspicious off-platform payment request</option>
              <option value="Safety or discrimination concerns">Safety or discrimination concerns</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Additional Details
            </label>
            <textarea
              rows={3}
              placeholder="Provide any additional context or proof to assist our moderators..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-500/20 transition disabled:opacity-50"
          >
            {loading ? 'Submitting Report...' : 'Submit to Safety Team'}
          </button>
        </form>
      </div>
    </div>
  );
}
