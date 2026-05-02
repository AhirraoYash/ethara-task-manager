import { User } from '../types';

const BASE_URL = 'http://localhost:5000/api';

export const loginUser = async (identifier: string, pass: string): Promise<{ user: User }> => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password: pass }),
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Login failed');
  }
  
  return res.json();
};
