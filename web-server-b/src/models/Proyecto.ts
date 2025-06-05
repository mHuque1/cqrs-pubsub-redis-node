import { Schema, model } from "mongoose";

const proyectoSchema = new Schema({
  id: Number,
  nombre: String,
  descripcion: String,
  equipoId: Number,
});

export default model("Proyecto", proyectoSchema);
