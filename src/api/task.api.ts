import { Task } from '../types';
import { apiClient } from './client';

export const getTasks = async (assignedTo?: string): Promise<Task[]> => {
  const url = assignedTo ? `/tasks?assignedTo=${assignedTo}` : `/tasks`;
  const data = await apiClient(url);
  return data.tasks || [];
};

export const createTask = async (taskData: Omit<Task, '_id' | 'status'>): Promise<Task> => {
  const data = await apiClient('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
  return data.task;
};

export const updateTaskStatus = async (taskId: string, newStatus: Task['status']): Promise<Task> => {
  const data = await apiClient(`/tasks/${taskId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus }),
  });
  return data.task;
};

export const generateAITasks = async (prompt: string, project: string, assignedTo: string, preview: boolean = false): Promise<{ tasks: any[] }> => {
  return apiClient('/tasks/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt, projectId: project, assignedTo, preview }),
  });
};
