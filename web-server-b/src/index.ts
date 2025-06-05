// src/index.ts
import { startServer } from "./server";
import { startConsumer } from "./utils/consumer";

async function initialize() {
  await startServer();
  await startConsumer();
}

initialize().catch((err) => {
  console.error("❌ Initialization failed:", err);
  process.exit(1);
});
