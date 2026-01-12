import { Link } from "react-router-dom";
import { Button } from "../common/Button";
import type { Task } from "../../types/task";
import type { User } from "../../auth/context";

interface TaskCardProps {
  task: Task;
  currentUser: User | null;
}

export const TaskCard = ({ task, currentUser }: TaskCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#ffc107";
      case "IN_PROGRESS":
        return "#2196f3";
      case "COMPLETED":
        return "#4caf50";
      default:
        return "#999";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "IN_PROGRESS":
        return "En Progreso";
      case "COMPLETED":
        return "Completada";
      default:
        return status;
    }
  };

  const canEdit =
    currentUser?.role === "ADMIN" || task.assignedToId === currentUser?.userId;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        borderLeft: `4px solid ${getStatusColor(task.status)}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 8px 0" }}>{task.title}</h3>
          <p style={{ margin: "0 0 8px 0", color: "#666" }}>
            {task.description || "Sin descripción"}
          </p>
          <div
            style={{
              display: "flex",
              gap: "15px",
              fontSize: "14px",
              color: "#666",
            }}
          >
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

          {canEdit && (
            <Link to={`/tasks/edit/${task.id}`}>
              <Button style={{ padding: "6px 12px" }}>✏️ Editar</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
