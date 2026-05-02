import { Router } from "express";
import { taskController } from "../controllers/task.controller";

const router = Router();

router.get("/", taskController.getTasks);
router.post("/", taskController.addTask);
router.patch("/:id/status", taskController.updateTaskStatus);
router.post("/generate", taskController.generateTasks);

export default router;

