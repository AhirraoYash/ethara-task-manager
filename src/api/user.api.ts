import { User } from '../types';
import { apiClient } from './client';

export const getUsers = async (): Promise<User[]> => {
  const data = await apiClient('/users');
  return data.users || [];
};

export const addMember = async (name: string, email: string, mobile: string): Promise<User> => {
  const data = await apiClient('/users', {
    method: 'POST',
    body: JSON.stringify({ name, email, mobile, role: 'Member' }),
  });
  return data.user;
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
  return apiClient('/users/change-password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};
