import { Role } from "../../generated/prisma";
import { prisma } from "../config/db.config";
import { hashPassword } from "../utils/hash.util";

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: Role;
}

interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: Role;
  isActive?: boolean;
}

export class UsersService {
  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async createUser(data: CreateUserDTO) {
    const { name, email, password, role } = data;

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email ya registrado");
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return { message: "Usuario creado", user };
  }

  async updateUser(userId: number, data: UpdateUserDTO) {
    const { name, email, role, isActive } = data;

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("Usuario no encontrado");
    }

    // Si se está actualizando el email, verificar que no exista
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        throw new Error("Email ya está en uso");
      }
    }

    // Actualizar usuario
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role,
        isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return user;
  }

  async getUserById(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user;
  }
}

export const usersService = new UsersService();