// src/server.ts
import express from "express";
import { connectMongo } from "./lib/mongo";
import dataRouter from "./routes/data.routes";

export const startServer = async () => {
  await connectMongo();

  const app = express();
  app.use(express.json());

  
  app.use("/datos", dataRouter);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🌐 Express server running on port ${PORT}`);
  });
};
