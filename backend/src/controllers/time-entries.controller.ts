import { Request, Response } from "express";
import { timeEntriesService } from "../services/time-entries.service";

export class TimeEntriesController {
  /**
   * POST /time-entries - Crear un registro de tiempo
   */
  async create(req: Request, res: Response) {
    const { taskId, date, hoursWorked, description } = req.body;

    // Validación
    if (!taskId || !date || !hoursWorked) {
      return res.status(400).json({
        error: "taskId, date y hoursWorked son requeridos",
      });
    }

    try {
      const timeEntry = await timeEntriesService.createTimeEntry(
        {
          taskId,
          date: new Date(date),
          hoursWorked: Number(hoursWorked),
          description,
        },
        req.user!.userId,
        req.user!.role
      );
      res.status(201).json(timeEntry);
    } catch (error: any) {
      if (error.message === "Tarea no encontrada") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Solo puedes registrar tiempo en tus propias tareas") {
        return res.status(403).json({ error: error.message });
      }
      if (error.message.includes("horas trabajadas")) {
        return res.status(400).json({ error: error.message });
      }
      // ✅ AGREGAR: Manejo específico para límite diario
      if (error.message.includes("Límite diario excedido")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Error al crear registro de tiempo" });
    }
  }

  /**
   * GET /time-entries/task/:taskId - Obtener registros de una tarea
   */
  async getByTask(req: Request, res: Response) {
    const { taskId } = req.params;

    try {
      const timeEntries = await timeEntriesService.getTimeEntriesByTask(
        Number(taskId),
        req.user!.userId,
        req.user!.role
      );
      res.json(timeEntries);
    } catch (error: any) {
      if (error.message === "Tarea no encontrada") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("No tienes permiso")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Error al obtener registros de tiempo" });
    }
  }

  /**
   * GET /time-entries - Obtener mis registros de tiempo
   */
  async getMine(req: Request, res: Response) {
    try {
      const timeEntries = await timeEntriesService.getMyTimeEntries(
        req.user!.userId,
        req.user!.role
      );
      res.json(timeEntries);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener registros de tiempo" });
    }
  }

  /**
   * PATCH /time-entries/:id - Actualizar un registro
   */
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { date, hoursWorked, description } = req.body;

    try {
      const timeEntry = await timeEntriesService.updateTimeEntry(
        Number(id),
        {
          date: date ? new Date(date) : undefined,
          hoursWorked: hoursWorked ? Number(hoursWorked) : undefined,
          description,
        },
        req.user!.userId,
        req.user!.role
      );
      res.json(timeEntry);
    } catch (error: any) {
      if (error.message === "Registro de tiempo no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Solo puedes editar tus propios registros de tiempo") {
        return res.status(403).json({ error: error.message });
      }
      if (error.message.includes("horas trabajadas")) {
        return res.status(400).json({ error: error.message });
      }
      // ✅ AGREGAR: Manejo específico para límite diario
      if (error.message.includes("Límite diario excedido")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Error al actualizar registro de tiempo" });
    }
  }

  /**
   * DELETE /time-entries/:id - Eliminar un registro
   */
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await timeEntriesService.deleteTimeEntry(
        Number(id),
        req.user!.userId,
        req.user!.role
      );
      res.json(result);
    } catch (error: any) {
      if (error.message === "Registro de tiempo no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Solo puedes eliminar tus propios registros de tiempo") {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Error al eliminar registro de tiempo" });
    }
  }
}

export const timeEntriesController = new TimeEntriesController();