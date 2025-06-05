import { Schema, model, Document } from "mongoose";

export interface IUsuario extends Document {
  id: number;
  email: string;
  equipoId: number;
}

const usuarioSchema = new Schema<IUsuario>({
  id: { type: Number, required: true, unique: true },
  email: { type: String, required: true },
  equipoId: { type: Number, required: true },
});

export default model<IUsuario>("Usuario", usuarioSchema);
