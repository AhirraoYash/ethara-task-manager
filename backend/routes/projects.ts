import { Router } from "express";
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

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { title, description, adminId } = req.body;

    if (!title || (!adminId && !(req as any).user?.id)) {
      return res.status(400).json({ error: "Title and AdminId are required" });
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
