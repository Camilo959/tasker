import { Request, Response } from "express";
import { reportsService } from "../services/reports.service";

export class ReportsController {
  /**
   * GET /reports/user/:userId
   * Query params: startDate?, endDate? (formato: YYYY-MM-DD)
   */
  async getTimeByUser(req: Request, res: Response) {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    try {
      const report = await reportsService.getTimeReportByUser(
        Number(userId),
        req.user!.userId,
        req.user!.role,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(report);
    } catch (error: any) {
      if (error.message === "Usuario no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Solo puedes ver tu propio reporte") {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Error al generar reporte" });
    }
  }

  /**
   * GET /reports/general
   * Query params: startDate?, endDate? (formato: YYYY-MM-DD)
   */
  async getGeneralReport(req: Request, res: Response) {
    const { startDate, endDate } = req.query;

    try {
      const report = await reportsService.getGeneralTimeReport(
        req.user!.role,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(report);
    } catch (error: any) {
      if (error.message === "Solo ADMIN puede ver reportes generales") {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Error al generar reporte general" });
    }
  }

  /**
   * GET /reports/departments
   * Query params: startDate?, endDate? (formato: YYYY-MM-DD)
   */
  async getDepartmentsReport(req: Request, res: Response) {
    const { startDate, endDate } = req.query;

    try {
      const report = await reportsService.getTimeReportByDepartment(
        req.user!.role,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(report);
    } catch (error: any) {
      if (error.message === "Solo ADMIN puede ver reportes por departamento") {
        return res.status(403).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Error al generar reporte por departamento" });
    }
  }

  /**
   * GET /reports/date-range
   * Query params: startDate (required), endDate (required)
   */
  async getDateRangeReport(req: Request, res: Response) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: "startDate y endDate son requeridos (formato: YYYY-MM-DD)",
      });
    }

    try {
      const report = await reportsService.getTimeReportByDateRange(
        req.user!.userId,
        req.user!.role,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ error: "Error al generar reporte por fechas" });
    }
  }

  /**
   * GET /reports/summary
   * Resumen ejecutivo (solo ADMIN)
   */
  async getExecutiveSummary(req: Request, res: Response) {
    try {
      const summary = await reportsService.getExecutiveSummary(req.user!.role);
      res.json(summary);
    } catch (error: any) {
      if (error.message === "Solo ADMIN puede ver el resumen ejecutivo") {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Error al generar resumen ejecutivo" });
    }
  }

  /**
   * GET /reports/my-summary
   * Resumen personal del usuario (EMPLOYEE ve su propio resumen)
   */
  async getMySummary(req: Request, res: Response) {
    try {
      const report = await reportsService.getTimeReportByUser(
        req.user!.userId,
        req.user!.userId,
        req.user!.role
      );

      // Simplificar respuesta para summary personal
      const summary = {
        userName: report.userName,
        totalTasks: report.totalTasks,
        completedTasks: report.completedTasks,
        inProgressTasks: report.inProgressTasks,
        pendingTasks: report.pendingTasks,
        totalHours: report.totalHours,
        averageHoursPerTask: report.averageHoursPerTask,
      };

      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ error: "Error al generar tu resumen" });
    }
  }
}

export const reportsController = new ReportsController();