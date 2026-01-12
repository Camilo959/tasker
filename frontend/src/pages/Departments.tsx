// pages/Departments.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Department {
  id: number;
  name: string;
}

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al cargar departamentos");

      const data = await response.json();
      setDepartments(data);
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

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el departamento "${name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/departments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al eliminar");
      }

      // Actualizar lista
      setDepartments(departments.filter((d) => d.id !== id));
      setDeleteError("");
    } catch (err: unknown) {
    if (err instanceof Error) {
      setDeleteError(err.message);
    } else {
      setDeleteError("Error inesperado");
    }
  }
  };

  if (loading) return <div style={{ padding: "20px" }}>Cargando...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px" 
      }}>
        <h1>🏢 Departamentos</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/departments/create">
            <button style={{ padding: "10px 20px" }}>+ Nuevo Departamento</button>
          </Link>
          <Link to="/dashboard">
            <button style={{ padding: "10px 20px" }}>← Volver</button>
          </Link>
        </div>
      </div>

      {deleteError && (
        <div style={{ 
          padding: "10px", 
          backgroundColor: "#ffebee", 
          color: "#c62828",
          borderRadius: "4px",
          marginBottom: "15px"
        }}>
          {deleteError}
        </div>
      )}

      {departments.length === 0 ? (
        <p>No hay departamentos registrados</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>
                ID
              </th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>
                Nombre
              </th>
              <th style={{ padding: "12px", textAlign: "center", border: "1px solid #ddd" }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {dept.id}
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {dept.name}
                </td>
                <td style={{ 
                  padding: "12px", 
                  border: "1px solid #ddd",
                  textAlign: "center" 
                }}>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <Link to={`/departments/edit/${dept.id}`}>
                      <button style={{ padding: "6px 12px" }}>✏️ Editar</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(dept.id, dept.name)}
                      style={{ 
                        padding: "6px 12px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}