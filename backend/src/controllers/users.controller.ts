import { Request, Response } from "express";
import { usersService } from "../services/users.service";

export class UsersController {
    async getAll(req: Request, res: Response) {
        try {
            const users = await usersService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener usuarios" });
        }
    }

    async getById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const user = await usersService.getUserById(Number(id));
            res.json(user);
        } catch (error: any) {
            if (error.message === "Usuario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: "Error al obtener usuario" });
        }
    }

    async create(req: Request, res: Response) {
        const { name, email, password, role } = req.body;

        // Validación
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "Faltan datos requeridos" });
        }

        try {
            const result = await usersService.createUser({
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
            res.status(500).json({ error: "Error al crear usuario" });
        }
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { name, email, role, isActive } = req.body;

        try {
            const user = await usersService.updateUser(Number(id), {
                name,
                email,
                role,
                isActive,
            });
            res.json(user);
        } catch (error: any) {
            if (error.message === "Usuario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Email ya está en uso") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Error al actualizar usuario" });
        }
    }
}

export const usersController = new UsersController();