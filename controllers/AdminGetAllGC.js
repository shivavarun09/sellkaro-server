// controllers/giftCardController.js
const GiftCard = require('../Model/giftCardModel');

// @desc    Get all gift cards
// @route   GET /api/giftcards
// @access  Public (or Private depending on your auth)
const getAllGiftCards = async (req, res) => {
  try {
    const giftCards = await GiftCard.find(); // fetch all gift cards
    res.status(200).json({
      success: true,
      count: giftCards.length,
      data: giftCards
    });
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = getAllGiftCards;
