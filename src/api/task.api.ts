import { Task } from '../types';

const BASE_URL = 'http://localhost:5000/api';

export const getTasks = async (assignedTo?: string): Promise<Task[]> => {
  const url = assignedTo ? `${BASE_URL}/tasks?assignedTo=${assignedTo}` : `${BASE_URL}/tasks`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  const data = await res.json();
  return data.tasks || [];
};

export const createTask = async (taskData: Omit<Task, 'id' | 'status'>): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create task');
  }
  
  return res.json();
};

export const updateTaskStatus = async (taskId: string, newStatus: Task['status']): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus }),
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to update task status');
  }
  
  return res.json();
};

export const generateAITasks = async (prompt: string, projectId: number | string, assignedTo: number | string): Promise<{ tasks: Task[] }> => {
  const res = await fetch(`${BASE_URL}/tasks/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, projectId, assignedTo }),
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to generate tasks');
  }
  
  return res.json();
};
