import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['manager', 'operator'], default: 'operator' },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const User = model('User', userSchema);
export default User;
