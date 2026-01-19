// services/api.service.ts
import type {
  Task,
  TimeEntry,
  TimeReport,
  DepartmentReport,
} from "../types/task";
import type { LoginResponse } from "../types/auth";
import type { User } from "../types/user";
import { getGlobalLogout } from "../auth/authBridge";

class APIService {
  private baseURL = "http://localhost:3000";

  // ========= HELPERS =========

  private getToken() {
    return localStorage.getItem("token");
  }

  private getHeaders(auth = true) {
    return {
      "Content-Type": "application/json",
      ...(auth && {
        Authorization: `Bearer ${this.getToken()}`,
      }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      const logout = getGlobalLogout();
      logout?.();
      window.location.href = "/login";
      throw new Error("No autorizado");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || "Error en la solicitud");
    }

    return response.json() as Promise<T>;
  }

  // ========= AUTH =========

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password }),
    });

    return this.handleResponse<LoginResponse>(response);
  }

  // ========= TASKS =========

  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${this.baseURL}/tasks`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Task[]>(response);
  }

  async getTaskById(id: number): Promise<Task> {
    const response = await fetch(`${this.baseURL}/tasks/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Task>(response);
  }

  async createTask(data: {
    title: string;
    description?: string | null;
    assignedToId: number;
    departmentId?: number | null;
  }): Promise<Task> {
    const response = await fetch(`${this.baseURL}/tasks`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Task>(response);
  }

  async updateTask(
    id: number,
    data: Partial<{
      title: string;
      description: string;
      status: string;
      startDate: string;
      workDescription: string;
    }>
  ): Promise<Task> {
    const response = await fetch(`${this.baseURL}/tasks/${id}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Task>(response);
  }

  async deleteTask(id: number): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/tasks/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  // ========= TIME ENTRIES =========

  async createTimeEntry(data: {
    taskId: number;
    date: string;
    hoursWorked: number;
    description?: string;
  }): Promise<TimeEntry> {
    const response = await fetch(
      `${this.baseURL}/tasks/time-entries`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      }
    );
    return this.handleResponse<TimeEntry>(response);
  }

  async getTimeEntriesByTask(taskId: number): Promise<TimeEntry[]> {
    const response = await fetch(
      `${this.baseURL}/tasks/time-entries/task/${taskId}`,
      {
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse<TimeEntry[]>(response);
  }

  async getMyTimeEntries(): Promise<TimeEntry[]> {
    const response = await fetch(
      `${this.baseURL}/tasks/time-entries/my`,
      {
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse<TimeEntry[]>(response);
  }

  async updateTimeEntry(
    id: number,
    data: Partial<{
      date: string;
      hoursWorked: number;
      description: string;
    }>
  ): Promise<TimeEntry> {
    const response = await fetch(
      `${this.baseURL}/tasks/time-entries/${id}`,
      {
        method: "PATCH",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      }
    );
    return this.handleResponse<TimeEntry>(response);
  }

  async deleteTimeEntry(id: number): Promise<{ message: string }> {
    const response = await fetch(
      `${this.baseURL}/tasks/time-entries/${id}`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse<{ message: string }>(response);
  }

  // ========= REPORTS =========

  async getUserTimeReport(userId: number): Promise<TimeReport> {
    const response = await fetch(
      `${this.baseURL}/reports/user/${userId}`,
      {
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse<TimeReport>(response);
  }

  async getGeneralTimeReport(): Promise<TimeReport[]> {
    const response = await fetch(
      `${this.baseURL}/reports/general`,
      {
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse<TimeReport[]>(response);
  }

  async getDepartmentTimeReport(): Promise<DepartmentReport[]> {
    const response = await fetch(
      `${this.baseURL}/reports/department`,
      {
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse<DepartmentReport[]>(response);
  }

  // ========= USERS =========

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseURL}/users`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<User[]>(response);
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User> {
    const response = await fetch(`${this.baseURL}/users`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<User>(response);
  }

  async updateUser(
    id: number,
    data: Partial<{
      name: string;
      email: string;
      role: string;
      isActive: boolean;
    }>
  ): Promise<User> {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<User>(response);
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  // ========= DEPARTMENTS =========

  async getDepartments(): Promise<Array<{ id: number; name: string }>> {
    const response = await fetch(`${this.baseURL}/departments`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Array<{ id: number; name: string }>>(
      response
    );
  }

  async createDepartment(data: { name: string }) {
    const response = await fetch(`${this.baseURL}/departments`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateDepartment(id: number, data: { name: string }) {
    const response = await fetch(`${this.baseURL}/departments/${id}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteDepartment(id: number) {
    const response = await fetch(`${this.baseURL}/departments/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new APIService();
