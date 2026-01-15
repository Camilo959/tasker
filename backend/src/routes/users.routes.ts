import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router();

// Todas las rutas requieren autenticación y rol ADMIN
router.get("/", authMiddleware, isAdmin, usersController.getAll);
router.get("/:id", authMiddleware, isAdmin, usersController.getById);
router.post("/", authMiddleware, isAdmin, usersController.create);
router.patch("/:id", authMiddleware, isAdmin, usersController.update);

export default router;