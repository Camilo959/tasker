import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export class AuthController {
    async register(req: Request, res: Response) {
        const { name, email, password, role } = req.body;

        // Validación
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "Faltan datos requeridos" });
        }

        try {
            const result = await authService.register({
                name,
                email,
                password,
                role,
            });
            res.status(201).json(result);
        } catch (error: any) {
            if (error.message === "Email ya registrado") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        // Validación
        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña requeridos" });
        }

        try {
            const result = await authService.login({ email, password });
            res.json(result);
        } catch (error: any) {
            if (
                error.message === "Usuario no encontrado o inactivo" ||
                error.message === "Contraseña incorrecta"
            ) {
                return res.status(401).json({ error: error.message });
            }
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const user = await authService.getProfile(req.user!.userId);
            res.json(user);
        } catch (error: any) {
            if (error.message === "Usuario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

export const authController = new AuthController();