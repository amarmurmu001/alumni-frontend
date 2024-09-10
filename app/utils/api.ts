import { getToken } from './auth'; // Implement this function to retrieve the token from localStorage

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const fetchOptions: RequestInit = {
  credentials: 'include',
};

// Define LoginCredentials type
interface LoginCredentials {
  email: string;
  password: string;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      return fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    register: async (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      graduationYear: string;
      major: string;
    }) => {
      return fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
    forgotPassword: async (email: string) => {
      return fetchApi('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
  },
  user: {
    getProfile: async () => {
      return fetchApi('/user/profile');
    },
  },
  events: {
    getEvents: async (params: any) => {
      const queryString = new URLSearchParams(params).toString();
      return fetchApi(`/events?${queryString}`);
    },
    createEvent: async (eventData: any) => {
      const token = localStorage.getItem('token');
      return fetchApi('/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });
    },
  },
  jobs: {
    getJobs: async () => {
      return fetchApi('/jobs');
    },
    createJob: async (jobData: any) => {
      const token = localStorage.getItem('token');
      return fetchApi('/jobs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });
    },
  },
  donations: {
    makeDonation: async (donationData: any) => {
      const token = localStorage.getItem('token');
      return fetchApi('/donations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(donationData),
      });
    },
  },
};

export async function login(credentials: LoginCredentials) {
  console.log('Attempting login with:', credentials);
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });

  console.log('Login response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Login error:', errorData);
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await response.json();
  console.log('Login successful, received data:', data);
  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
}