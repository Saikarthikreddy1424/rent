import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Calendar, 
  AlertTriangle, 
  Trash2, 
  CheckCircle, 
  ExternalLink,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const { user, quickSwitchUser, showToast, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [reports, setReports] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'reports' | 'users'
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const statsData = await apiClient.getAdminStats();
      setStats(statsData);

      const listingsData = await apiClient.getListings({ limit: 50 });
      setListings(listingsData.listings || []);

      const reportsData = await apiClient.getAdminReports();
      setReports(reportsData || []);

      const usersData = await apiClient.getAdminUsers();
      setUsersList(usersData || []);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const handleToggleVerify = async (listingId, currentVerified) => {
    try {
      await apiClient.toggleListingVerification(listingId, !currentVerified);
      showToast(`Listing verification ${!currentVerified ? 'granted (Verified Badge active)' : 'revoked'}`);
      setListings(listings.map(l => l.id === listingId ? { ...l, is_verified: !currentVerified } : l));
    } catch (err) {
      showToast('Failed to toggle verification status', 'error');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Delete this listing immediately from the platform?')) return;
    try {
      await apiClient.deleteListing(listingId);
      showToast('Listing removed by administrator');
      setListings(listings.filter(l => l.id !== listingId));
    } catch (err) {
      showToast('Failed to delete listing', 'error');
    }
  };

  const handleResolveReport = async (reportId, action) => {
    try {
      await apiClient.updateReportStatus(reportId, 'action_taken', action);
      showToast(action === 'delete_listing' ? 'Suspicious listing deleted & report resolved' : 'Report marked as reviewed');
      loadAdminData();
    } catch (err) {
      showToast('Failed to update report', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> RentEase System Administration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Platform Control & Safety Console</h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervise rental listings, assign verified trust badges, enforce safety guidelines, and manage user reports.
          </p>
        </div>

        {!isAdmin && (
          <button
            onClick={() => quickSwitchUser('admin')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition"
          >
            <Sparkles className="w-4 h-4" /> Switch to Admin Persona
          </button>
        )}
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Listings</p>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.totalListings || listings.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Verified Badges</p>
          <p className="text-2xl font-extrabold text-teal-600">{stats?.verifiedListings || listings.filter(l => l.is_verified).length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Users</p>
          <p className="text-2xl font-extrabold text-brand-600">{stats?.totalUsers || usersList.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bookings</p>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.totalBookings || '1'}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Safety Reports</p>
          <p className="text-2xl font-extrabold text-red-600">{reports.length}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-sm font-bold">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'listings'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Listing Moderation ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition relative ${
            activeTab === 'reports'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>User Reports ({reports.length})</span>
          {reports.some(r => r.status === 'pending') && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'users'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts ({usersList.length})</span>
        </button>
      </div>

      {/* TAB 1: LISTING MODERATION */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Rental</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Campus</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Status / Badge</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {listings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img src={item.images?.[0]} alt="thumb" className="w-12 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-slate-400">{item.location}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 capitalize">{item.category?.replace('_', ' ')}</td>
                    <td className="py-4 px-6 font-semibold text-teal-700">{item.nearby_college}</td>
                    <td className="py-4 px-6 font-extrabold text-navy-900">${item.price}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleVerify(item.id, item.is_verified)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                          item.is_verified
                            ? 'bg-teal-100 text-teal-800 border border-teal-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="Click to toggle Verified Listing status"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{item.is_verified ? 'Verified ✓' : 'Unverified'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <a
                        href={`/listings/${item.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 inline-block"
                        title="Inspect listing"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDeleteListing(item.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 inline-block"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REPORTS MODERATION */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
              <CheckCircle className="w-10 h-10 text-teal-500 mx-auto" />
              <h3 className="font-bold text-slate-800">All clear! No pending suspicious reports</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((rep) => (
                <div key={rep.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Report: {rep.reason}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(rep.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-xs font-semibold uppercase text-slate-500">
                      Status: {rep.status}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-900">{rep.listing_title}</p>
                  {rep.details && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {rep.details}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleResolveReport(rep.id, 'reviewed')}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                    >
                      Mark Reviewed
                    </button>
                    {rep.listing_id && (
                      <button
                        onClick={() => handleResolveReport(rep.id, 'delete_listing')}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Fraudulent Listing</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USERS LIST */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Affiliation / Campus</th>
                  <th className="py-4 px-6">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img src={u.avatar_url} alt="user" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{u.full_name}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'owner' ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">{u.college || 'N/A'}</td>
                    <td className="py-4 px-6">{u.phone || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
