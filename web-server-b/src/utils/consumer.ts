// src/utils/consumer.ts
import { connectRabbit, channel } from "../lib/rabbitmq";
import Dato from "../models/dato.model";

export const startConsumer = async () => {
  await connectRabbit();

  channel.consume("movements", async (msg) => {
    if (!msg) return;
    try {
      const data = JSON.parse(msg.content.toString());
      console.log("📥 Received:", data);
      await Dato.create(data);
      channel.ack(msg);
    } catch (err) {
      console.error("❌ Consumer error:", err);
    }
  });

  console.log("✅ RabbitMQ consumer listening on ‘movements’");
};
