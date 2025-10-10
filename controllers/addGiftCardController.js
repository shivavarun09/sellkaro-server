const GiftCard = require("../Model/giftCardModel");
const SellGiftCardMail = require("../utils/nodeMailer");

const addGiftCard = async (req, res) => {
  try {
    const { gcbrand, gccode, gcpin, gcvalue, gcexpiry } = req.body;
// Conditons for fee
const feeMap = {
  "Amazon": { name: "Amazon", fee: 10 },
  "Flipkart": { name: "Flipkart", fee: 15 },
};
let selectedGcBrand = feeMap[gcbrand];
let gcBrandFee = (gcvalue*selectedGcBrand.fee)/100; 
let userPayout = gcvalue- gcBrandFee
    // Validate input
    if (!gcbrand || !gccode || !gcpin || !gcvalue || !gcexpiry) {
      return res.status(400).json({ message: "Please enter all giftcard details" });
    }

    // Check duplicate code
    const existingCard = await GiftCard.findOne({ gccode });
    if (existingCard) {
      return res.status(400).json({ message: "Gift card code already exists" });
    }

    // Create gift card
    const giftCard = await GiftCard.create({
      user: req.user._id, // from auth middleware
      userEmail:req.user.email,
      gcbrand,
      gccode,
      gcpin,
      gcvalue,
      gcexpiry,
      gcUserPayout:userPayout
    });

    // Send email (async, log errors but don’t block response)
    SellGiftCardMail(
      req.user.email,
      `Your ${gcbrand} gift card has been submitted successfully.`,
      `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your ${gcbrand} Gift Card was Submitted</title>
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
  <span class="preheader">Your ${gcbrand} gift card has been submitted successfully.</span>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 6px 18px rgba(16,24,40,0.08); overflow: hidden;">
          <tr>
            <td style="padding: 28px 32px; background: linear-gradient(90deg, #3366ff 0%, #00ccff 100%);">
              <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #ffffff;">${gcbrand} Gift Card Submitted</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 28px 32px; color: #0f172a; font-size: 16px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">Hi <strong>${req.user.email}</strong>,</p>
              <p style="margin: 0 0 24px; color: #374151;">Your ${gcbrand} gift card has been submitted successfully. We are now verifying the details and will release the payment shortly. Thank you for using SellKaro!</p>
              
              <table border="0" cellspacing="0" cellpadding="0" role="presentation" style="width: 100%; margin-bottom: 24px; background-color:#f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px;">
                    <table border="0" cellspacing="0" cellpadding="0" role="presentation" style="width: 100%; font-size: 14px;">
                      <tr>
                        <td style="padding: 6px 0; color: #475569;">Gift Card Brand</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${gcbrand}</td>
                      </tr>
                        <tr>
                        <td style="padding: 6px 0; color: #475569;">Gift Card Code</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${gccode}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #475569;">PIN / Code</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${gcpin}</td>
                      </tr>
                       <tr>
                        <td style="padding: 6px 0; color: #475569;">Expiry</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${gcexpiry}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #475569;">Value</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${gcvalue}</td>
                      </tr>
                        <tr>
                        <td style="padding: 6px 0; color: #475569;">Fee</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${gcBrandFee}</td>
                      </tr>
                      <tr><td colspan="2" style="padding-top: 8px; border-bottom: 1px solid #e2e8f0;"></td></tr>
                      <tr>
                        <td style="padding: 12px 0 0; color: #475569; font-weight: 600;">Expected Payout</td>
                        <td style="padding: 12px 0 0; color: #16a34a; font-weight: 600; font-size: 16px; text-align: right;">${userPayout}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin-bottom: 24px; width: 100%;">
                <tr>
                  <td align="center">
                     <a href="{{view_giftcard_status_link}}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; background-color: #2563eb; border-radius: 8px;">View Status</a>
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
</html>`
    ).catch(err => console.error("Error sending gift card email:", err));

    res.status(201).json({
      message: "Gift card listed for sale successfully",
      data: giftCard,
    });
  } catch (error) {
    console.error("Error adding gift card:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = addGiftCard;
