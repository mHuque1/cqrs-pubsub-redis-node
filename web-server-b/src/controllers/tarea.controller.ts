// src/controllers/tarea.controller.ts
import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Tarea from "../models/Tarea";

export async function obtenerTareasPorProyecto(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const { proyectoId } = req.params;
  const { user } = req;

  if (!user) {
    res.status(401).json({ message: "No autenticado" });
    return;
  }

  const proyectoIdNum = parseInt(proyectoId, 10);
  if (isNaN(proyectoIdNum)) {
    res.status(400).json({ message: "projectId inválido" });
    return;
  }

  try {
    // Buscar todas las tareas cuyo proyectoId coincida
    // y cuyo equipoId sea el mismo que el usuario.
    const tareas = await Tarea.find({
      proyectoId: proyectoIdNum,
      equipoId: user.equipoId,
    }).sort({ fechaCreacion: 1 });

    res.json({ tareas });
    return;
  } catch (err) {
    console.error("Error obteniendo tareas:", err);
    res.status(500).json({ message: "Error interno del servidor" });
    return;
  }
}
