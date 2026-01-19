// auth/AuthProvider.tsx
import { useState, type ReactNode } from "react";
import { AuthContext } from "./context";
import { setGlobalLogout } from "./authBridge";

interface User {
  id: number;
  role: string;
  name?: string;
}

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [user, setUser] = useState<User | null>(
    storedUser ? JSON.parse(storedUser) : null
  );

  const login = (token: string, userData?: User) => {
    localStorage.setItem("token", token);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData || null);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // 👇 Registramos logout para axios
  setGlobalLogout(logout);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
