// src/controllers/tarea.controller.ts

import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";
import { publish } from "../utils/redis.util";

const prisma = new PrismaClient();

export async function crearTarea(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const { titulo, descripcion, proyectoId } = req.body;
  const { user } = req;

  if (!user) {
    res.status(401).json({ message: "No autenticado" });
    return;
  }
  if (!titulo || !proyectoId) {
    res
      .status(400)
      .json({ message: "Faltan campos obligatorios (titulo, proyectoId)" });
    return;
  }

  try {
    // Validar que el proyecto pertenece al equipo del usuario
    const proyecto = await prisma.proyecto.findUnique({
      where: { id: proyectoId },
    });

    if (!proyecto || proyecto.equipoId !== user.equipoId) {
      res
        .status(403)
        .json({ message: "No tienes permisos sobre ese proyecto" });
      return;
    }

    // Crear la tarea en MySQL
    const tarea = await prisma.tarea.create({
      data: {
        titulo,
        descripcion,
        estado: "pendiente",
        proyectoId,
      },
    });

    // Construir el evento para Redis
    const evento = {
      tipo: "TAREA_CREADA",
      payload: {
        tareaId: tarea.id,
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        estado: tarea.estado,
        proyectoId: tarea.proyectoId,
        equipoId: user.equipoId,
        fechaCreacion: tarea.fechaCreacion,
      },
      timestamp: new Date(),
    };

    // Publicar el evento en Redis (canal "tareas")
    await publish("tareas", JSON.stringify(evento));

    res.status(201).json(tarea);
    return;
  } catch (err) {
    console.error("Error al crear tarea:", err);
    res.status(500).json({ message: "Error interno del servidor" });
    return;
  }
}

export async function actualizarTarea(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const { tareaId, nuevoEstado } = req.body;
  const { user } = req;

  if (!user) {
    res.status(401).json({ message: "No autenticado" });
    return;
  }
  if (!tareaId || !nuevoEstado) {
    res
      .status(400)
      .json({ message: "Faltan campos obligatorios (tareaId, nuevoEstado)" });
    return;
  }

  try {
    // Buscar la tarea y verificar que existe
    const tareaExistente = await prisma.tarea.findUnique({
      where: { id: tareaId },
      include: {
        proyecto: true,
      },
    });
    if (!tareaExistente) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }

    // Verificar que la tarea pertenece a un proyecto del mismo equipo
    if (tareaExistente.proyecto.equipoId !== user.equipoId) {
      res
        .status(403)
        .json({ message: "No tienes permisos sobre esa tarea" });
      return;
    }

    // Actualizar estado en MySQL
    const updated = await prisma.tarea.update({
      where: { id: tareaId },
      data: {
        estado: nuevoEstado,
      },
    });

    // Construir evento de “TAREA_ACTUALIZADA”
    const evento = {
      tipo: "TAREA_ACTUALIZADA",
      payload: {
        tareaId: updated.id,
        titulo: updated.titulo,
        descripcion: updated.descripcion,
        estado: updated.estado,
        proyectoId: updated.proyectoId,
        equipoId: user.equipoId,
        fechaActualizacion: updated.fechaActualizacion,
      },
      timestamp: new Date(),
    };

    // Publicar en Redis
    await publish("tareas", JSON.stringify(evento));

    res.json(updated);
    return;
  } catch (err) {
    console.error("Error al actualizar tarea:", err);
    res.status(500).json({ message: "Error interno del servidor" });
    return;
  }
}
