import { Link } from "react-router-dom";
import { PageLayout } from "../components/layout/PageLayout";
import { Button } from "../components/common/Button";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorAlert } from "../components/common/ErrorAlert";
import { useDepartments } from "../hooks/useDepartments";
import type { Department } from "../types/department";

export default function Departments() {
  const { departments, loading, error, deleteDepartment } = useDepartments();

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el departamento "${name}"?`)) return;
    await deleteDepartment(id);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <PageLayout
      title="🏢 Departamentos"
      actions={
        <Link to="/departments/create">
          <Button>+ Nuevo Departamento</Button>
        </Link>
      }
    >
      {departments.length === 0 ? (
        <p>No hay departamentos registrados</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nombre</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept: Department) => (
              <tr key={dept.id}>
                <td style={tdStyle}>{dept.id}</td>
                <td style={tdStyle}>{dept.name}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <Link to={`/departments/edit/${dept.id}`}>
                      <Button style={{ padding: "6px 12px" }}>✏️ Editar</Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(dept.id, dept.name)}
                      style={{ padding: "6px 12px" }}
                    >
                      🗑️ Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PageLayout>
  );
}

const thStyle = {
  padding: "12px",
  textAlign: "left" as const,
  border: "1px solid #ddd",
};

const tdStyle = {
  padding: "12px",
  border: "1px solid #ddd",
};
