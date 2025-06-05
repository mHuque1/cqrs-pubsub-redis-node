import { Request, Response } from "express";
import { DatosService } from "../services/datos.service";

const service = new DatosService();

export const crearDato = async (req: Request, res: Response) => {
  try {
    const { dato } = req.body;

    if (typeof dato !== "string" || !dato.trim()) {
      res.status(400).json({
        error: "El campo 'dato' es requerido y debe ser un string no vacío.",
      });
      return;
    }

    const nuevo = await service.crear(dato.trim());
    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error en crearDato:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};


export const obtenerDatos = async (_: Request, res: Response) => {
  try {
    const datos = await service.obtenerTodos();
    res.json(datos);
  } catch (error) {
    console.error("Error en obtenerDatos:", error);
    res.status(500).json({ error: "Error al obtener los datos." });
  }
};
