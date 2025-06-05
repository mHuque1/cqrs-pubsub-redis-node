// src/redis/subscriber.ts
import { createClient, RedisClientType } from "redis";
import mongoose from "mongoose";
import Tarea, { ITarea } from "../models/Tarea";
import Proyecto, { IProyecto } from "../models/Proyecto";
import Equipo, { IEquipo } from "../models/Equipo";
import Usuario, { IUsuario } from "../models/Usuario";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://redis:6379";
let redisClient: RedisClientType;

export async function startRedisSubscriber() {
  redisClient = createClient({ url: redisUrl });
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  await redisClient.connect();

  // Nos suscribimos al canal "tareas"
  const sub = redisClient.duplicate();
  await sub.connect();
  await sub.subscribe("tareas", async (message: string) => {
    try {
      const evento = JSON.parse(message) as {
        tipo: "TAREA_CREADA" | "TAREA_ACTUALIZADA";
        payload: {
          tareaId: number;
          titulo: string;
          descripcion?: string;
          estado: string;
          proyectoId: number;
          equipoId: number;
          fechaCreacion?: string;
          fechaActualizacion?: string;
        };
        timestamp: string;
      };

      if (evento.tipo === "TAREA_CREADA") {
        const {
          tareaId,
          titulo,
          descripcion,
          estado,
          proyectoId,
          equipoId,
          fechaCreacion,
        } = evento.payload;

        // (Opcional) Upsert del Proyecto y Equipo en Mongo
        // Si no tienes publicada la creación de proyectos/equipos en Redis,
        // asumes que ya están en Mongo o bien no te hace falta guardarlos.
        // A modo de ejemplo, podemos hacer un upsert para proyectos y equipos:

        // 1) Upsert Equipo
        await Equipo.findOneAndUpdate(
          { id: equipoId },
          { id: equipoId },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // 2) Upsert Proyecto
        await Proyecto.findOneAndUpdate(
          { id: proyectoId },
          {
            id: proyectoId,
            // Si tienes nombre/descr desde otro evento, podrías actualizarlo aquí.
            // Sino, dejas solo el id. Suponemos minimal.
            equipoId,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // 3) Crear/Actualizar la Tarea
        const nuevaTarea: Partial<ITarea> = {
          id: tareaId,
          titulo,
          descripcion,
          estado: estado as ITarea["estado"],
          proyectoId,
          equipoId,
          fechaCreacion: new Date(fechaCreacion!),
          fechaActualizacion: new Date(fechaCreacion!),
        };

        await Tarea.findOneAndUpdate(
          { id: tareaId },
          nuevaTarea,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } else if (evento.tipo === "TAREA_ACTUALIZADA") {
        const {
          tareaId,
          titulo,
          descripcion,
          estado,
          proyectoId,
          equipoId,
          fechaActualizacion,
        } = evento.payload;

        // En caso “actualizada”, hacemos findOneAndUpdate sin tocar fechaCreacion:
        const camposActualizar: Partial<ITarea> = {
          titulo,
          descripcion,
          estado: estado as ITarea["estado"],
          proyectoId,
          equipoId,
          fechaActualizacion: new Date(fechaActualizacion!),
        };

        await Tarea.findOneAndUpdate(
          { id: tareaId },
          camposActualizar,
          { upsert: true, new: true } // upsert en caso de que no exista (muy raro)
        );
      }
    } catch (err) {
      console.error("Error procesando evento Redis:", err);
    }
  });

  console.log("✅ Suscripto al canal 'tareas' y listo para sincronizar con MongoDB");
}
