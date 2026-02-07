import { prisma } from "../config/db.config";

interface TimeReportByUser {
  userId: number;
  userName: string;
  userEmail: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  totalHours: number;
  averageHoursPerTask: number;
  taskDetails: Array<{
    taskId: number;
    title: string;
    status: string;
    hoursSpent: number;
    department: string | null;
  }>;
}

interface TimeReportByDepartment {
  departmentId: number;
  departmentName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  totalHours: number;
  employeeCount: number;
  averageHoursPerTask: number;
}

interface GeneralTimeReport {
  totalEmployees: number;
  totalTasks: number;
  totalHours: number;
  averageHoursPerEmployee: number;
  employees: Array<{
    userId: number;
    userName: string;
    userEmail: string;
    totalTasks: number;
    completedTasks: number;
    totalHours: number;
  }>;
}

interface TimeReportByDateRange {
  startDate: string;
  endDate: string;
  totalHours: number;
  totalEntries: number;
  averageHoursPerDay: number;
  entriesByDay: Array<{
    date: string;
    hours: number;
    entriesCount: number;
  }>;
  entriesByTask: Array<{
    taskId: number;
    taskTitle: string;
    hours: number;
    entriesCount: number;
  }>;
}

export class ReportsService {
  /**
   * ✅ Reporte de tiempo por usuario específico
   */
  async getTimeReportByUser(
    userId: number,
    requestingUserId: number,
    requestingUserRole: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<TimeReportByUser> {
    // EMPLOYEE solo puede ver su propio reporte
    if (requestingUserRole === "EMPLOYEE" && userId !== requestingUserId) {
      throw new Error("Solo puedes ver tu propio reporte");
    }

    // Buscar usuario con todas sus tareas y time entries
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        assignedTasks: {
          include: {
            timeEntries: {
              where: {
                ...(startDate && endDate && {
                  date: {
                    gte: startDate,
                    lte: endDate,
                  },
                }),
              },
            },
            department: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const tasks = user.assignedTasks;

    // Calcular total de horas desde time entries (no desde hoursSpent)
    const totalHours = tasks.reduce((sum, task) => {
      const taskHours = task.timeEntries.reduce(
        (taskSum, entry) => taskSum + entry.hoursWorked,
        0
      );
      return sum + taskHours;
    }, 0);

    const completedTasks = tasks.filter((t) => t.status === "DONE").length;
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS")
      .length;
    const pendingTasks = tasks.filter((t) => t.status === "PENDING").length;

    return {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      totalTasks: tasks.length,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      totalHours: parseFloat(totalHours.toFixed(2)),
      averageHoursPerTask:
        tasks.length > 0
          ? parseFloat((totalHours / tasks.length).toFixed(2))
          : 0,
      taskDetails: tasks.map((task) => {
        const taskHours = task.timeEntries.reduce(
          (sum, entry) => sum + entry.hoursWorked,
          0
        );
        return {
          taskId: task.id,
          title: task.title,
          status: task.status,
          hoursSpent: parseFloat(taskHours.toFixed(2)),
          department: task.department?.name || null,
        };
      }),
    };
  }

  /**
   * ✅ Reporte general de todos los empleados
   */
  async getGeneralTimeReport(
    userRole: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<GeneralTimeReport> {
    if (userRole !== "ADMIN") {
      throw new Error("Solo ADMIN puede ver reportes generales");
    }

    const users = await prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      include: {
        assignedTasks: {
          include: {
            timeEntries: {
              where: {
                ...(startDate && endDate && {
                  date: {
                    gte: startDate,
                    lte: endDate,
                  },
                }),
              },
            },
          },
        },
      },
    });

    let totalHours = 0;
    let totalTasks = 0;

    const employees = users.map((user) => {
      const tasks = user.assignedTasks;
      const userHours = tasks.reduce((sum, task) => {
        const taskHours = task.timeEntries.reduce(
          (taskSum, entry) => taskSum + entry.hoursWorked,
          0
        );
        return sum + taskHours;
      }, 0);

      totalHours += userHours;
      totalTasks += tasks.length;

      return {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t) => t.status === "DONE").length,
        totalHours: parseFloat(userHours.toFixed(2)),
      };
    });

    return {
      totalEmployees: users.length,
      totalTasks,
      totalHours: parseFloat(totalHours.toFixed(2)),
      averageHoursPerEmployee:
        users.length > 0
          ? parseFloat((totalHours / users.length).toFixed(2))
          : 0,
      employees,
    };
  }

  /**
   * ✅ Reporte de tiempo por departamento
   */
  async getTimeReportByDepartment(
    userRole: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<TimeReportByDepartment[]> {
    if (userRole !== "ADMIN") {
      throw new Error("Solo ADMIN puede ver reportes por departamento");
    }

    const departments = await prisma.department.findMany({
      include: {
        tasks: {
          include: {
            timeEntries: {
              where: {
                ...(startDate && endDate && {
                  date: {
                    gte: startDate,
                    lte: endDate,
                  },
                }),
              },
            },
            assignedTo: true,
          },
        },
      },
    });

    return departments.map((dept) => {
      const tasks = dept.tasks;

      // Calcular horas totales desde time entries
      const totalHours = tasks.reduce((sum, task) => {
        const taskHours = task.timeEntries.reduce(
          (taskSum, entry) => taskSum + entry.hoursWorked,
          0
        );
        return sum + taskHours;
      }, 0);

      // Contar empleados únicos
      const uniqueEmployees = new Set(tasks.map((t) => t.assignedToId));

      return {
        departmentId: dept.id,
        departmentName: dept.name,
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t) => t.status === "DONE").length,
        inProgressTasks: tasks.filter((t) => t.status === "IN_PROGRESS")
          .length,
        pendingTasks: tasks.filter((t) => t.status === "PENDING").length,
        totalHours: parseFloat(totalHours.toFixed(2)),
        employeeCount: uniqueEmployees.size,
        averageHoursPerTask:
          tasks.length > 0
            ? parseFloat((totalHours / tasks.length).toFixed(2))
            : 0,
      };
    });
  }

  /**
   * ✅ Reporte por rango de fechas (nuevo)
   */
  async getTimeReportByDateRange(
    userId: number,
    userRole: string,
    startDate: Date,
    endDate: Date
  ): Promise<TimeReportByDateRange> {
    // Buscar time entries en el rango de fechas
    const where: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    // EMPLOYEE solo ve sus propias entries
    if (userRole === "EMPLOYEE") {
      where.userId = userId;
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where,
      include: {
        task: true,
      },
      orderBy: { date: "asc" },
    });

    if (timeEntries.length === 0) {
      return {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        totalHours: 0,
        totalEntries: 0,
        averageHoursPerDay: 0,
        entriesByDay: [],
        entriesByTask: [],
      };
    }

    const totalHours = timeEntries.reduce(
      (sum, entry) => sum + entry.hoursWorked,
      0
    );

    // Agrupar por día
    const entriesByDay = new Map<string, { hours: number; count: number }>();
    timeEntries.forEach((entry) => {
      const dateKey = entry.date.toISOString().split("T")[0];
      const current = entriesByDay.get(dateKey) || { hours: 0, count: 0 };
      entriesByDay.set(dateKey, {
        hours: current.hours + entry.hoursWorked,
        count: current.count + 1,
      });
    });

    // Agrupar por tarea
    const entriesByTask = new Map<
      number,
      { title: string; hours: number; count: number }
    >();
    timeEntries.forEach((entry) => {
      const current = entriesByTask.get(entry.taskId) || {
        title: entry.task.title,
        hours: 0,
        count: 0,
      };
      entriesByTask.set(entry.taskId, {
        title: entry.task.title,
        hours: current.hours + entry.hoursWorked,
        count: current.count + 1,
      });
    });

    // Calcular días en el rango
    const daysInRange =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalEntries: timeEntries.length,
      averageHoursPerDay: parseFloat((totalHours / daysInRange).toFixed(2)),
      entriesByDay: Array.from(entriesByDay.entries())
        .map(([date, data]) => ({
          date,
          hours: parseFloat(data.hours.toFixed(2)),
          entriesCount: data.count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      entriesByTask: Array.from(entriesByTask.entries())
        .map(([taskId, data]) => ({
          taskId,
          taskTitle: data.title,
          hours: parseFloat(data.hours.toFixed(2)),
          entriesCount: data.count,
        }))
        .sort((a, b) => b.hours - a.hours),
    };
  }

  /**
   * ✅ Resumen ejecutivo (dashboard) - nuevo
   */
  async getExecutiveSummary(userRole: string) {
    if (userRole !== "ADMIN") {
      throw new Error("Solo ADMIN puede ver el resumen ejecutivo");
    }

    // Últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      totalTasks,
      completedTasks,
      totalDepartments,
      recentEntries,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "EMPLOYEE" } }),
      prisma.task.count(),
      prisma.task.count({ where: { status: "DONE" } }),
      prisma.department.count(),
      prisma.timeEntry.findMany({
        where: {
          date: { gte: thirtyDaysAgo },
        },
      }),
    ]);

    const totalHoursLastMonth = recentEntries.reduce(
      (sum, entry) => sum + entry.hoursWorked,
      0
    );

    return {
      totalEmployees: totalUsers,
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      completionRate:
        totalTasks > 0
          ? parseFloat(((completedTasks / totalTasks) * 100).toFixed(1))
          : 0,
      totalDepartments,
      totalHoursLastMonth: parseFloat(totalHoursLastMonth.toFixed(2)),
      averageHoursPerEmployee:
        totalUsers > 0
          ? parseFloat((totalHoursLastMonth / totalUsers).toFixed(2))
          : 0,
    };
  }
}

export const reportsService = new ReportsService();