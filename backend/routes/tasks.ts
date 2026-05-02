import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, taskController.getTasks);
router.post("/", requireAuth, requireAdmin, taskController.addTask);
router.patch("/:id/status", requireAuth, taskController.updateTaskStatus);
router.post("/generate", requireAuth, requireAdmin, taskController.generateTasks);

export default router;

