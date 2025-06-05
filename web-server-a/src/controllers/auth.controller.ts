// src/controllers/auth.controller.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { signToken } from "../utils/jwt.util";

const prisma = new PrismaClient();

// Either annotate explicitly as RequestHandler… 
export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Debe enviar email y password" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { equipo: true },
    });

    if (!user) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }

    // Generar JWT con userId y equipoId
    const token = signToken({ userId: user.id, equipoId: user.equipoId });
    res.json({ token });
    return;
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error interno del servidor" });
    return;
  }
};
