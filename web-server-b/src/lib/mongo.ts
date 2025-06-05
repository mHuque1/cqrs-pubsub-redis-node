import mongoose from "mongoose";

export const connectMongo = async () => {
  await mongoose.connect(process.env.MONGO_URL || "mongodb://mongodb:27017/appdb");
  console.log("✅ Connected to MongoDB");
};
