// pages/EditDepartment.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { Department } from "../types/department";


export default function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDepartment();
  }, [id]);

  const fetchDepartment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al cargar departamento");

      const departments: Department[] = await response.json();
      const department = departments.find((d) => d.id === Number(id));
      
      if (department) {
        setName(department.name);
      } else {
        setError("Departamento no encontrado");
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/departments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar");
      }

      navigate("/departments");
    } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Error inesperado");
    }
  } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Cargando...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>✏️ Editar Departamento</h1>
      
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
            disabled={saving}
            style={{ 
              padding: "10px 20px",
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1
            }}
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
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