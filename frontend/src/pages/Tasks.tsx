// pages/Tasks.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import type { Task } from "../types/task";

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al cargar tareas");
    }

    const data: Task[] = await response.json();
    setTasks(data);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "#ffc107";
      case "IN_PROGRESS": return "#2196f3";
      case "COMPLETED": return "#4caf50";
      default: return "#999";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING": return "Pendiente";
      case "IN_PROGRESS": return "En Progreso";
      case "COMPLETED": return "Completada";
      default: return status;
    }
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
        <h1>📋 Mis Tareas</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/tasks/create">
            <button style={{ padding: "10px 20px" }}>+ Nueva Tarea</button>
          </Link>
          <Link to="/dashboard">
            <button style={{ padding: "10px 20px" }}>← Volver</button>
          </Link>
        </div>
      </div>

      {tasks.length === 0 ? (
        <p>No hay tareas asignadas</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                borderLeft: `4px solid ${getStatusColor(task.status)}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <h3 style={{ margin: "0 0 8px 0" }}>{task.title}</h3>
                  <p style={{ margin: "0 0 8px 0", color: "#666" }}>
                    {task.description || "Sin descripción"}
                  </p>
                  <div style={{ display: "flex", gap: "15px", fontSize: "14px", color: "#666" }}>
                    <span>👤 {task.assignedTo.name}</span>
                    {task.department && <span>🏢 {task.department.name}</span>}
                    <span>📅 {new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      backgroundColor: getStatusColor(task.status),
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {getStatusText(task.status)}
                  </span>
                  
                  {/* Solo puede editar si es admin o propietario */}
                  {(user?.role === "ADMIN" || task.assignedToId === user?.userId) && (
                    <Link to={`/tasks/edit/${task.id}`}>
                      <button style={{ padding: "6px 12px" }}>✏️ Editar</button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}