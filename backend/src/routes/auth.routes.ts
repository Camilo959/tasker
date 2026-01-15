import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Registro de usuario (público o solo admin según implementes)
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Obtener perfil del usuario autenticado
router.get("/profile", authMiddleware, authController.getProfile);

export default router;