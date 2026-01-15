import { prisma } from "../config/db.config";

interface CreateDepartmentDTO {
  name: string;
}

interface UpdateDepartmentDTO {
  name: string;
}

export class DepartmentsService {
  async getAllDepartments() {
    return await prisma.department.findMany({
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });
  }

  async getDepartmentById(departmentId: number) {
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        tasks: {
          include: {
            assignedTo: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!department) {
      throw new Error("Departamento no encontrado");
    }

    return department;
  }

  async createDepartment(data: CreateDepartmentDTO) {
    const { name } = data;

    // Verificar si ya existe un departamento con ese nombre
    const existingDepartment = await prisma.department.findUnique({
      where: { name },
    });

    if (existingDepartment) {
      throw new Error("Nombre de departamento ya existe");
    }

    return await prisma.department.create({
      data: { name },
    });
  }

  async updateDepartment(departmentId: number, data: UpdateDepartmentDTO) {
    const { name } = data;

    // Verificar si el departamento existe
    const existingDepartment = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!existingDepartment) {
      throw new Error("Departamento no encontrado");
    }

    // Verificar si el nuevo nombre ya está en uso
    if (name !== existingDepartment.name) {
      const nameExists = await prisma.department.findUnique({
        where: { name },
      });

      if (nameExists) {
        throw new Error("Nombre de departamento ya existe");
      }
    }

    return await prisma.department.update({
      where: { id: departmentId },
      data: { name },
    });
  }

  async deleteDepartment(departmentId: number) {
    // Verificar si el departamento existe
    const existingDepartment = await prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!existingDepartment) {
      throw new Error("Departamento no encontrado");
    }

    // Verificar si tiene tareas asociadas
    if (existingDepartment._count.tasks > 0) {
      throw new Error(
        "No se puede eliminar un departamento con tareas asociadas"
      );
    }

    await prisma.department.delete({
      where: { id: departmentId },
    });

    return { message: "Departamento eliminado" };
  }
}

export const departmentsService = new DepartmentsService();