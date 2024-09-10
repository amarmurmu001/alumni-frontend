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
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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
    // ... other auth methods ...
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
    getEvents: async ({ page, limit, sortBy, sortOrder, filterDate }) => {
      const formattedFilterDate = filterDate ? new Date(filterDate).toISOString().split('T')[0] : '';
      return fetchApi(`/events?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&filterDate=${formattedFilterDate}`);
    },
    createEvent: (eventData) => fetchApi('/events', { method: 'POST', body: JSON.stringify(eventData) }),
  },
  donations: {
    makeDonation: (donationData) => fetchApi('/donations', { method: 'POST', body: JSON.stringify(donationData) }),
    getDonationProgress: async () => {
      try {
        return await fetchApi('/donations/progress');
      } catch (error) {
        console.error('Failed to fetch donation progress:', error);
        return { total: 0, goal: 0 }; // Return default values if the endpoint is not available
      }
    },
  },
};