const nodemailer = require("nodemailer");

const nodeMailer = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"SELLKARO" <${process.env.EMAIL_ID}>`,
      to,
      subject,
      html:htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Send mail failed:", error.message);
  }
};

// **Export the function**
module.exports = nodeMailer;
