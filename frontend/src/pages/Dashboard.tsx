// pages/Dashboard.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px" 
      }}>
        <h1>Bienvenido, {user?.name || "Usuario"}</h1>
        <button onClick={logout} style={{ padding: "8px 16px" }}>
          Cerrar Sesión
        </button>
      </div>

      <div style={{ 
        display: "grid", 
        gap: "15px", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" 
      }}>
        {/* Todos pueden ver tareas */}
        <Link 
          to="/tasks" 
          style={{ 
            padding: "20px", 
            border: "1px solid #ccc", 
            textDecoration: "none",
            borderRadius: "8px",
            textAlign: "center"
          }}
        >
          <h2>📋 Tareas</h2>
          <p>Gestionar tareas</p>
        </Link>

        {/* Solo Admin ve departamentos */}
        {user?.role === "ADMIN" && (
          <Link 
            to="/departments" 
            style={{ 
              padding: "20px", 
              border: "1px solid #ccc", 
              textDecoration: "none",
              borderRadius: "8px",
              textAlign: "center"
            }}
          >
            <h2>🏢 Departamentos</h2>
            <p>Gestionar departamentos</p>
          </Link>
        )}

        {/* Solo Admin ve usuarios */}
        {user?.role === "ADMIN" && (
          <Link 
            to="/users" 
            style={{ 
              padding: "20px", 
              border: "1px solid #ccc", 
              textDecoration: "none",
              borderRadius: "8px",
              textAlign: "center"
            }}
          >
            <h2>👥 Usuarios</h2>
            <p>Gestionar usuarios</p>
          </Link>
        )}
      </div>
    </div>
  );
}