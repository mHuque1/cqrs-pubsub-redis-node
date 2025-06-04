import amqp from 'amqplib';
import Record from '../models/record.model';

const QUEUE_NAME = 'data_queue';

const startQueueConsumer = async () => {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await conn.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`[Queue] Waiting for messages in ${QUEUE_NAME}...`);

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (!msg) return;

        try {
          const content = msg.content.toString();
          const data = JSON.parse(content);

          console.log('[Queue] Message received:', data);

          await Record.create({
            authorizationNumber: data.authorizationNumber,
            payload: data.payload,
          });

          channel.ack(msg);
        } catch (error) {
          console.error('[Queue] Failed to process message:', error);
          channel.nack(msg, false, false); // Discard message
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error('[Queue] Connection error:', err);
  }
};

export default startQueueConsumer;
