import express from "express";
import { AppDataSource } from "./database";
import datosRoutes from "./routes/datos.routes";

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Base de datos conectada");
    app.use("/datos", datosRoutes);
    app.listen(3000, () => console.log("🚀 Servidor corriendo en http://localhost:3000"));
  })
  .catch((err) => {
    console.error("❌ Error conectando a la base de datos", err);
  });
