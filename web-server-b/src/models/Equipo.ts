import { Schema, model, Document } from "mongoose";

export interface IEquipo extends Document {
  id: number;
  nombre: string;
}

const equipoSchema = new Schema<IEquipo>({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
});

export default model<IEquipo>("Equipo", equipoSchema);
