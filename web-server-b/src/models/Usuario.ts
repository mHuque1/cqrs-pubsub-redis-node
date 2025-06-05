import { Schema, model } from "mongoose";

const usuarioSchema = new Schema({
  id: Number,
  email: String,
  equipoId: Number,
});

export default model("Usuario", usuarioSchema);
