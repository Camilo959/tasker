import { Router } from "express";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/roleMiddleware";
import { prisma } from "../lib/prisma";

const router = Router();

// Solo ADMIN puede ver todos los usuarios
router.get("/", authMiddleware, isAdmin, async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Solo ADMIN puede crear un usuario (alternativa a /auth/register)
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    res.json({ message: "Usuario creado", userId: user.id });
  } catch (error: any) {
    if (error.code === "P2002") return res.status(400).json({ error: "Email ya registrado" });
    res.status(500).json({ error: "Error interno" });
  }
});

// Editar usuario (solo admin)
router.patch("/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, role, isActive } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        role,
        isActive,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

export default router;
