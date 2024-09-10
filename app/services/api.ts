const API_BASE_URL = '/api';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data;
}

export const api = {
  auth: {
    register: (data: any) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: async (data: any) => {
      const response = await fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) });
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    },
    forgotPassword: (data: any) => fetchApi('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
    resetPassword: (token: string, data: any) => fetchApi(`/auth/reset-password/${token}`, { method: 'POST', body: JSON.stringify(data) }),
  },
  user: {
    getProfile: async () => {
      try {
        const data = await fetchApi('/user/profile');
        console.log('Profile data from API:', data); // Existing log
        if (Object.keys(data).length === 0) {
          throw new Error('Empty user data received');
        }
        return data;
      } catch (error) {
        console.error('Error in getProfile:', error); // Existing log
        throw error;
      }
    },
  },
  // ... other API methods ...
};