import { Schema, model, Document } from "mongoose";

export interface ITarea extends Document {
  id: number;
  titulo: string;
  descripcion?: string;
  estado: "pendiente" | "en_progreso" | "completada";
  proyectoId: number;
  equipoId: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

const tareaSchema = new Schema<ITarea>({
  id: { type: Number, required: true, unique: true },
  titulo: { type: String, required: true },
  descripcion: { type: String },
  estado: {
    type: String,
    enum: ["pendiente", "en_progreso", "completada"],
    required: true,
  },
  proyectoId: { type: Number, required: true },
  equipoId: { type: Number, required: true },
  fechaCreacion: { type: Date, required: true },
  fechaActualizacion: { type: Date, required: true },
});

// Crea índice compuesto para búsquedas frecuentes (opcional):
tareaSchema.index({ proyectoId: 1, equipoId: 1 });

export default model<ITarea>("Tarea", tareaSchema);
