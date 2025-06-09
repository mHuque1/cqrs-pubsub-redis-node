import express from "express";
import { crearDato, obtenerMovimiento } from "../controllers/datos.controller";

const router = express.Router();

router.post("/movements", crearDato);
router.get("/movements/:authorizationNumber", obtenerMovimiento);

export default router;