import express from 'express';
import 'dotenv/config';
import dataRoutes from './routes/data.routes';
import connectDB from './services/db.service';
import startQueueConsumer from './services/queue.service';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/all', dataRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server-B running at http://localhost:${PORT}`);
    startQueueConsumer(); // Queue logic handled by service
  });
});
