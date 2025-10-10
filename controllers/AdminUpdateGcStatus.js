const GiftCard = require("../Model/giftCardModel");
const GiftCardStatusMail = require("../utils/nodeMailer");

// Admin updates gift card status
const updateGiftCardStatus = async (req, res) => {
  try {
    const { id } = req.params; // gift card ID from URL
    const { status } = req.body; // new status from frontend

    // Validate status
    const validStatuses = ["Under Review", "Rejected", "Payout Released"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update gift card
    const giftCard = await GiftCard.findByIdAndUpdate(
      id,
      { gcstatus: status },
      { new: true }
    );

    if (!giftCard) {
      return res.status(404).json({ message: "Gift card not found" });
    }

    // Send email to the user
    if (giftCard.userEmail) {
      const emailSubject = `Gift Card Status Updated: ${giftCard.gcbrand}`;
      const emailBody = `
      <!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Update on your Giftcard</title>
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
  <span class="preheader">Your {{gc_brand}} gift card has been submitted successfully.</span>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 6px 18px rgba(16,24,40,0.08); overflow: hidden;">
          <tr>
            <td style="padding: 28px 32px; background: linear-gradient(90deg, #3366ff 0%, #00ccff 100%);">
              <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #ffffff;">Status Update: Gift Card Order #${giftCard.orderId}</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 28px 32px; color: #0f172a; font-size: 16px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">Hi <strong>${giftCard.userEmail}</strong>,</p>
              <p style="margin: 0 0 24px; color: #374151;">The status of your gift card order has been updated. You can view the details below. Thank you for using SellKaro.</p>
              
              <table border="0" cellspacing="0" cellpadding="0" role="presentation" style="width: 100%; margin-bottom: 24px; background-color:#f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px;">
                    <table border="0" cellspacing="0" cellpadding="0" role="presentation" style="width: 100%; font-size: 14px;">
                      <tr>
                        <td style="padding: 6px 0; color: #475569;">Gift Card Brand</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${giftCard.gcbrand}</td>
                      </tr>
                        <tr>
                        <td style="padding: 6px 0; color: #475569;">Gift Code</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${giftCard.gccode}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #475569;">PIN / Code</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${giftCard.gcpin}</td>
                      </tr>
                       <tr>
                        <td style="padding: 6px 0; color: #475569;">Expiry</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;"> ${giftCard.gcexpiry ? giftCard.gcexpiry.toISOString().slice(0,10) : 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #475569;">Giftcard Value</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${giftCard.gcvalue}</td>
                      </tr>
                          <tr>
                        <td style="padding: 6px 0; color: #475569;">Payout</td>
                        <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${giftCard.gcUserPayout}</td>
                      </tr>
                      <tr><td colspan="2" style="padding-top: 8px; border-bottom: 1px solid #e2e8f0;"></td></tr>
                      <tr>
                        <td style="padding: 12px 0 0; color: #475569; font-weight: 600;">Order Status</td>
                        <td style="padding: 12px 0 0; color: #16a34a; font-weight: 600; font-size: 16px; text-align: right;">${giftCard.gcstatus}</td>
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
</html>
      `;
      try {
        await GiftCardStatusMail(giftCard.userEmail, emailSubject, emailBody);
      } catch (emailError) {
        console.error("Error sending status email:", emailError.message);
      }
    }

    // Respond to admin
    res.status(200).json({
      message: "Gift card status updated successfully",
      data: giftCard,
    });
  } catch (error) {
    console.error("Error updating gift card status:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = updateGiftCardStatus;
