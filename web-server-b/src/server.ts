// src/server.ts
import express, { Application, Request, Response, NextFunction } from "express";
import routes from "./routes/data.routes";
import cors from "cors";

export function createApp() : Application {
  const app = express();
 
  // Middleware
  app.use(cors());
  app.use(express.json());


  
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
};
