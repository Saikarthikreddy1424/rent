import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ListingDetailPage from './pages/ListingDetailPage';
import StudentAuthPage from './pages/StudentAuthPage';
import OwnerAuthPage from './pages/OwnerAuthPage';
import AddListingPage from './pages/AddListingPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import BookingsPage from './pages/BookingsPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Scroll to top upon navigating to a new route
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/listings/:id" element={<ListingDetailPage />} />
              <Route path="/login/student" element={<StudentAuthPage />} />
              <Route path="/login/owner" element={<OwnerAuthPage />} />
              <Route path="/list-rental" element={<AddListingPage />} />
              <Route path="/student-dashboard" element={<StudentDashboardPage />} />
              <Route path="/owner-dashboard" element={<OwnerDashboardPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              {/* Fallback route */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
