import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGOURI;

if (!uri) throw new Error("❌ MONGOURI is not defined in .env");

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected via Mongoose");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Stop the server if DB connection fails
  }
};

