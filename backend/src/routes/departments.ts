import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/roleMiddleware";

const router = Router();

// Listar todos los departamentos (admin/employee)
router.get("/", authMiddleware, async (_req, res) => {
  const departments = await prisma.department.findMany();
  res.json(departments);
});

// Crear departamento (solo admin)
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Falta nombre" });

  try {
    const department = await prisma.department.create({ data: { name } });
    res.json(department);
  } catch (error: any) {
    if (error.code === "P2002") return res.status(400).json({ error: "Nombre ya existe" });
    res.status(500).json({ error: "Error interno" });
  }
});

// Editar departamento (solo admin)
router.patch("/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const department = await prisma.department.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

// Eliminar departamento (solo admin)
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.department.delete({ where: { id: Number(id) } });
    res.json({ message: "Departamento eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

export default router;
