import { User } from '../types';
import { apiClient } from './client';

export const loginUser = async (identifier: string, pass: string): Promise<{ user: User; token: string }> => {
  return apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password: pass }),
  });
};
