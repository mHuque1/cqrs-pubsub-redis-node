import { Schema, model } from 'mongoose';

const recordSchema = new Schema(
  {
    authorizationNumber: { type: String, required: true, unique: true },
    payload: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default model('Record', recordSchema);
