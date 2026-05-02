import { useAuthStore } from '../store/useAuthStore';

// In Vite development, we'll proxy /api to the backend.
// In production, the backend serves the frontend, so /api works natively.
export const BASE_URL = '/api';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().token;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const data = await response.json();
      errorMsg = data.error || errorMsg;
    } catch (e) {
      // Ignored
    }
    throw new Error(errorMsg);
  }

  return response.json();
};
