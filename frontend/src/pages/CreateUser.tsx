import { FormLayout } from "../components/layout/FormLayout";
import { FormInput } from "../components/common/FormInput";
import { FormSelect } from "../components/common/FormSelect";
import { useForm } from "../hooks/useForm";
import { apiService } from "../services/api.service";

type CreateUserForm = {
  name: string;
  email: string;
  password: string;
  role: "EMPLOYEE" | "ADMIN";
};

export default function CreateUser() {
  const { values, loading, error, handleChange, handleSubmit } =
    useForm<CreateUserForm>({
      initialValues: {
        name: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
      },
      onSubmit: async (values) => {
        await apiService.createUser(values);
      },
      redirectPath: "/users",
      validate: (values) => {
        if (values.password.length < 6) {
          return "La contraseña debe tener al menos 6 caracteres";
        }
        return null;
      },
    });

  return (
    <FormLayout
      title="➕ Nuevo Usuario"
      onSubmit={handleSubmit}
      submitText="Crear Usuario"
      loading={loading}
      error={error}
      cancelLink="/users"
    >
      <FormInput
        label="Nombre Completo"
        name="name"
        value={values.name}
        onChange={handleChange}
        required
        placeholder="Juan Pérez"
      />

      <FormInput
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        required
        placeholder="usuario@empresa.com"
      />

      <FormInput
        label="Contraseña"
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        required
        minLength={6}
        placeholder="••••••••"
        helperText="Mínimo 6 caracteres"
      />

      <FormSelect
        label="Rol"
        name="role"
        value={values.role}
        onChange={handleChange}
        options={[
          { value: "EMPLOYEE", label: "Empleado" },
          { value: "ADMIN", label: "Administrador" },
        ]}
        helperText="Los administradores tienen acceso completo al sistema"
      />
    </FormLayout>
  );
}
