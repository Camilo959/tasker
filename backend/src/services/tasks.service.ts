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
    });

    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    // Verificar permisos: Solo ADMIN o el usuario asignado puede editar
    if (userRole !== "ADMIN" && task.assignedToId !== userId) {
      throw new Error("No tienes permiso para editar esta tarea");
    }

    return await prisma.task.update({
      where: { id: taskId },
      data,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        requestedBy: {
          select: { id: true, name: true, email: true },
        },
        department: true,
      },
    });
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

    return await prisma.task.findMany({
      where,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
        requestedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        department: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
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
      },
    });

    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    // Employee solo puede ver sus tareas
    if (userRole === "EMPLOYEE" && task.assignedToId !== userId) {
      throw new Error("No tienes permiso para ver esta tarea");
    }

    return task;
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
}

export const tasksService = new TasksService();