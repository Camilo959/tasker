import { Router } from "express";
import { tasksController } from "../controllers/tasks.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.post("/", authMiddleware, tasksController.create);
router.get("/", authMiddleware, tasksController.getAll);
router.get("/:id", authMiddleware, tasksController.getById);
router.patch("/:id", authMiddleware, tasksController.update);

// Solo ADMIN puede eliminar tareas
router.delete("/:id", authMiddleware, isAdmin, tasksController.delete);

export default router;