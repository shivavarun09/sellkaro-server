// 

const BankAccount = require("../Model/bankAccountModel");
const BankAddMail = require("../utils/nodeMailer");

// Add or update bank account
const addOrUpdateBankAccount = async (req, res) => {
  try {
    const { bankName, accountHolderName, accountNumber, ifscCode } = req.body;

    // Validate request
    if (!bankName || !accountHolderName || !accountNumber || !ifscCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already has a bank account
    let bankAccount = await BankAccount.findOne({ user: req.user._id }).select("bankName accountHolderName accountNumber ifscCode");
    const isUpdate = !!bankAccount; // true if updating, false if adding

    if (isUpdate) {
      // Update existing account
      bankAccount.bankName = bankName;
      bankAccount.accountHolderName = accountHolderName;
      bankAccount.accountNumber = accountNumber;
      bankAccount.ifscCode = ifscCode;

      await bankAccount.save();
    } else {
      // Create new account
      bankAccount = await BankAccount.create({
        user: req.user._id,
        bankName,
        accountHolderName,
        accountNumber,
        ifscCode,
      });
    }

    // Prepare email content
    const emailSubject = isUpdate
      ? "Your bank account has been updated successfully"
      : "Your bank account has been added successfully";

  const emailBody = `
  <!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your Bank Account was Submitted</title>
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
      display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px;
      max-height: 0; max-width: 0; opacity: 0; overflow: hidden;
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
  <span class="preheader">Your bank account has been added successfully</span>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 6px 18px rgba(16,24,40,0.08); overflow: hidden;">
          <tr>
            <td style="padding: 28px 32px; background: linear-gradient(90deg, #3366ff 0%, #00ccff 100%);">
              <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #ffffff;">Your bank account has been added successfully</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 28px 32px; color: #0f172a; font-size: 16px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">Hi <strong>${req.user.email}</strong>,</p>
              <p style="margin: 0 0 24px; color: #374151;">Dear User, your bank account details for giftcard payment payouts have been successfully added/updated. Please find the submitted account details below. Thank you for using SellKaro!</p>
              
              <table border="0" cellspacing="0" cellpadding="0" role="presentation" style="width: 100%; margin-bottom: 24px; background-color:#f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px;">
                    <table border="0" cellspacing="0" cellpadding="0" role="presentation" style="width: 100%; font-size: 14px;">
                      <tr>
                        <td style="padding: 6px 0; color: #475569;">Name</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${accountHolderName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #475569;">Bank Name</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${bankName}</td>
                      </tr>
                        <tr>
                        <td style="padding: 6px 0; color: #475569;">Bank A/c No</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${accountNumber}</td>
                      </tr>
                       <tr>
                        <td style="padding: 6px 0; color: #475569;">IFSC Code</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${ifscCode}</td>
                      </tr>
                    
                    </table>
                  </td>
                </tr>
              </table>

              <table border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin-bottom: 24px; width: 100%;">
                <tr>
                  <td align="center">
                     <a href="https://sellkaro.vercel.app/profile" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; background-color: #2563eb; border-radius: 8px;">Update Bank account</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; font-size: 14px; color: #6b7280;">Need help? Just reply to this email or visit our <a href="https://sellkaro.example/support" target="_blank">support page</a>.</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 32px; background-color: #f1f5f9; color: #6b7280; font-size: 12px; text-align: center; line-height: 1.5;">
              <p style="margin: 0 0 8px;">SellKaro Pvt Ltd. &bull; Hyderabad, India</p>
              <p style="margin: 0 0 8px;">You received this email because you submitted a gift card on our website.</p>
              <p style="margin: 0;">© 2025 SellKaro. All rights reserved. &bull; <a href="https://sellkaro.example/unsubscribe?email={{email}}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a></p>
            </td>
          </tr>
        </table>
        </td>
    </tr>
  </table>
</body>
</html>
  `;

    // Send email
    await BankAddMail(req.user.email, emailSubject, emailBody);

    res.status(isUpdate ? 200 : 201).json({
      message: `Bank account ${isUpdate ? "updated" : "added"} successfully`,
      data: bankAccount,
    });
  } catch (error) {
    console.error(`Error in ${isUpdate ? "updating" : "adding"} bank account:`, error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch logged-in user's bank account
const getBankAccount = async (req, res) => {
  try {
    const bankAccount = await BankAccount.findOne({ user: req.user._id });

    if (!bankAccount) {
      return res.status(404).json({ message: "No bank account found" });
    }

    res.status(200).json({
      message: "Bank account fetched successfully",
      data: bankAccount,
    });
  } catch (error) {
    console.error("Error fetching bank account:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addOrUpdateBankAccount, getBankAccount };
