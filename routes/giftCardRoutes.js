const express = require("express");
const router = express.Router();

// Controllers
const addGiftCard = require("../controllers/addGiftCardController");
const viewUserGiftCards = require("../controllers/viewUserGiftcards");

// Middleware
const protect = require("../middleware/auth");

// Routes
router.post('/sell', protect, addGiftCard);
router.get('/my', protect, viewUserGiftCards); // GET  /api/giftcards/my

module.exports = router;
