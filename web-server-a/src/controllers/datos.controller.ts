import { Request, Response } from "express";
import { DatosService } from "../services/datos.service";

const service = new DatosService();

export const crearDato = async (req: Request, res: Response) => {
  try {
    const {
      authorizationNumber,
      accountFrom,
      accountTo,
      destinationBank,
      sourceBank,
      currency,
      amount,
    } = req.body;

    console.log(`Dato arribado ${req.body}`);
    // Validaciones
    const requiredFields = [
      { name: "authorizationNumber", value: authorizationNumber },
      { name: "accountFrom", value: accountFrom },
      { name: "accountTo", value: accountTo },
      { name: "destinationBank", value: destinationBank },
      { name: "sourceBank", value: sourceBank },
      { name: "currency", value: currency },
    ];

    for (const field of requiredFields) {
      if (typeof field.value !== "string" || !field.value.trim()) {
        res.status(400).json({
          error: `El campo '${field.name}' es requerido y debe ser un string no vacío.`,
        });
        return;
      }
    }

    // Now separately check that amount exists
    if (typeof amount !== "number" && typeof amount !== "string") {
      res.status(400).json({
        error:
          "El campo 'amount' es requerido y debe ser un número o un string que represente un número.",
      });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      res.status(400).json({
        error: "El campo 'amount' debe ser un número válido mayor que 0.",
      });
      return;
    }

    // Validar formato de sourceBank y destinationBank (debe contener '-')
    if (!sourceBank.includes("-") || !destinationBank.includes("-")) {
      res.status(400).json({
        error:
          "Los campos 'sourceBank' y 'destinationBank' deben contener un guión '-'.",
      });
      return;
    }

    // Usar la fecha actual
    const movementDate = new Date();

    // Llamar a servicio
    const nuevo = await service.crear({
      authorizationNumber: authorizationNumber.trim(),
      movementDate,
      accountFrom: accountFrom.trim(),
      accountTo: accountTo.trim(),
      destinationBank: destinationBank.trim(),
      sourceBank: sourceBank.trim(),
      currency: currency.trim(),
      amount: parsedAmount,
    });

    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error en crearDato:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const obtenerMovimiento = async (req: Request, res: Response) => {
  try {
    const { authorizationNumber } = req.params;

    if (
      typeof authorizationNumber !== "string" ||
      !authorizationNumber.trim()
    ) {
      res.status(400).json({
        error: "El parámetro 'authorizationNumber' es requerido.",
      });
      return;
    }

    const resultado = await service.obtenerPorAuthorizationNumber(
      authorizationNumber.trim()
    );


    if (!resultado) {
      res.status(404).json({ error: "Dato no encontrado." });
      return;
    }


    res.json(resultado);
  } catch (error) {
    console.error("Error en obtenerMovimiento:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
