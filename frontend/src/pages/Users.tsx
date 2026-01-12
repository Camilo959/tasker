// pages/Users.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al cargar usuarios");

      const data = await response.json();
      setUsers(data);
    } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Error inesperado");
    }
  } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const isAdmin = role === "ADMIN";
    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "12px",
          backgroundColor: isAdmin ? "#2196f3" : "#4caf50",
          color: "white",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {isAdmin ? "ADMIN" : "EMPLEADO"}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "12px",
          backgroundColor: isActive ? "#4caf50" : "#f44336",
          color: "white",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {isActive ? "ACTIVO" : "INACTIVO"}
      </span>
    );
  };

  if (loading) return <div style={{ padding: "20px" }}>Cargando...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px" 
      }}>
        <h1>👥 Usuarios</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/users/create">
            <button style={{ padding: "10px 20px" }}>+ Nuevo Usuario</button>
          </Link>
          <Link to="/dashboard">
            <button style={{ padding: "10px 20px" }}>← Volver</button>
          </Link>
        </div>
      </div>

      {users.length === 0 ? (
        <p>No hay usuarios registrados</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>
                  ID
                </th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>
                  Nombre
                </th>
                <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>
                  Email
                </th>
                <th style={{ padding: "12px", textAlign: "center", border: "1px solid #ddd" }}>
                  Rol
                </th>
                <th style={{ padding: "12px", textAlign: "center", border: "1px solid #ddd" }}>
                  Estado
                </th>
                <th style={{ padding: "12px", textAlign: "center", border: "1px solid #ddd" }}>
                  Fecha Registro
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {user.id}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {user.name}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {user.email}
                  </td>
                  <td style={{ 
                    padding: "12px", 
                    border: "1px solid #ddd",
                    textAlign: "center" 
                  }}>
                    {getRoleBadge(user.role)}
                  </td>
                  <td style={{ 
                    padding: "12px", 
                    border: "1px solid #ddd",
                    textAlign: "center" 
                  }}>
                    {getStatusBadge(user.isActive)}
                  </td>
                  <td style={{ 
                    padding: "12px", 
                    border: "1px solid #ddd",
                    textAlign: "center" 
                  }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}