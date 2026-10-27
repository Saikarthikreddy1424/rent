const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  getHeaders: () => {
    const userStr = localStorage.getItem('rentease_user');
    const token = localStorage.getItem('rentease_token');
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        headers['x-user-id'] = user.id;
        headers['x-user-role'] = user.role;
        headers['x-user-email'] = user.email;
        headers['x-user-name'] = user.full_name;
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }

    return headers;
  },

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      ...this.getHeaders(),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  },

  // Auth
  login: (credentials) => apiClient.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  register: (userData) => apiClient.request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  getProfile: () => apiClient.request('/auth/profile'),
  updateProfile: (profileData) => apiClient.request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),
  forgotPassword: (email) => apiClient.request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),

  // Listings
  getListings: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return apiClient.request(`/listings?${query.toString()}`);
  },
  getListingById: (id) => apiClient.request(`/listings/${id}`),
  getRecommendations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.request(`/listings/recommendations?${query}`);
  },
  createListing: (data) => apiClient.request('/listings', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateListing: (id, data) => apiClient.request(`/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteListing: (id) => apiClient.request(`/listings/${id}`, {
    method: 'DELETE'
  }),
  toggleListingAvailability: (id, is_available) => apiClient.request(`/listings/${id}/availability`, {
    method: 'PATCH',
    body: JSON.stringify({ is_available })
  }),

  // Bookings
  createBooking: (bookingData) => apiClient.request('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  }),
  getMyBookings: () => apiClient.request('/bookings/my'),
  getOwnerBookings: () => apiClient.request('/bookings/owner'),
  updateBookingStatus: (id, status, owner_notes = '') => apiClient.request(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, owner_notes })
  }),

  // Reviews
  getListingReviews: (listingId) => apiClient.request(`/reviews/listing/${listingId}`),
  createReview: (reviewData) => apiClient.request('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  }),
  updateReview: (id, data) => apiClient.request(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteReview: (id) => apiClient.request(`/reviews/${id}`, {
    method: 'DELETE'
  }),

  // Favorites
  getFavorites: () => apiClient.request('/favorites'),
  toggleFavorite: (listing_id) => apiClient.request('/favorites/toggle', {
    method: 'POST',
    body: JSON.stringify({ listing_id })
  }),

  // Reports
  submitReport: (reportData) => apiClient.request('/reports', {
    method: 'POST',
    body: JSON.stringify(reportData)
  }),
  getAdminReports: () => apiClient.request('/reports'),
  updateReportStatus: (id, status, action) => apiClient.request(`/reports/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, action })
  }),

  // Admin
  getAdminStats: () => apiClient.request('/admin/stats'),
  getAdminUsers: () => apiClient.request('/admin/users'),
  toggleListingVerification: (id, is_verified) => apiClient.request(`/admin/listings/${id}/verify`, {
    method: 'PATCH',
    body: JSON.stringify({ is_verified })
  }),
  getSystemHealth: () => apiClient.request('/health')
};
