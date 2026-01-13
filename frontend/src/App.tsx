// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";

// Auth
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Tasks
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import EditTask from "./pages/EditTask";

// Departments
import Departments from "./pages/Departments";
import CreateDepartment from "./pages/CreateDepartment";
import EditDepartment from "./pages/EditDepartment";

// Users
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      
      {/* Dashboard (protegido) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Tareas (todos los usuarios autenticados) */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/create"
        element={
          <ProtectedRoute>
            <CreateTask />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/edit/:id"
        element={
          <ProtectedRoute>
            <EditTask />
          </ProtectedRoute>
        }
      />
      
      {/* Departamentos (solo admin) */}
      <Route
        path="/departments"
        element={
          <AdminRoute>
            <Departments />
          </AdminRoute>
        }
      />
      <Route
        path="/departments/create"
        element={
          <AdminRoute>
            <CreateDepartment />
          </AdminRoute>
        }
      />
      <Route
        path="/departments/edit/:id"
        element={
          <AdminRoute>
            <EditDepartment />
          </AdminRoute>
        }
      />
      
      {/* Usuarios (solo admin) */}
      <Route
        path="/users"
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        }
      />
      <Route
        path="/users/create"
        element={
          <AdminRoute>
            <CreateUser />
          </AdminRoute>
        }
      />
      <Route
        path="/users/edit/:id"
        element={
          <AdminRoute>
            <EditUser />
          </AdminRoute>
        }
      />
      
      {/* Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;