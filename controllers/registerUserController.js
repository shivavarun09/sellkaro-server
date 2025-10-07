const User = require("../Model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registrationMailGreet = require("../utils/nodeMailer");
const validator = require("validator");

const registerUser = async (req, res,next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
      if (password.length < 8) {
      return res.status(400).json({ message: "Password should minimum 8 characters" });
    }

    const normalizedEmail = email.toLowerCase().trim();
//Email validator
    if(!validator.isEmail(normalizedEmail)){
      return res.status(400).json({message:"please enter a valid email"})
    }
//Checking for only google email ids

// Allow only Google emails
if (!normalizedEmail.endsWith("@gmail.com")) {
  return res.status(400).json({ message: "Please register using google mail Id" });
}
    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists please login" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    //Sending registration Email
  await registrationMailGreet(
  normalizedEmail,
  "Welcome to SELLKARO!",
  `
  <div style="font-family: Arial, sans-serif; text-align: center;">
    <h2>Welcome, ${name}!</h2>
    <p>Your account has been successfully created on <strong>SELLKARO</strong>.</p>
    <p>Thank you for joining us! 🎉</p>
    <a href="https://your-website.com/login" 
       style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
       Login Now
    </a>
  </div>
  `
);

    // Generate JWT
    let token;
try{
     token = jwt.sign({ id: user._id,email:user.email,name:user.name}, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
}
catch(err){
   console.log(err);
            const error =
                new Error("Error! Something went wrong.");
            return next(error);

}

    res.status(201).json({
      message: "User registered successfully please login",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.error("User registration failed:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = registerUser;
