import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

export const prisma = new PrismaClient();

const MAX_ATTEMPTS = 10;
const RETRY_DELAY_MS = 3000;

export async function connectMySQL(): Promise<void> {
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    try {
      await prisma.$connect();
      console.log("✅ Connected to MySQL (Prisma)");

      // 🔧 Run Prisma migration
      console.log("📦 Running Prisma migrations...");
      execSync("npx prisma migrate deploy", { stdio: "inherit" });

      console.log("✅ Prisma migrations completed successfully.");
      return;
    } catch (err: any) {
      attempts++;
      console.warn(
        `⏳ MySQL not ready (attempt ${attempts}/${MAX_ATTEMPTS}) – retrying in ${RETRY_DELAY_MS / 1000}s...`
      );
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }

  console.error("❌ Could not connect to MySQL after multiple attempts. Exiting.");
  process.exit(1);
}
