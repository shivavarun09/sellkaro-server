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

    const emailBody=   ` <!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to SellKaro</title>
  <link href="https://fonts.googleapis.com/css?family=Inter:400,600&display=swap" rel="stylesheet" type="text/css">
  <style>
    /* --- Client-Specific Resets --- */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; display: block; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f5f7fb; }
    a { color: #2563eb; }
    
    /* --- General Styles --- */
    body {
      font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
    }
    .preheader {
      display: none !important;
      visibility: hidden;
      mso-hide: all;
      font-size: 1px;
      line-height: 1px;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
    }
    
    /* --- Responsive Styles --- */
    @media screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100% !important; background-color: #f5f7fb;">
  <span class="preheader">Thanks for signing up! Just one more step to get started.</span>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 6px 18px rgba(16,24,40,0.08); overflow: hidden;">
          <tr>
            <td style="padding: 28px 32px; background: linear-gradient(90deg, #3366ff 0%, #00ccff 100%);">
              <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #ffffff;">Welcome to SellKaro</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 28px 32px; color: #0f172a; font-size: 16px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">Hi <strong>${normalizedEmail}</strong>,</p>
              <p style="margin: 0 0 24px; color: #374151;">Thanks for creating an account with us! You can now log in and start exploring your account by clicking the button below.</p>
              
              <table border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin-bottom: 24px; width: 100%;">
                <tr>
                  <td align="center">
                     <a href="https://sellkaro.vercel.app/login" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; background-color: #2563eb; border-radius: 8px;">Login Now</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; font-size: 14px; color: #6b7280;">Need help? Just reply to this email or visit our <a href="https://yoursite.example/support" target="_blank">support page</a>.</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 32px; background-color: #f1f5f9; color: #6b7280; font-size: 12px; text-align: center; line-height: 1.5;">
              <p style="margin: 0 0 8px;">sellKaro Pvt Ltd. &bull;Hyderabad, India</p>
              <p style="margin: 0 0 8px;">You received this email because you created an account on our website.</p>
              <p style="margin: 0;">
                © 2025 sellKaro All rights reserved. &bull; <a href="https://yoursite.example/unsubscribe?email={{email}}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
        </td>
    </tr>
  </table>
</body>
</html>
  `;
    //Sending registration Email
  await registrationMailGreet(
  normalizedEmail,
  "Your SellKaro account has been created successfully",
emailBody
);

    // Generate JWT
    let token;
try{
     token = jwt.sign({ id: user._id,email:user.email,name:user.name}, process.env.JWT_SECRET, {
      expiresIn: "10m",
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
