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
      `${gcbrand} listed for sale`,
      `<div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Your ${gcbrand} Gift Card is now listed for sale!</h2>
        <p>Value: ${gcvalue}</p>
        <p>Thank you for using <strong>SELLKARO</strong>! 🎉</p>
        <a href="https://your-website.com/user/giftcards" 
           style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
           View Your Gift Cards
        </a>
      </div>`
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
