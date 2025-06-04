import express from 'express';
import dataRoutes from './routes/data.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/data', dataRoutes);

app.listen(PORT, () => {
  console.log(`Web Server A running on http://localhost:${PORT}`);
});
