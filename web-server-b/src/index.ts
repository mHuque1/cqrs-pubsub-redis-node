// src/index.ts
import dotenv from "dotenv";
import { connectMongo } from "./lib/mongo";
import { createApp } from "./server";
import { startConsumer } from "./utils/consumer";

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

async function initializeServices() {
  await connectMongo();
  await startConsumer();
}

function startExpressServer() {
  const app = createApp();
  app.listen(PORT, () => {console.log(`🌐 Server-A running on port ${PORT}`);});
}

async function main() {
  await initializeServices();
  startExpressServer();
}


process.on("SIGINT", async () => {
  console.log("Server shutting down.");
  process.exit(0);
});

main().catch((err) => {
  console.error("❌ Initialization failed:", err);
  process.exit(1);
});
