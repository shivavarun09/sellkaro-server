const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectToDb = async()=>{
  try{
await mongoose.connect(process.env.MONGO_URI)
console.log(process.env.MONGO_URI)
// console.log(process.env.MONGO_URI)
console.log("Connection to database successfullllll ");
  }
  catch(error)
  {
console.log("Connection to database failed getting error",error.message)
  }
}



module.exports = connectToDb;