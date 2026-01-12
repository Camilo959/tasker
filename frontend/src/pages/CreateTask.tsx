// pages/CreateTask.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Department, User } from "../types/task";

export default function CreateTask() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    
    try {
      // Cargar usuarios
      const usersRes = await fetch("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      // Cargar departamentos
      const deptsRes = await fetch("http://localhost:3000/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (deptsRes.ok) {
        const deptsData = await deptsRes.json();
        setDepartments(deptsData);
      }
    } catch (err) {
      console.error("Error cargando datos", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description: description || null,
          assignedToId: Number(assignedToId),
          departmentId: departmentId ? Number(departmentId) : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al crear tarea");
      }

      navigate("/tasks");
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
      <h1>➕ Nueva Tarea</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Título *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Asignar a *</label>
          <select
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Seleccionar usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Departamento</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Sin departamento</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
            {loading ? "Creando..." : "Crear Tarea"}
          </button>
          <button 
            type="button" 
            onClick={() => navigate("/tasks")}
            style={{ padding: "10px 20px" }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}