const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connection to database successful");
  } catch (error) {
    console.error("❌ Connection to database failed:", error.message);
    throw error; // let the calling function handle failure
  }
};

module.exports = connectToDb;
