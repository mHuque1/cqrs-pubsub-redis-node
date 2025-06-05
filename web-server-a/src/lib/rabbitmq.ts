import amqplib from "amqplib";

let channel: amqplib.Channel;

const AMQP_URL = process.env.AMQP_URL || "amqp://queue:5672";

export const connectRabbit = async () => {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    try {
      const connection = await amqplib.connect(AMQP_URL);
      channel = await connection.createChannel();
      await channel.assertQueue("datos_queue");
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

export const publishDato = async (dato: any) => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized.");
  }
  channel.sendToQueue("datos_queue", Buffer.from(JSON.stringify(dato)));
};
