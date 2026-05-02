import { Request, Response } from "express";
import { taskService } from "../services/task.service";
import { aiService } from "../services/ai.service";

class TaskController {
  getTasks = (req: Request, res: Response) => {
    try {
      const { assignedTo } = req.query;
      
      if (assignedTo && typeof assignedTo === 'string') {
        const userTasks = taskService.getTasksByAssignedTo(assignedTo);
        return res.json({ tasks: userTasks });
      }

      res.json({ tasks: taskService.getAllTasks() });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  };

  addTask = (req: Request, res: Response) => {
    try {
      const { title, description, projectId, assignedTo } = req.body;

      if (!title || !projectId || !assignedTo) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newTask = taskService.addTask({
        title,
        description,
        projectId,
        assignedTo_MemberId: assignedTo
      });

      res.status(201).json({ task: newTask });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  };

  updateTaskStatus = (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updatedTask = taskService.updateTaskStatus(id, status as any);
      res.json({ task: updatedTask });
    } catch (error: any) {
      if (error.message === "Task not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  };

  generateTasks = async (req: Request, res: Response) => {
    try {
      const { prompt, projectId, assignedTo } = req.body;

      if (!prompt || !projectId || !assignedTo) {
        return res.status(400).json({ error: "prompt, projectId, and assignedTo are required" });
      }

      // Call AI Service
      const generatedItems = await aiService.generateTasks(prompt);

      // Validate the results and add them using taskService
      const createdTasks = [];
      for (const item of generatedItems) {
        if (item.title) {
          const newTask = taskService.addTask({
            title: item.title,
            description: item.description || "",
            projectId,
            assignedTo_MemberId: assignedTo
          });
          createdTasks.push(newTask);
        }
      }

      res.status(201).json({ tasks: createdTasks });
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate tasks" });
    }
  };
}

export const taskController = new TaskController();
