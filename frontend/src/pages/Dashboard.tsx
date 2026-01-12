import { useAuth } from "../auth/useAuth";
import { Button } from "../components/common/Button";
import { DashboardCard } from "../components/dashboard/DashboardCard";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1>Bienvenido, {user?.name || "Usuario"}</h1>
          <p style={{ color: "#666", margin: "5px 0 0 0" }}>
            Rol: {user?.role === "ADMIN" ? "Administrador" : "Empleado"}
          </p>
        </div>
        <Button onClick={logout} variant="secondary">
          Cerrar Sesión
        </Button>
      </div>

      <div
        style={{
          display: "grid",
          gap: "15px",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        <DashboardCard
          to="/tasks"
          icon="📋"
          title="Tareas"
          description="Gestionar tareas"
        />

        {user?.role === "ADMIN" && (
          <>
            <DashboardCard
              to="/departments"
              icon="🏢"
              title="Departamentos"
              description="Gestionar departamentos"
            />
            <DashboardCard
              to="/users"
              icon="👥"
              title="Usuarios"
              description="Gestionar usuarios"
            />
          </>
        )}
      </div>
    </div>
  );
}
