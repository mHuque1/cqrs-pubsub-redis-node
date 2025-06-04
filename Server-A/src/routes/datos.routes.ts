import express from "express";
import { crearDato, obtenerDatos } from "../controllers/datos.controller";

const router = express.Router();

router.post("/", crearDato);
router.get("/", obtenerDatos);

export default router;
