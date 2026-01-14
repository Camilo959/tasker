// types/task.ts
export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "DONE";

  // Relaciones
  assignedToId: number;
  assignedTo: {
    id: number;
    name: string;
    email: string;
  };

  requestedById: number;  // 🔹 Nuevo campo
  requestedBy: {          // 🔹 Nuevo campo
    id: number;
    name: string;
    email: string;
  };

  departmentId: number | null;
  department: {
    id: number;
    name: string;
  } | null;

  createdAt: string;
}
