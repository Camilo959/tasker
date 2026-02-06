import { TaskStatus } from "../../generated/prisma";
import { prisma } from "../config/db.config";

interface CreateTaskDTO {
  title: string;
  description?: string;
  assignedToId: number;
  requestedById: number;
  departmentId?: number;
}

interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  startDate?: Date;
  hoursSpent?: number;
  workDescription?: string;
}

interface TaskFilters {
  assignedToId?: number;
  departmentId?: number;
  fromDate?: Date;
  toDate?: Date;
  userRole: string;
  userId: number;
}

export class TasksService {
  async createTask(data: CreateTaskDTO) {
    const { title, description, assignedToId, requestedById, departmentId } =
      data;

    // Verificar que el usuario asignado existe
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedToId },
    });

    if (!assignedUser) {
      throw new Error("Usuario asignado no encontrado");
    }

    // Verificar que el departamento existe (si se proporciona)
    if (departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
      });

      if (!department) {
        throw new Error("Departamento no encontrado");
      }
    }

    return await prisma.task.create({
      data: {
        title,
        description,
        assignedToId,
        requestedById,
        departmentId,
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        requestedBy: {
          select: { id: true, name: true, email: true },
        },
        department: true,
        timeEntries: true,
      },
    });
  }

  async updateTask(
    taskId: number,
    data: UpdateTaskDTO,
    userId: number,
    userRole: string
  ) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { timeEntries: true }, // ← Incluir para recalcular horas
    });

    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    // ✅ Validar permisos
    this.validateEditPermissions(userRole, userId, data, task.assignedToId);

    // ✅ IMPORTANTE: No permitir editar hoursSpent directamente
    if (data.hoursSpent !== undefined) {
      console.warn("⚠️ hoursSpent no debe ser editado directamente. Se calcula desde TimeEntries.");
      delete data.hoursSpent;
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        startDate: data.startDate,
        workDescription: data.workDescription,
        // hoursSpent se calcula automáticamente
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        requestedBy: {
          select: { id: true, name: true, email: true },
        },
        department: true,
        timeEntries: true,
      },
    });

    // ✅ Recalcular hoursSpent
    return {
      ...updated,
      hoursSpent: updated.timeEntries.reduce(
        (sum, entry) => sum + entry.hoursWorked,
        0
      ),
    };
  }

  async getTasks(filters: TaskFilters) {
    let where: any = {};

    // Filtros opcionales
    if (filters.assignedToId) {
      where.assignedToId = filters.assignedToId;
    }

    if (filters.departmentId) {
      where.departmentId = filters.departmentId;
    }

    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) where.createdAt.gte = filters.fromDate;
      if (filters.toDate) where.createdAt.lte = filters.toDate;
    }

    // Employee solo ve sus tareas asignadas
    if (filters.userRole === "EMPLOYEE") {
      where.assignedToId = filters.userId;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
        requestedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        department: true,
        timeEntries: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // ✅ Calcular hoursSpent desde timeEntries
    return tasks.map((task) => ({
      ...task,
      hoursSpent: task.timeEntries.reduce(
        (sum, entry) => sum + entry.hoursWorked,
        0
      ),
    }));
  }

  async getTaskById(taskId: number, userId: number, userRole: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
        requestedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        department: true,
        timeEntries: true,
      },
    });

    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    // Employee solo puede ver sus tareas
    if (userRole === "EMPLOYEE" && task.assignedToId !== userId) {
      throw new Error("No tienes permiso para ver esta tarea");
    }

    // ✅ Calcular hoursSpent desde timeEntries
    return {
      ...task,
      hoursSpent: task.timeEntries.reduce(
        (sum, entry) => sum + entry.hoursWorked,
        0
      ),
    };
  }

  async deleteTask(taskId: number, userId: number, userRole: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    // Solo ADMIN puede eliminar tareas
    if (userRole !== "ADMIN") {
      throw new Error("Solo ADMIN puede eliminar tareas");
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return { message: "Tarea eliminada" };
  }

  // ✅ NUEVO: Validar permisos por campo
  private validateEditPermissions(
    userRole: string,
    userId: number,
    data: UpdateTaskDTO,
    taskAssignedToId: number
  ): void {
    // ADMIN puede editar todo
    if (userRole === "ADMIN") {
      return;
    }

    // EMPLOYEE solo de sus tareas asignadas
    if (userRole === "EMPLOYEE" && userId !== taskAssignedToId) {
      throw new Error("No tienes permiso para editar esta tarea");
    }

    // Campos que EMPLOYEE NO puede editar
    const forbiddenFields = ["title", "description"];
    const fieldsToEdit = Object.keys(data).filter(
      (key) => (data as any)[key] !== undefined
    );

    for (const field of fieldsToEdit) {
      if (forbiddenFields.includes(field)) {
        throw new Error(`No puedes editar el campo '${field}' como EMPLOYEE`);
      }
    }
  }
}

export const tasksService = new TasksService();