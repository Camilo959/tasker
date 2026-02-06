import { Request, Response } from "express";
import { tasksService } from "../services/tasks.service";

export class TasksController {
    async create(req: Request, res: Response) {
        const { title, description, assignedToId, departmentId } = req.body;
        // ✅ NUEVA VALIDACIÓN
        if (req.user!.role !== "ADMIN") {
            return res.status(403).json({
                error: "Acceso denegado: solo ADMIN puede crear tareas"
            });
        }

        // Validación
        if (!title || !assignedToId) {
            return res.status(400).json({ error: "Título y usuario asignado son requeridos" });
        }

        try {
            const task = await tasksService.createTask({
                title,
                description,
                assignedToId,
                requestedById: req.user!.userId,
                departmentId,
            });
            res.status(201).json(task);
        } catch (error: any) {
            if (
                error.message === "Usuario asignado no encontrado" ||
                error.message === "Departamento no encontrado"
            ) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Error al crear tarea" });
        }
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { title, description, status, startDate, workDescription } = req.body;

        try {
            // ✅ Filtrar datos según rol
            let updateData: any = {};

            if (req.user!.role === "ADMIN") {
                // ADMIN puede editar todo
                updateData = {
                    title,
                    description,
                    status,
                    startDate,
                    workDescription,
                };
            } else {
                // EMPLOYEE solo puede editar estos campos
                updateData = {
                    status,
                    startDate,
                    workDescription,
                };
            }

            const task = await tasksService.updateTask(
                Number(id),
                updateData,
                req.user!.userId,
                req.user!.role
            );
            res.json(task);
        } catch (error: any) {
            if (error.message === "Tarea no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (
                error.message === "No tienes permiso para editar esta tarea" ||
                error.message.includes("No puedes editar el campo")
            ) {
                return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: "Error al actualizar tarea" });
        }
    }

    async getAll(req: Request, res: Response) {
        const { assignedToId, departmentId, fromDate, toDate } = req.query;

        try {
            const tasks = await tasksService.getTasks({
                assignedToId: assignedToId ? Number(assignedToId) : undefined,
                departmentId: departmentId ? Number(departmentId) : undefined,
                fromDate: fromDate ? new Date(fromDate as string) : undefined,
                toDate: toDate ? new Date(toDate as string) : undefined,
                userRole: req.user!.role,
                userId: req.user!.userId,
            });
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener tareas" });
        }
    }

    async getById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const task = await tasksService.getTaskById(
                Number(id),
                req.user!.userId,
                req.user!.role
            );
            res.json(task);
        } catch (error: any) {
            if (error.message === "Tarea no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "No tienes permiso para ver esta tarea") {
                return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: "Error al obtener tarea" });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const result = await tasksService.deleteTask(
                Number(id),
                req.user!.userId,
                req.user!.role
            );
            res.json(result);
        } catch (error: any) {
            if (error.message === "Tarea no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Solo ADMIN puede eliminar tareas") {
                return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: "Error al eliminar tarea" });
        }
    }
}

export const tasksController = new TasksController();