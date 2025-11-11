const User = require("../Model/userModel");

const ForgetPassword=async(req,res)=>{
const {email} = req.body;

const user = await User.findOne({email}).select("password");
res.status(200).json({
  message:"forget password",
  data:user
})
}

module.exports=ForgetPassword;