// src/controllers/dato.controller.ts
import { Request, Response } from "express";
import Dato from "../models/dato.model";

export const getAllDatos = async (_req: Request, res: Response) => {
  try {
    const datos = await Dato.find();
    res.json(datos);
  } catch (err) {
    console.error("Error fetching datos:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
