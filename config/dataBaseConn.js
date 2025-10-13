const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1); // Optional: exit process if DB connection fails
  }
};

module.exports = connectToDb;
