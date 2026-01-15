// Extensión de tipos de Express para incluir usuario autenticado
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: string;
      };
    }
  }
}

export {};