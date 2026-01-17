import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";
import { CircularProgress, Box } from "@mui/material";

// Lazy pages
const Login = lazy(() => import("./pages/auth/Login"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Tasks = lazy(() => import("./pages/tasks/Tasks"));
const CreateTask = lazy(() => import("./pages/tasks/CreateTask"));
const EditTask = lazy(() => import("./pages/tasks/EditTask"));
const Departments = lazy(() => import("./pages/departments/Departments"));
const CreateDepartment = lazy(() => import("./pages/departments/CreateDepartment"));
const EditDepartment = lazy(() => import("./pages/departments/EditDepartment"));
const Users = lazy(() => import("./pages/users/Users"));
const CreateUser = lazy(() => import("./pages/users/CreateUser"));
const EditUser = lazy(() => import("./pages/users/EditUser"));

const Loader = () => (
  <Box
    sx={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Público */}
        <Route path="/login" element={<Login />} />

        {/* Protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

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

        {/* Admin */}
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

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
