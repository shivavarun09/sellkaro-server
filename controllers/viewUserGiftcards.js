// const GiftCard = require('../Model/giftCardModel');

// Get logged-in user's gift cards
// const getUserGiftCards = async (req, res) => {
//   try {
//     const giftCards = await GiftCard.find({ user: req.user._id });
//     res.json({ data: giftCards });
//   } catch (error) {
//     console.error("Error fetching gift cards:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports= getUserGiftCards


const GiftCard = require('../Model/giftCardModel');

// @desc    Get logged-in user's gift cards with pagination
// @route   GET /api/giftcards/mycards?page=1&limit=10
// @access  Private
const getUserGiftCards = async (req, res) => {
  try {
    const userId = req.user._id;

    // Read pagination query params
    const page = parseInt(req.query.page) || 1;       // default page 1
    const limit = parseInt(req.query.limit) || 6;    // default 10 items per page
    const skip = (page - 1) * limit;

    // Count total documents for this user
    const totalDocs = await GiftCard.countDocuments({ user: userId });

    // Fetch paginated gift cards
    const giftCards = await GiftCard.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // optional: latest first

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalDocs / limit),
      totalDocs,
      count: giftCards.length,
      data: giftCards,
    });
  } catch (error) {
    console.error("Error fetching gift cards:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getUserGiftCards;
