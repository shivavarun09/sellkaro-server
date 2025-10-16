// const nodemailer = require("nodemailer");

// const nodeMailer = async (to, subject, htmlContent) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       secure: false, // true for 465, false for 587
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"SELLKARO" <${process.env.EMAIL_ID}>`,
//       to,
//       subject,
//       html:htmlContent,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", info.messageId);
//   } catch (error) {
//     console.error("Send mail failed:", error.message);
//   }
// };

// // **Export the function**
// module.exports = nodeMailer;

// nodeMailer.js (Brevo API version)
const SibApiV3Sdk = require("sib-api-v3-sdk");

const nodeMailer = async (to, subject, htmlContent) => {
  try {
    // Initialize Brevo client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY; // store this in your Render environment
console.log(process.env.BREVO_API_KEY)
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Email payload
    const sendSmtpEmail = {
      sender: {
        email: process.env.EMAIL_ID, // must be a verified sender in Brevo
        name: "SELLKARO",
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
    };

    // Send the email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Email sent successfully:", response.messageId || response);
  } catch (error) {
    console.error("❌ Send mail failed:", error.response?.text || error.message);
  }
};

module.exports = nodeMailer;
