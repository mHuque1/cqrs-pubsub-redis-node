import { Schema, model } from "mongoose";

const datoSchema = new Schema(
  {
    authorizationNumber: { type: String, required: true, unique: true },
    movementDate: { type: Date, required: true },
    accountFrom: { type: String, required: true },
    accountTo: { type: String, required: true },
    destinationBank: { type: String, required: true },
    sourceBank: { type: String, required: true },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  {
    timestamps: true, // Opcional: para createdAt y updatedAt
  }
);

export default model("Dato", datoSchema);
