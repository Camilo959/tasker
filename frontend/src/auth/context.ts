// context.ts
import { createContext } from "react";

interface User {
  id: number;
  role: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export type { User, AuthContextType }; // 👈 Exporta los tipos también