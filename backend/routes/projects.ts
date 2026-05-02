import { Router } from "express";
import { z } from "zod";
import { Project } from "../models/Project.model";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const projects = await Project.find();
    res.json({ projects });
  } catch (error) {
    next(error);
  }
});

const CreateProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(1000).optional(),
  adminId: z.string().length(24).optional(),
});

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const parsed = CreateProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    }

    const { title, description, adminId } = parsed.data;

    const createdBy = adminId || (req as any).user?.id;
    if (!createdBy) {
      return res.status(400).json({ error: "Admin context required" });
    }

    const newProject = await Project.create({
      title,
      description: description || "",
      createdBy: adminId || (req as any).user?.id,
    });

    res.status(201).json({ project: newProject });
  } catch (error) {
    next(error);
  }
});

export default router;
