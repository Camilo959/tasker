import { Link } from "react-router-dom";
import { PageLayout } from "../components/layout/PageLayout";
import { Button } from "../components/common/Button";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorAlert } from "../components/common/ErrorAlert";
import { UsersTable } from "../components/users/UsersTable";
import { useUsers } from "../hooks/useUsers";

export default function Users() {
  const { users, loading, error } = useUsers();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <PageLayout
      title="👥 Usuarios"
      actions={
        <Link to="/users/create">
          <Button>+ Nuevo Usuario</Button>
        </Link>
      }
      backLink="/dashboard"
    >
      {users.length === 0 ? (
        <p>No hay usuarios registrados</p>
      ) : (
        <UsersTable users={users} />
      )}
    </PageLayout>
  );
}
