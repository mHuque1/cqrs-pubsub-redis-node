import { Schema, model } from "mongoose";

const tareaSchema = new Schema({
  id: Number,
  titulo: String,
  descripcion: String,
  estado: {
    type: String,
    enum: ["pendiente", "en_progreso", "completada"],
  },
  proyectoId: Number,
  equipoId: Number,
  fechaCreacion: Date,
  fechaActualizacion: Date,
});

export default model("Tarea", tareaSchema);
