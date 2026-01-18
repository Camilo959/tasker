import { Request, Response } from "express";
import { reportsService } from "../services/reports.service";

export class ReportsController {
  /**
   * GET /reports/user/:userId - Reporte de horas de un usuario
   */
  async getTimeReportByUser(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const report = await reportsService.getTimeReportByUser(
        Number(userId),
        req.user!.userId,
        req.user!.role
      );
      res.json(report);
    } catch (error: any) {
      if (error.message === "Usuario no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("No tienes permiso")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Error al obtener reporte" });
    }
  }

  /**
   * GET /reports/general - Reporte general de todos los empleados
   */
  async getGeneralTimeReport(req: Request, res: Response) {
    try {
      const report = await reportsService.getGeneralTimeReport(req.user!.role);
      res.json(report);
    } catch (error: any) {
      if (error.message.includes("Solo ADMIN")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Error al obtener reporte" });
    }
  }

  /**
   * GET /reports/department - Reporte de horas por departamento
   */
  async getTimeReportByDepartment(req: Request, res: Response) {
    try {
      const report = await reportsService.getTimeReportByDepartment(
        req.user!.role
      );
      res.json(report);
    } catch (error: any) {
      if (error.message.includes("Solo ADMIN")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Error al obtener reporte" });
    }
  }
}

export const reportsController = new ReportsController();