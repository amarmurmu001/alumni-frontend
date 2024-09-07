import { getToken } from './auth'; // Implement this function to retrieve the token from localStorage

export async function fetchApi(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  // Add this line to ensure Content-Type is set
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || response.statusText);
  }

  return response.json();
}