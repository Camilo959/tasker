import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FormLayout } from "../components/layout/FormLayout";
import { FormInput } from "../components/common/FormInput";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useForm } from "../hooks/useForm";
import { apiService } from "../services/api.service";
import type { Department } from "../types/department";

type EditDepartmentForm = {
  name: string;
};

export default function EditDepartment() {
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
  } = useForm<EditDepartmentForm>({
    initialValues: { name: "" },
    onSubmit: async (values) => {
      await apiService.updateDepartment(Number(id), values);
    },
    redirectPath: "/departments",
  });

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const departments = await apiService.getDepartments();
        const department = departments.find(
          (d: Department) => d.id === Number(id)
        );

        if (!department) {
          setError("Departamento no encontrado");
          return;
        }

        setValues({ name: department.name });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setInitialLoading(false);
      }
    };

    fetchDepartment();
  }, [id, setError, setValues]);

  if (initialLoading) return <LoadingSpinner />;

  return (
    <FormLayout
      title="✏️ Editar Departamento"
      onSubmit={handleSubmit}
      submitText="Guardar Cambios"
      loading={loading}
      error={error}
      cancelLink="/departments"
    >
      <FormInput
        label="Nombre del Departamento"
        name="name"
        value={values.name}
        onChange={handleChange}
        required
      />
    </FormLayout>
  );
}
