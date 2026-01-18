import { Router } from "express";
import { tasksController } from "../controllers/tasks.controller";
import { timeEntriesController } from "../controllers/time-entries.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router();

// ========== TASKS ==========
// Todas las rutas requieren autenticación
router.post("/", authMiddleware, isAdmin, tasksController.create);
router.get("/", authMiddleware, tasksController.getAll);
router.get("/:id", authMiddleware, tasksController.getById);
router.patch("/:id", authMiddleware, tasksController.update);

// Solo ADMIN puede eliminar tareas
router.delete("/:id", authMiddleware, isAdmin, tasksController.delete);

// ========== TIME ENTRIES ==========
// Crear registro de tiempo (EMPLOYEE en sus tareas, ADMIN en cualquier tarea)
router.post("/time-entries", authMiddleware, timeEntriesController.create);

// Obtener registros de tiempo de una tarea específica
router.get("/time-entries/task/:taskId", authMiddleware, timeEntriesController.getByTask);

// Obtener mis registros de tiempo
router.get("/time-entries/my", authMiddleware, timeEntriesController.getMine);

// Actualizar registro de tiempo (solo el que lo creó)
router.patch("/time-entries/:id", authMiddleware, timeEntriesController.update);

// Eliminar registro de tiempo (solo el que lo creó o ADMIN)
router.delete("/time-entries/:id", authMiddleware, timeEntriesController.delete);

export default router;