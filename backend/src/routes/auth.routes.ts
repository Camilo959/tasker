import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Obtener perfil del usuario autenticado
router.get("/profile", authMiddleware, authController.getProfile);
// Login
router.post("/login", authController.login);
// Registro de usuario (público o solo admin según implementes)
router.post("/register", authController.register);


export default router;