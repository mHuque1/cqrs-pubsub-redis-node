import amqplib from "amqplib";

export let channel: amqplib.Channel;

const AMQP_URL = process.env.AMQP_URL || "amqp://queue:5672";
const QUEUE_NAME = "datos_queue";

export const connectRabbit = async () => {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    try {
      const connection = await amqplib.connect(AMQP_URL);
      channel = await connection.createChannel();
      await channel.assertQueue(QUEUE_NAME);
      console.log("✅ Connected to RabbitMQ");
      return channel;
    } catch (err) {
      attempts++;
      console.warn(`⏳ RabbitMQ not ready (attempt ${attempts}/${maxAttempts})`);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  throw new Error("❌ Could not connect to RabbitMQ after multiple attempts.");
};
