import { Router } from "express";
import { reportsController } from "../controllers/reports.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Reporte de horas de un usuario (ADMIN ve todo, EMPLOYEE ve solo el suyo)
router.get("/user/:userId", reportsController.getTimeReportByUser);
// Reporte general (solo ADMIN)
router.get("/general", isAdmin, reportsController.getGeneralTimeReport);
// Reporte por departamento (solo ADMIN)
router.get("/department", isAdmin, reportsController.getTimeReportByDepartment);

export default router;