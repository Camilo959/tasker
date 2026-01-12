import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // 🔹 Importar cors
import { prisma } from "./lib/prisma";
import { authMiddleware } from "./middlewares/authMiddleware";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import departmentsRoutes from "./routes/departments";
import tasksRoutes from "./routes/tasks";

dotenv.config();

const app = express(); 
app.use(express.json());

// 🔹 Configurar CORS
app.use(cors({
  origin: "http://localhost:5173", // tu frontend
  credentials: true,               // útil si luego usas cookies
}));

// rutas
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/departments", departmentsRoutes);
app.use("/tasks", tasksRoutes);

// 🔹 Ruta protegida de ejemplo
app.get("/profile", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  res.json(user);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
