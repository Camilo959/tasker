// auth/AuthProvider.tsx
import { useState, type ReactNode } from "react";
import { AuthContext, type BackendUser, type User } from "./context";
import { setGlobalLogout } from "./authBridge";

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

  // login mapea BackendUser a User
  const login = (token: string, userData?: BackendUser) => {
    const formattedUser: User | null = userData
      ? { ...userData, id: userData.userId } // mapear userId → id
      : null;

    localStorage.setItem("token", token);
    if (formattedUser) localStorage.setItem("user", JSON.stringify(formattedUser));

    setUser(formattedUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // logout global para axios
  setGlobalLogout(logout);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
