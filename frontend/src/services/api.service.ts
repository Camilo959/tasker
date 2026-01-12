// services/api.service.ts
import api from "../api/axios";

class ApiService {
  // Método genérico para manejar errores
  private handleError(error: unknown): never {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error inesperado");
  }

  // Tasks
  async getTasks() {
    try {
      const response = await api.get("/tasks");
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createTask(data: {
    title: string;
    description: string | null;
    assignedToId: number;
    departmentId: number | null;
  }) {
    try {
      const response = await api.post("/tasks", data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateTask(
    id: number,
    data: {
      title?: string;
      description?: string;
      status?: string;
    }
  ) {
    try {
      const response = await api.patch(`/tasks/${id}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteTask(id: number) {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Departments
  async getDepartments() {
    try {
      const response = await api.get("/departments");
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createDepartment(data: { name: string }) {
    try {
      const response = await api.post("/departments", data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateDepartment(id: number, data: { name: string }) {
    try {
      const response = await api.patch(`/departments/${id}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteDepartment(id: number) {
    try {
      const response = await api.delete(`/departments/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Users
  async getUsers() {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    try {
      const response = await api.post("/users", data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateUser(id: number, data: Partial<{
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }>) {
    try {
      const response = await api.patch(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteUser(id: number) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const apiService = new ApiService();