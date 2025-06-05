// web-server-a/src/index.ts
import dotenv from "dotenv";
import { connectMySQL, prisma } from "./lib/mysql";
import "./lib/redis";
import { connectRabbit } from "./lib/rabbitmq";
import { createApp } from "./server";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function initializeServices() {
  await connectMySQL();    // ✅ Connected to MySQL (Prisma)
  // Redis auto-connects on import
  await connectRabbit();   // ✅ Connected to RabbitMQ
}

function startExpressServer() {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`🌐 Server-A running on port ${PORT}`);
  });
}

async function main() {
  await initializeServices();
  startExpressServer();
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisma disconnected. Server shutting down.");
  process.exit(0);
});

main().catch((err) => {
  console.error("❌ Initialization failed:", err);
  process.exit(1);
});
