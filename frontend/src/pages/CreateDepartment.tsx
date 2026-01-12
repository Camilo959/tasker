import { FormLayout } from "../components/layout/FormLayout";
import { FormInput } from "../components/common/FormInput";
import { useForm } from "../hooks/useForm";
import { apiService } from "../services/api.service";

type CreateDepartmentForm = {
  name: string;
};

export default function CreateDepartment() {
  const { values, loading, error, handleChange, handleSubmit } =
    useForm<CreateDepartmentForm>({
      initialValues: { name: "" },
      onSubmit: async (values) => {
        await apiService.createDepartment(values);
      },
      redirectPath: "/departments",
    });

  return (
    <FormLayout
      title="➕ Nuevo Departamento"
      onSubmit={handleSubmit}
      submitText="Crear Departamento"
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
        placeholder="Ej: Recursos Humanos, Ventas, TI..."
      />
    </FormLayout>
  );
}
