const GiftCard = require("../Model/giftCardModel");

const getGiftCardsByStatus = async (req, res) => {
  try {
    // Step 1: Extract gcstatus from query params
    const { gcstatus } = req.query;

    // Step 2: Validate gcstatus value
    const validStatuses = ["Under Review", "Rejected", "Payout Released"];
    if (!gcstatus || !validStatuses.includes(gcstatus)) {
      return res.status(400).json({ message: "Invalid or missing gcstatus" });
    }

    // Step 3: Fetch all giftcards with given status
    const giftcards = await GiftCard.find({ gcstatus }).select("-createdAt -updatedAt __v");

    if (giftcards.length === 0) {
      return res.status(404).json({ message: "No giftcards found" });
    }

    // Step 4: Send response
    res.status(200).json({
      message: "Giftcards fetched successfully",
      data: giftcards,
    });
  } catch (error) {
    console.error("Error fetching giftcards:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getGiftCardsByStatus;
