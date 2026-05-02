import { Project } from '../types';
import { apiClient } from './client';

export const getProjects = async (): Promise<Project[]> => {
  const data = await apiClient('/projects');
  return data.projects || [];
};

export const createProject = async (title: string, description: string, adminId: string): Promise<Project> => {
  const data = await apiClient('/projects', {
    method: 'POST',
    body: JSON.stringify({ title, description, adminId }),
  });
  return data.project;
};
