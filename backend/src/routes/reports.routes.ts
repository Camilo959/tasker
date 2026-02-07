import { Router } from "express";
import { reportsController } from "../controllers/reports.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router();

// ✅ Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * GET /reports/summary
 * Resumen ejecutivo (solo ADMIN)
 */
router.get("/summary", isAdmin, reportsController.getExecutiveSummary);

/**
 * GET /reports/my-summary
 * Resumen personal del usuario autenticado
 */
router.get("/my-summary", reportsController.getMySummary);

/**
 * GET /reports/general
 * Reporte general de todos los empleados (solo ADMIN)
 * Query params: startDate?, endDate?
 */
router.get("/general", isAdmin, reportsController.getGeneralReport);

/**
 * GET /reports/departments
 * Reporte por departamentos (solo ADMIN)
 * Query params: startDate?, endDate?
 */
router.get("/departments", isAdmin, reportsController.getDepartmentsReport);

/**
 * GET /reports/date-range
 * Reporte por rango de fechas
 * Query params: startDate (required), endDate (required)
 */
router.get("/date-range", reportsController.getDateRangeReport);

/**
 * GET /reports/user/:userId
 * Reporte de un usuario específico
 * EMPLOYEE solo puede ver su propio reporte
 * ADMIN puede ver cualquier reporte
 * Query params: startDate?, endDate?
 */
router.get("/user/:userId", reportsController.getTimeByUser);

export default router;