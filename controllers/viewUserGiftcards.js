const GiftCard = require('../Model/giftCardModel');

// Get logged-in user's gift cards
const getUserGiftCards = async (req, res) => {
  try {
    const giftCards = await GiftCard.find({ user: req.user._id });
    res.json({ data: giftCards });
  } catch (error) {
    console.error("Error fetching gift cards:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports= getUserGiftCards;