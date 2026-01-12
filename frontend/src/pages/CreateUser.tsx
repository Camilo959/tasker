// pages/CreateUser.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CreateUser() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validación básica
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear usuario");
      }

      navigate("/users");
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

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>➕ Nuevo Usuario</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Nombre Completo *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Juan Pérez"
            style={{ 
              width: "100%", 
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="usuario@empresa.com"
            style={{ 
              width: "100%", 
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Contraseña * (mínimo 6 caracteres)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="••••••••"
            style={{ 
              width: "100%", 
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Rol *
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}
          >
            <option value="EMPLOYEE">Empleado</option>
            <option value="ADMIN">Administrador</option>
          </select>
          <small style={{ color: "#666", fontSize: "14px" }}>
            Los administradores tienen acceso completo al sistema
          </small>
        </div>

        {error && (
          <div style={{ 
            padding: "10px", 
            backgroundColor: "#ffebee", 
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "15px"
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: "10px 20px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? "Creando..." : "Crear Usuario"}
          </button>
          <Link to="/users">
            <button 
              type="button"
              style={{ 
                padding: "10px 20px",
                backgroundColor: "#9e9e9e",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Cancelar
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}