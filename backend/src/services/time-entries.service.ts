import { prisma } from "../config/db.config";

interface CreateTimeEntryDTO {
  taskId: number;
  date: Date;
  hoursWorked: number;
  description?: string;
}

interface UpdateTimeEntryDTO {
  date?: Date;
  hoursWorked?: number;
  description?: string;
}

export class TimeEntriesService {
  /**
   * ✅ Crear un registro de tiempo
   */
  async createTimeEntry(
    data: CreateTimeEntryDTO,
    userId: number,
    userRole: string
  ) {
    // Verificar que la tarea existe
    const task = await prisma.task.findUnique({
      where: { id: data.taskId },
    });

    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    // EMPLOYEE solo puede registrar tiempo en sus tareas
    if (userRole === "EMPLOYEE" && task.assignedToId !== userId) {
      throw new Error("Solo puedes registrar tiempo en tus propias tareas");
    }

    // Validar que hoursWorked sea positivo
    if (data.hoursWorked <= 0) {
      throw new Error("Las horas trabajadas deben ser mayor a 0");
    }

    // Crear TimeEntry
    const timeEntry = await prisma.timeEntry.create({
      data: {
        taskId: data.taskId,
        userId,
        date: new Date(data.date),
        hoursWorked: data.hoursWorked,
        description: data.description || null,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        task: true,
      },
    });

    // ✅ Actualizar hoursSpent en Task (suma total)
    await this.updateTaskTotalHours(data.taskId);

    return timeEntry;
  }

  /**
   * ✅ Obtener registros de tiempo de una tarea
   */
  async getTimeEntriesByTask(
    taskId: number,
    userId: number,
    userRole: string
  ) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    // Verificar permisos: ADMIN ve todos, EMPLOYEE solo si es suya
    if (userRole === "EMPLOYEE" && task.assignedToId !== userId) {
      throw new Error("No tienes permiso para ver los registros de esta tarea");
    }

    return await prisma.timeEntry.findMany({
      where: { taskId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: "desc" },
    });
  }

  /**
   * ✅ Obtener todos los registros de tiempo del usuario (EMPLOYEE ve solo los suyos)
   */
  async getMyTimeEntries(userId: number, userRole: string) {
    let where: any = { userId };

    // ADMIN ve todos los registros, EMPLOYEE solo los suyos
    if (userRole === "EMPLOYEE") {
      where.userId = userId;
    } else if (userRole === "ADMIN") {
      // Podría filtrar opcionalmente si lo necesita
      delete where.userId;
    }

    return await prisma.timeEntry.findMany({
      where,
      include: {
        task: { select: { id: true, title: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: "desc" },
    });
  }

  /**
   * ✅ Actualizar un registro de tiempo
   */
  async updateTimeEntry(
    timeEntryId: number,
    data: UpdateTimeEntryDTO,
    userId: number,
    userRole: string
  ) {
    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id: timeEntryId },
    });

    if (!timeEntry) {
      throw new Error("Registro de tiempo no encontrado");
    }

    // EMPLOYEE solo puede editar sus propios registros
    if (userRole === "EMPLOYEE" && timeEntry.userId !== userId) {
      throw new Error("Solo puedes editar tus propios registros de tiempo");
    }

    // Validar horas si se proporciona
    if (data.hoursWorked !== undefined && data.hoursWorked <= 0) {
      throw new Error("Las horas trabajadas deben ser mayor a 0");
    }

    const updated = await prisma.timeEntry.update({
      where: { id: timeEntryId },
      data: {
        date: data.date,
        hoursWorked: data.hoursWorked,
        description: data.description,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        task: true,
      },
    });

    // ✅ Recalcular horas de la tarea
    await this.updateTaskTotalHours(updated.taskId);

    return updated;
  }

  /**
   * ✅ Eliminar un registro de tiempo
   */
  async deleteTimeEntry(
    timeEntryId: number,
    userId: number,
    userRole: string
  ) {
    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id: timeEntryId },
    });

    if (!timeEntry) {
      throw new Error("Registro de tiempo no encontrado");
    }

    // EMPLOYEE solo puede eliminar sus propios registros
    if (userRole === "EMPLOYEE" && timeEntry.userId !== userId) {
      throw new Error("Solo puedes eliminar tus propios registros de tiempo");
    }

    const deleted = await prisma.timeEntry.delete({
      where: { id: timeEntryId },
    });

    // ✅ Recalcular horas de la tarea
    await this.updateTaskTotalHours(deleted.taskId);

    return { message: "Registro de tiempo eliminado" };
  }

  /**
   * 🔧 Privado: Recalcular hoursSpent de la tarea
   */
  private async updateTaskTotalHours(taskId: number): Promise<void> {
    const timeEntries = await prisma.timeEntry.findMany({
      where: { taskId },
    });

    const totalHours = timeEntries.reduce(
      (sum, entry) => sum + entry.hoursWorked,
      0
    );

    await prisma.task.update({
      where: { id: taskId },
      data: { hoursSpent: totalHours },
    });
  }
}

export const timeEntriesService = new TimeEntriesService();