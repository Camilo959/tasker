import { Request, Response } from "express";
import { departmentsService } from "../services/departments.service";

export class DepartmentsController {
    async getAll(req: Request, res: Response) {
        try {
            const departments = await departmentsService.getAllDepartments();
            res.json(departments);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener departamentos" });
        }
    }

    async getById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const department = await departmentsService.getDepartmentById(
                Number(id)
            );
            res.json(department);
        } catch (error: any) {
            if (error.message === "Departamento no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: "Error al obtener departamento" });
        }
    }

    async create(req: Request, res: Response) {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "El nombre es requerido" });
        }

        try {
            const department = await departmentsService.createDepartment({ name });
            res.status(201).json(department);
        } catch (error: any) {
            if (error.message === "Nombre de departamento ya existe") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Error al crear departamento" });
        }
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "El nombre es requerido" });
        }

        try {
            const department = await departmentsService.updateDepartment(
                Number(id),
                { name }
            );
            res.json(department);
        } catch (error: any) {
            if (error.message === "Departamento no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Nombre de departamento ya existe") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Error al actualizar departamento" });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const result = await departmentsService.deleteDepartment(Number(id));
            res.json(result);
        } catch (error: any) {
            if (error.message === "Departamento no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            if (
                error.message ===
                "No se puede eliminar un departamento con tareas asociadas"
            ) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Error al eliminar departamento" });
        }
    }
}

export const departmentsController = new DepartmentsController();