const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectToDb = async () => {
  const mongoUri = process.env.MONGO_URI;
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    throw error;
  }
};

module.exports = connectToDb;