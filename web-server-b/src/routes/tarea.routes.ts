// src/routes/tarea.routes.ts
import { Router } from "express";
import { obtenerTareasPorProyecto } from "../controllers/tarea.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// GET /api/tareas/:proyectoId  → devuelve tareas de un proyecto (solo para ese equipo)
router.get("/:proyectoId", authenticateToken, obtenerTareasPorProyecto);

export default router;
