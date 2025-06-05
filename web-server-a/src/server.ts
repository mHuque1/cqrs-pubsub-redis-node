// web-server-a/src/server.ts
import express, { Application, Request, Response, NextFunction } from "express";
import routes from "./routes/datos.routes";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import tareaRoutes from "./routes/tarea.routes";

export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Mount all API routes under /api
  app.use("/api/auth", authRoutes);
  app.use("/api/tareas", tareaRoutes);
  app.use("/api", routes);

  // Health check
  app.get("/", (_req: Request, res: Response) => {
    res.send("API is running.");
  });

  // Error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error." });
  });

  return app;
}
