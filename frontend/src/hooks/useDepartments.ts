import { useState, useEffect } from "react";
import { apiService } from "../services/api.service";
import type { Department } from "../types/department";

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiService.getDepartments();
      setDepartments(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al cargar departamentos");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: number) => {
    try {
      await apiService.deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      return false;
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments,
    deleteDepartment,
  };
};
