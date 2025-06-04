import express from 'express';
import datosRoutes from './routes/datos.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/datos', datosRoutes);

app.listen(PORT, () => {
  console.log(`Web Server A running on http://localhost:${PORT}`);
});
