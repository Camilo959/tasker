import { prisma } from "../config/db.config";

export class ReportsService {
  /**
   * ✅ Reporte de horas por empleado (ADMIN o el mismo usuario)
   */
  async getTimeReportByUser(
    userId: number,
    requestingUserId: number,
    requestingUserRole: string
  ) {
    // EMPLOYEE solo puede ver su propio reporte
    if (requestingUserRole === "EMPLOYEE" && userId !== requestingUserId) {
      throw new Error("No tienes permiso para ver el reporte de otro usuario");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        assignedTasks: {
          include: {
            timeEntries: true,
            department: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const tasks = user.assignedTasks;
    const totalHours = tasks.reduce((sum, task) => sum + task.hoursSpent, 0);
    const completedTasks = tasks.filter((t) => t.status === "DONE").length;

    return {
      userId,
      userName: user.name,
      email: user.email,
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks: tasks.filter((t) => t.status === "PENDING").length,
      inProgressTasks: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      totalHours,
      averageHoursPerTask:
        tasks.length > 0 ? (totalHours / tasks.length).toFixed(2) : 0,
      tasks: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        hoursSpent: t.hoursSpent,
        startDate: t.startDate,
        department: t.department?.name || "N/A",
      })),
    };
  }

  /**
   * ✅ Reporte general de todos los empleados (solo ADMIN)
   */
  async getGeneralTimeReport(userRole: string) {
    if (userRole !== "ADMIN") {
      throw new Error("Solo ADMIN puede ver reportes generales");
    }

    const users = await prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      include: {
        assignedTasks: true,
      },
    });

    return users.map((user) => {
      const tasks = user.assignedTasks;
      const totalHours = tasks.reduce((sum, task) => sum + task.hoursSpent, 0);
      const completedTasks = tasks.filter((t) => t.status === "DONE").length;

      return {
        userId: user.id,
        userName: user.name,
        email: user.email,
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks: tasks.filter((t) => t.status === "PENDING").length,
        inProgressTasks: tasks.filter(
          (t) => t.status === "IN_PROGRESS"
        ).length,
        totalHours,
        averageHoursPerTask:
          tasks.length > 0 ? (totalHours / tasks.length).toFixed(2) : 0,
      };
    });
  }

  /**
   * ✅ Reporte de horas por departamento (solo ADMIN)
   */
  async getTimeReportByDepartment(userRole: string) {
    if (userRole !== "ADMIN") {
      throw new Error("Solo ADMIN puede ver reportes por departamento");
    }

    const departments = await prisma.department.findMany({
      include: {
        tasks: true,
      },
    });

    return departments.map((dept) => {
      const tasks = dept.tasks;
      const totalHours = tasks.reduce((sum, task) => sum + task.hoursSpent, 0);
      const completedTasks = tasks.filter((t) => t.status === "DONE").length;

      return {
        departmentId: dept.id,
        departmentName: dept.name,
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks: tasks.filter((t) => t.status === "PENDING").length,
        inProgressTasks: tasks.filter(
          (t) => t.status === "IN_PROGRESS"
        ).length,
        totalHours,
        averageHoursPerTask:
          tasks.length > 0 ? (totalHours / tasks.length).toFixed(2) : 0,
      };
    });
  }
}

export const reportsService = new ReportsService();