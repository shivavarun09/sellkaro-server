const User = require("../Model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUser = async(req,res,next)=>{
  try{
const {email,password} = req.body;

//Check email and password
if(!email || !password){
  return res.status(400).json({message:"Please enter email and password"})
}

const normalizedEmail = email.toLowerCase().trim();
//Find user in database
const user = await User.findOne({email:normalizedEmail})
if(!user){
  return res.status(400).json({message:"User not found, Please register"})
}
//Compare Password
const passwordMatch = await bcrypt.compare(password,user.password);
if(!passwordMatch){
  return res.status(400).json({message:"wrong password, try again "})
}

    // Generate JWT
    let token;
try{
     token = jwt.sign({ id: user._id,email:user.email,name:user.name,role:user.role}, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
}
catch(err){
   console.log(err);
            const error =
                new Error("Error! Something went wrong.");
            return next(error);

}
    res.status(200).json({
      message:"Login successfull",
      data:{
        // id:user._id,
        name:user.name,
        email:user.email,
        token,
        role:user.role,
      }
    })
  }
  catch(error){
    console.log("Login error")
    res.status(500).json({message:"server error"})
  }
  
}


module.exports = loginUser;