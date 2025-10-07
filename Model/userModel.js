const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Please enter name"],
    trim:true,
  },
  email:{
    type:String,
    required:[true,"Please enter email id"],
    trim:true,
  },
  password:{
    type:String,
    required:[true,"Plase enter password"],
    minlength:8,
  },
    role:{
      type:String,
      enum:["user","admin"],
      default:"user",
    },
},{
timestamps:true,
}
);




const User = mongoose.model("User",userSchema);
module.exports= User;