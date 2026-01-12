import { Link } from "react-router-dom";
import { PageLayout } from "../components/layout/PageLayout";
import { Button } from "../components/common/Button";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorAlert } from "../components/common/ErrorAlert";
import { TaskCard } from "../components/tasks/TaskCard";
import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../auth/useAuth";
import type { Task } from "../types/task";

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, loading, error } = useTasks();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <PageLayout
      title="📋 Mis Tareas"
      actions={
        <Link to="/tasks/create">
          <Button>+ Nueva Tarea</Button>
        </Link>
      }
    >
      {tasks.length === 0 ? (
        <p>No hay tareas asignadas</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {tasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} currentUser={user} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
