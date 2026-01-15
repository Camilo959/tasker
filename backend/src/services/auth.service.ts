import { Role } from "../../generated/prisma";
import { prisma } from "../config/db.config";
import { hashPassword, comparePassword } from "../utils/hash.util";
import { generateToken } from "../utils/jwt.util";

interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: Role;
}

interface LoginDTO {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    userId: number;
    name: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  async register(data: RegisterDTO) {
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
    });

    return { message: "Usuario creado", userId: user.id };
  }

  async login(data: LoginDTO): Promise<LoginResponse> {
    const { email, password } = data;

    // Buscar usuario
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      throw new Error("Usuario no encontrado o inactivo");
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Contraseña incorrecta");
    }

    // Generar token
    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    return {
      token,
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getProfile(userId: number) {
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

export const authService = new AuthService();