import { Router } from "express";
import { departmentsController } from "../controllers/departments.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router();

// Listar departamentos (cualquier usuario autenticado)
router.get("/", authMiddleware, departmentsController.getAll);

// Obtener un departamento específico (cualquier usuario autenticado)
router.get("/:id", authMiddleware, departmentsController.getById);

// Crear, editar y eliminar solo para ADMIN
router.post("/", authMiddleware, isAdmin, departmentsController.create);
router.patch("/:id", authMiddleware, isAdmin, departmentsController.update);
router.delete("/:id", authMiddleware, isAdmin, departmentsController.delete);

export default router;