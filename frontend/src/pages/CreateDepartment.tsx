// pages/CreateDepartment.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CreateDepartment() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear departamento");
      }

      navigate("/departments");
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
      <h1>➕ Nuevo Departamento</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Nombre del Departamento *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej: Recursos Humanos, Ventas, TI..."
            style={{ 
              width: "100%", 
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}
          />
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
            {loading ? "Creando..." : "Crear Departamento"}
          </button>
          <Link to="/departments">
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