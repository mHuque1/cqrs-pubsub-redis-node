import { Request, Response } from "express";
import { DatosService } from "../services/datos.service";

const service = new DatosService();

export const crearDato = async (req: Request, res: Response) => {
  const { dato } = req.body;
  const nuevo = await service.crear(dato);
  res.status(201).json(nuevo);
};

export const obtenerDatos = async (_: Request, res: Response) => {
 const datos = await service.obtenerTodos();
  res.json(datos);
}; //hola
