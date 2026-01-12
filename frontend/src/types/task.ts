// types/task.ts
export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  assignedToId: number;
  departmentId: number | null;
  createdAt: string;
  assignedTo: {
    id: number;
    name: string;
    email: string;
  };
  department: {
    id: number;
    name: string;
  } | null;
}

export interface Department {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}