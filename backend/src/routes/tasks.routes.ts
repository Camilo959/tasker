import { Router } from "express";
import { tasksController } from "../controllers/tasks.controller";
import { timeEntriesController } from "../controllers/time-entries.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router();

// ========== TIME ENTRIES ==========
router.post("/time-entries", authMiddleware, timeEntriesController.create);
router.get("/time-entries/my", authMiddleware, timeEntriesController.getMine);
router.get("/time-entries/task/:taskId", authMiddleware, timeEntriesController.getByTask);
router.patch("/time-entries/:id", authMiddleware, timeEntriesController.update);
router.delete("/time-entries/:id", authMiddleware, timeEntriesController.delete);

// ========== TASKS ==========
router.post("/", authMiddleware, isAdmin, tasksController.create);
router.get("/", authMiddleware, tasksController.getAll);
router.get("/:id", authMiddleware, tasksController.getById);
router.patch("/:id", authMiddleware, tasksController.update);
router.delete("/:id", authMiddleware, isAdmin, tasksController.delete);

export default router;