// src/routes/data.routes.ts
import { Router } from "express";
import { getAllDatos } from "../controllers/data.controller";

const router = Router();

router.get("/datos", getAllDatos);

export default router;
