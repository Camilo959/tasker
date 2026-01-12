import { Router } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const SALT_ROUNDS = 10;

// 🔹 Registro de usuario (solo ADMIN)
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validación mínima
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    // Hashear password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.json({ message: "Usuario creado", userId: user.id });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email ya registrado" });
    }
    res.status(500).json({ error: "Error interno" });
  }
});

// auth.ts - Modifica el endpoint /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Faltan datos" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive)
    return res.status(401).json({ error: "Usuario no encontrado o inactivo" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ error: "Contraseña incorrecta" });

  // Generar JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || "supersecret",
    { expiresIn: "1h" }
  );

  // 👇 CAMBIO: Retornar también datos del usuario
  res.json({ 
    token,
    user: {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});


export default router;