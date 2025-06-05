// web-server-a/src/lib/redis.ts
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379", // “redis” is the Docker service name
});

// Log any connection errors
redis.on("error", (err) => console.error("Redis Client Error:", err));

// Log when Redis is ready for commands
redis.on("ready", () => {
  console.log("✅ Connected to Redis");
});

// Immediately attempt to connect
(async () => {
  try {
    await redis.connect();
  } catch (err) {
    console.error("❌ Failed to connect to Redis:", err);
    process.exit(1);
  }
})();

export default redis;
