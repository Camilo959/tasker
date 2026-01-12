import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FormLayout } from "../components/layout/FormLayout";
import { FormInput, FormSelect, FormTextarea } from "../components/common/"; //Cambiar después porque exporta todo
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useForm } from "../hooks/useForm";
import { apiService } from "../services/api.service";
import type { Task } from "../types/task";

export default function EditTask() {
  const { id } = useParams<{ id: string }>();
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    values,
    loading,
    error,
    handleChange,
    handleSubmit,
    setValues,
    setError,
  } = useForm({
    initialValues: {
      title: "",
      description: "",
      status: "PENDING",
    },
    onSubmit: async (values) => {
      await apiService.updateTask(Number(id), values);
    },
    redirectPath: "/tasks",
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const tasks = await apiService.getTasks();
        const task: Task | undefined = tasks.find((t: Task) => t.id === Number(id));

        if (task) {
          setValues({
            title: task.title,
            description: task.description || "",
            status: task.status,
          });
        } else {
          setError("Tarea no encontrada");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido al cargar la tarea");
        }
      } finally {
        setInitialLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (initialLoading) return <LoadingSpinner />;

  return (
    <FormLayout
      title="✏️ Editar Tarea"
      onSubmit={handleSubmit}
      submitText="Guardar Cambios"
      loading={loading}
      error={error}
      cancelLink="/tasks"
    >
      <FormInput
        label="Título"
        name="title"
        value={values.title}
        onChange={handleChange}
        required
      />

      <FormTextarea
        label="Descripción"
        name="description"
        value={values.description}
        onChange={handleChange}
      />

      <FormSelect
        label="Estado"
        name="status"
        value={values.status}
        onChange={handleChange}
        options={[
          { value: "PENDING", label: "Pendiente" },
          { value: "IN_PROGRESS", label: "En Progreso" },
          { value: "COMPLETED", label: "Completada" },
        ]}
      />
    </FormLayout>
  );
}
