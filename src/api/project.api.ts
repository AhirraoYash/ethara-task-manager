import { Project } from '../types';

const BASE_URL = 'http://localhost:5000/api';

export const getProjects = async (): Promise<Project[]> => {
  const res = await fetch(`${BASE_URL}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  const data = await res.json();
  return data.projects || [];
};

export const createProject = async (title: string, description: string, adminId: string): Promise<Project> => {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, adminId }),
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create project');
  }
  
  return res.json();
};
