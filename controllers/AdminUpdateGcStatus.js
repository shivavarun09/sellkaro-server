const GiftCard = require("../Model/giftCardModel");

// Admin updates gift card status
const updateGiftCardStatus = async (req, res) => {
  try {
    const { id } = req.params;       // gift card ID from URL
    const { status } = req.body;     // new status from frontend

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

    res.status(200).json({
      message: "Gift card status updated successfully",
      data: giftCard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = updateGiftCardStatus ;
