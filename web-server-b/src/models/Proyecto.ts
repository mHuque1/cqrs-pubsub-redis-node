import { Schema, model, Document } from "mongoose";

export interface IProyecto extends Document {
  id: number;
  nombre: string;
  descripcion: string;
  equipoId: number;
}

const proyectoSchema = new Schema<IProyecto>({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  equipoId: { type: Number, required: true },
});

export default model<IProyecto>("Proyecto", proyectoSchema);
