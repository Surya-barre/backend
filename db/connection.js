// connectDB.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load env variables

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // must match your .env key
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};

export default connectDB;
