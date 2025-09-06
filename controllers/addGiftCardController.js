const GiftCard = require("../Model/giftCardModel");

// Add new gift card
const addGiftCard = async (req, res) => {
  try {
    const { gcbrand, gccode, gcpin, gcvalue, gcexpiry } = req.body;

    if (!gcbrand || !gccode || !gcpin || !gcvalue || !gcexpiry) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
      // ✅ Check manually before creating
    const existingCard = await GiftCard.findOne({ gccode });
    if (existingCard) {
      return res.status(400).json({ message: "Gift card code already exists" });
    }

    const giftCard = await GiftCard.create({
      user: req.user._id, // comes from authMiddleware
      gcbrand,
      gccode,
      gcpin,
      gcvalue,
      gcexpiry,
    });

    res.status(201).json({
      message: "Gift card listed successfully",
      data: giftCard,
    });
  } catch (error) {
    console.error("Error adding gift card:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = addGiftCard;
