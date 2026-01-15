import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import departmentsRoutes from "./routes/departments.routes";
import tasksRoutes from "./routes/tasks.routes";

const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Rutas
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/departments", departmentsRoutes);
app.use("/tasks", tasksRoutes);

// Ruta de salud
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

export default app;