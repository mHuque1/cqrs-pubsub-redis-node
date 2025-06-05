// src/routes/data.routes.ts
import { Router } from "express";
import { getAllDatos } from "../controllers/data.controller";

const router = Router();

// GET /datos → getAllDatos
router.get("/", getAllDatos);

export default router;
