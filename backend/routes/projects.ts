import { Router } from "express";
import { db, DbProject } from "../data/mockDatabase";

const router = Router();

router.get("/", (req, res) => {
  res.json({ projects: db.projects });
});

router.post("/", (req, res) => {
  const { title, description, adminId } = req.body;

  if (!title || !adminId) {
    return res.status(400).json({ error: "Title and AdminId are required" });
  }

  const newProject: DbProject = {
    id: `proj_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    title,
    description: description || "",
    createdBy_AdminId: adminId,
  };

  db.projects.push(newProject);
  res.status(201).json({ project: newProject });
});

export default router;
