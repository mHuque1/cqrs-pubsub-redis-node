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

export const getMovementsBetweenDates = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = req.query;

    if (!fromDate && !toDate) {
      res.status(400).json({
        error: "Se debe proporcionar al menos 'fromDate' o 'toDate'.",
      });
      return;
    }

    const dateFilter: Record<string, any> = {};

    if (fromDate) {
      const from = new Date(fromDate as string);
      if (isNaN(from.getTime())) {
        res.status(400).json({ error: "'fromDate' no es una fecha válida." });
        return;
      }
      dateFilter.$gte = from;
    }

    if (toDate) {
      const to = new Date(toDate as string);
      if (isNaN(to.getTime())) {
        res.status(400).json({ error: "'toDate' no es una fecha válida." });
        return;
      }
      dateFilter.$lte = to;
    }

    const movimientos = await Dato.find({ movementDate: dateFilter });
    res.json(movimientos);
  } catch (err) {
    console.error("Error al filtrar movimientos:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const getMovementsGroupedByMonth = async (
  _req: Request,
  res: Response
) => {
  try {
    const resultados = await Dato.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$movementDate" },
            month: { $month: "$movementDate" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          yyyymm: {
            $concat: [
              { $toString: "$_id.year" },
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
          amount: "$totalAmount",
        },
      },
      {
        $sort: { yyyymm: 1 }, // Ordena de menor a mayor
      },
    ]);

    res.json(resultados);
  } catch (err) {
    console.error("Error al agrupar movimientos:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
