import { Schema, model } from "mongoose";

const equipoSchema = new Schema({
  id: Number,
  nombre: String,
});

export default model("Equipo", equipoSchema);
