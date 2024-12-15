const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      return response.json();
    },
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      return response.json();
    },
    logout: async () => {
      try {
        await fetchApi('/auth/logout', { 
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        localStorage.removeItem('token');
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    },
    resetPassword: async (token, newPassword) => {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }
      return response.json();
    },
  },
  user: {
    getProfile: async () => {
      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
    },
    updateProfile: async (userData) => {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }
      return response.json();
    },
    // ... other user-related methods ...
  },
  jobs: {
    getJobs: () => fetchApi('/jobs'),
    createJob: (jobData) => fetchApi('/jobs', { method: 'POST', body: JSON.stringify(jobData) }),
    getJobDetails: (jobId) => fetchApi(`/jobs/${jobId}`),
  },
  events: {
    getEvents: async ({ page = 1, limit = 10 }) => {
      try {
        const response = await fetchApi(`/events?page=${page}&limit=${limit}`);
        if (Array.isArray(response)) {
          return {
            events: response,
            totalPages: Math.ceil(response.length / limit)
          };
        }
        if (response.events) {
          return {
            events: response.events,
            totalPages: response.totalPages || Math.ceil(response.events.length / limit)
          };
        }
        return {
          events: [],
          totalPages: 0
        };
      } catch (error) {
        console.error('Error fetching events:', error);
        return {
          events: [],
          totalPages: 0
        };
      }
    },
    createEvent: (eventData) => fetchApi('/events', { 
      method: 'POST', 
      body: JSON.stringify(eventData) 
    }),
    getEventDetails: (eventId) => fetchApi(`/events/${eventId}`),
    registerForEvent: async (eventId) => {
      return fetchApi(`/events/${eventId}/register`, { method: 'POST' });
    },
  },
  donations: {
    createOrder: (donationData) => fetchApi('/donations/create-order', {
      method: 'POST',
      body: JSON.stringify(donationData)
    }),
    verifyPayment: (paymentData) => fetchApi('/donations/verify-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    }),
    getDonationProgress: async () => {
      try {
        return await fetchApi('/donations/progress');
      } catch (error) {
        console.error('Failed to fetch donation progress:', error);
        return { total: 0, goal: 0 };
      }
    },
    getDonationHistory: () => fetchApi('/donations/history'),
  },
};