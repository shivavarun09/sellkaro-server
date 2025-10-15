// controllers/giftCardController.js
// const GiftCard = require('../Model/giftCardModel');

// @desc    Get all gift cards
// @route   GET /api/giftcards
// @access  Public (or Private depending on your auth)
// const getAllGiftCards = async (req, res) => {
//   try {
//     const giftCards = await GiftCard.find(); // fetch all gift cards
//     res.status(200).json({
//       success: true,
//       count: giftCards.length,
//       data: giftCards
//     });
//   } catch (error) {
//     console.error('Error fetching gift cards:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server Error'
//     });
//   }
// };

// module.exports = getAllGiftCards;



// controllers/giftCardController.js
// const GiftCard = require('../Model/giftCardModel');

// @desc    Get all gift cards with pagination
// @route   GET /api/giftcards
// @access  Private (or Public depending on auth)
// const getAllGiftCards = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;    // current page
//     const limit = parseInt(req.query.limit) || 6; // items per page
//     const skip = (page - 1) * limit;
//     const gcstatus = req.query.gcstatus;
//     let query ={};
//     if(gcstatus){
//       query.gcstatus = gcstatus;
//     }
//     const total = await GiftCard.countDocuments({query}||{});
//     const giftCards = await GiftCard.find({query})
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 }); // latest first

//     res.status(200).json({
//       success: true,
//       count: giftCards.length,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//       data: giftCards,
//     });
//   } catch (error) {
//     console.error('Error fetching gift cards:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//     });
//   }
// };

// module.exports = getAllGiftCards;

const GiftCard = require('../Model/giftCardModel');

// @desc    Get all gift cards with optional gcstatus filter and pagination
// @route   GET /api/giftcards
// @access  Private (or Public depending on auth)
const getAllGiftCards = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;    // current page
    const limit = parseInt(req.query.limit) || 6;  // items per page
    const skip = (page - 1) * limit;
    const { gcstatus } = req.query;

    // ✅ Build query properly
    const query = {};
    if (gcstatus && gcstatus !== "All") {
      query.gcstatus = gcstatus;
    }

    // ✅ Use query directly (not wrapped inside { query })
    const total = await GiftCard.countDocuments(query);
    const giftCards = await GiftCard.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      count: giftCards.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: giftCards,
    });
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

module.exports = getAllGiftCards;


