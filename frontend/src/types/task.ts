export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  startDate: string | null;           // ✅ NUEVO
  hoursSpent: number;                 // ✅ NUEVO
  workDescription: string | null;     // ✅ NUEVO

  // Relaciones
  assignedToId: number;
  assignedTo: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };

  requestedById: number;
  requestedBy: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };

  departmentId: number | null;
  department: {
    id: number;
    name: string;
  } | null;

  timeEntries?: TimeEntry[];         // ✅ NUEVO
  createdAt: string;
  updatedAt?: string;
}

// ✅ NUEVO: Type para TimeEntry
export interface TimeEntry {
  id: number;
  taskId: number;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  date: string;
  hoursWorked: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ NUEVO: Type para Reportes
export interface TimeReport {
  userId: number;
  userName: string;
  email: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  totalHours: number;
  averageHoursPerTask: string | number;
  tasks?: {
    id: number;
    title: string;
    status: string;
    hoursSpent: number;
    startDate: string;
    department: string;
  }[];
}

// ✅ NUEVO: Type para DepartmentReport
export interface DepartmentReport {
  departmentId: number;
  departmentName: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  totalHours: number;
  averageHoursPerTask: string | number;
}