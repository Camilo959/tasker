import { FormLayout } from "../components/layout/FormLayout";
import { FormInput } from "../components/common/FormInput";
import { FormSelect } from "../components/common/FormSelect";
import { FormTextarea } from "../components/common/FormTextarea";
import { useForm } from "../hooks/useForm";
import { useUsers } from "../hooks/useUsers";
import { useDepartments } from "../hooks/useDepartments";
import { apiService } from "../services/api.service";
import type { User } from "../types/user";
import type { Department } from "../types/department";

type CreateTaskForm = {
  title: string;
  description: string;
  assignedToId: string;
  departmentId: string;
};

export default function CreateTask() {
  const { users } = useUsers();
  const { departments } = useDepartments();

  const { values, loading, error, handleChange, handleSubmit } =
    useForm<CreateTaskForm>({
      initialValues: {
        title: "",
        description: "",
        assignedToId: "",
        departmentId: "",
      },
      onSubmit: async (values) => {
        await apiService.createTask({
          title: values.title,
          description: values.description || null,
          assignedToId: Number(values.assignedToId),
          departmentId: values.departmentId
            ? Number(values.departmentId)
            : null,
        });
      },
      redirectPath: "/tasks",
    });

  return (
    <FormLayout
      title="➕ Nueva Tarea"
      onSubmit={handleSubmit}
      submitText="Crear Tarea"
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
        label="Asignar a"
        name="assignedToId"
        value={values.assignedToId}
        onChange={handleChange}
        required
        options={users.map((user: User) => ({
          value: user.id,
          label: `${user.name} (${user.email})`,
        }))}
        placeholder="Seleccionar usuario"
      />

      <FormSelect
        label="Departamento"
        name="departmentId"
        value={values.departmentId}
        onChange={handleChange}
        options={departments.map((dept: Department) => ({
          value: dept.id,
          label: dept.name,
        }))}
        placeholder="Sin departamento"
      />
    </FormLayout>
  );
}
