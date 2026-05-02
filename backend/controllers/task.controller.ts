import { Request, Response } from "express";
import { z } from "zod";
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
      const AddTaskSchema = z.object({
        title: z.string().min(1, "Title is required").max(200),
        description: z.string().max(2000).optional().default(""),
        projectId: z.string().length(24).optional(),
        project: z.string().length(24).optional(),
        assignedTo_MemberId: z.string().length(24).optional(),
        assignedTo: z.string().length(24).optional(),
      });

      const parsed = AddTaskSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
      }

      const { title, description, projectId, project, assignedTo_MemberId, assignedTo } = parsed.data;
      const assignee = assignedTo_MemberId || assignedTo;
      const finalProject = project || projectId;

      if (!finalProject || !assignee) {
        return res.status(400).json({ error: "Project and AssignedTo are required" });
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
      
      const StatusSchema = z.object({
        status: z.enum(['Pending', 'In Progress', 'Completed'])
      });

      const parsed = StatusSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid status", details: parsed.error.flatten() });
      }

      const { status } = parsed.data;

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
      const GenerateSchema = z.object({
        prompt: z.string().min(1, "Prompt is required"),
        projectId: z.string().length(24).optional(),
        project: z.string().length(24).optional(),
        assignedTo: z.string().length(24),
        preview: z.boolean().optional()
      });

      const parsed = GenerateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
      }

      const { prompt, projectId, project, assignedTo, preview } = parsed.data;
      const finalProject = project || projectId;

      if (!finalProject) {
        return res.status(400).json({ error: "Project ID is required" });
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
