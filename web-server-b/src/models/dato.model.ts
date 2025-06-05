import { Schema, model } from "mongoose";

const datoSchema = new Schema({
  id: Number,
  dato: String,
});

export default model("Dato", datoSchema);
