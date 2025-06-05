// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt.util";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    equipoId: number;
  };
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({ message: "Token no proporcionado" });
    return;
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ message: "Formato de token inválido" });
    return;
  }
  const token = parts[1];
  try {
    const payload = verifyToken(token);
    req.user = {
      userId: payload.userId,
      equipoId: payload.equipoId,
    };
    next();
  } catch (err) {
    res.status(401).json({ message: "Token inválido o expirado" });
    return;
  }
}
