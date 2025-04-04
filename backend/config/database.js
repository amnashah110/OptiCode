// config/database.js
import mongoose from 'mongoose';
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const mongoURI = process.env.MONGO_DB_URI;

// Function to connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
