import { Router } from "express";
import {
  crearTarea,
  actualizarTarea,
} from "../controllers/tarea.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// POST /api/tareas    → Crear tarea
router.post("/", authenticateToken, crearTarea);

// PUT /api/tareas     → Actualizar estado de tarea
router.put("/", authenticateToken, actualizarTarea);

export default router;
