import { Request, Response } from "express";
import { taskService } from "../services/task.service";
import { aiService } from "../services/ai.service";
import { AuthRequest } from "../middleware/auth.middleware";

class TaskController {
  getTasks = async (req: AuthRequest, res: Response) => {
    try {
      const { assignedTo } = req.query;
      
      if (assignedTo && typeof assignedTo === 'string') {
        const userTasks = await taskService.getTasksByAssignedTo(assignedTo);
        return res.json({ tasks: userTasks });
      }

      const tasks = await taskService.getAllTasks();
      res.json({ tasks });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  };

  addTask = async (req: Request, res: Response) => {
    try {
      const { title, description, projectId, project, assignedTo_MemberId, assignedTo } = req.body;
      const assignee = assignedTo_MemberId || assignedTo;
      const finalProject = project || projectId;

      if (!title || !finalProject || !assignee) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newTask = await taskService.addTask({
        title,
        description,
        project: finalProject,
        assignedTo: assignee
      });

      res.status(201).json({ task: newTask });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  };

  updateTaskStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updatedTask = await taskService.updateTaskStatus(id, status as any);
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
      const { prompt, projectId, project, assignedTo, preview } = req.body;
      const finalProject = project || projectId;

      if (!prompt || !finalProject || !assignedTo) {
        return res.status(400).json({ error: "prompt, project, and assignedTo are required" });
      }

      // Call AI Service
      const generatedItems = await aiService.generateTasks(prompt);

      if (preview) {
        // Return without saving
        return res.json({ tasks: generatedItems });
      }

      // Validate the results and add them using taskService
      const createdTasks = [];
      for (const item of generatedItems) {
        if (item.title) {
          const newTask = await taskService.addTask({
            title: item.title,
            description: item.description || "",
            project: finalProject,
            assignedTo: assignedTo
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
