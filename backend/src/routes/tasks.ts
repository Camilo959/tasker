import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Crear tarea (Employee o Admin)
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, assignedToId, departmentId } = req.body;

  if (!title || !assignedToId) return res.status(400).json({ error: "Faltan datos" });

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedToId,
        requestedById: req.user!.userId,
        departmentId,
      },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error al crear tarea" });
  }
});

// Editar tarea propia (Employee) o cualquier (Admin)
router.patch("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const task = await prisma.task.findUnique({ where: { id: Number(id) } });
  if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

  // Solo Admin o propietario puede editar
  if (req.user!.role !== "ADMIN" && task.assignedToId !== req.user!.userId) {
    return res.status(403).json({ error: "No tienes permiso" });
  }

  const updated = await prisma.task.update({
    where: { id: Number(id) },
    data: { title, description, status },
  });

  res.json(updated);
});

// Listar tareas
router.get("/", authMiddleware, async (req, res) => {
  const { assignedToId, departmentId, fromDate, toDate } = req.query;

  let filters: any = {};

  // Filtros opcionales
  if (assignedToId) filters.assignedToId = Number(assignedToId);
  if (departmentId) filters.departmentId = Number(departmentId);
  if (fromDate || toDate) filters.createdAt = {};
  if (fromDate) filters.createdAt.gte = new Date(fromDate as string);
  if (toDate) filters.createdAt.lte = new Date(toDate as string);

  // Employee solo ve sus tareas
  if (req.user!.role === "EMPLOYEE") {
    filters.assignedToId = req.user!.userId;
  }

  const tasks = await prisma.task.findMany({
    where: filters,
    include: { assignedTo: true, department: true, requestedBy: true  },
  });

  res.json(tasks);
});

export default router;
