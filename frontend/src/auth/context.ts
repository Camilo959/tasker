// context.ts
import { createContext } from "react";

// Tipo que usamos internamente en el frontend
export interface User {
  id: number;
  role: string;
  name?: string;
  email?: string;
}

// Tipo que viene del backend
export interface BackendUser {
  userId: number;
  role: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (token: string, user?: BackendUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
