import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const client = createClient({ url: redisUrl });

client.on("error", (err) => console.error("Redis Client Error", err));

// Conectarse a Redis al arrancar la app
(async () => {
  await client.connect();
  console.log("Conectado a Redis");
})();

export async function publish(channel: string, message: string) {
  await client.publish(channel, message);
}

export default client;
