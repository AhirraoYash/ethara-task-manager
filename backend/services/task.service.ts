import { Task } from '../models/Task.model';
import mongoose from 'mongoose';

class TaskService {
  async getTasksByAssignedTo(assignedTo: string) {
    return Task.find({ assignedTo });
  }

  async getAllTasks() {
    return Task.find();
  }

  async addTask(data: { title: string; description?: string; project: string; assignedTo: string }) {
    const newTask = await Task.create({
      title: data.title,
      description: data.description || "",
      project: data.project,
      assignedTo: data.assignedTo,
      status: 'Pending',
    });

    return newTask;
  }

  async updateTaskStatus(id: string, status: 'Pending' | 'In Progress' | 'Completed') {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      throw new Error("Task not found");
    }

    return updatedTask;
  }
}

export const taskService = new TaskService();
