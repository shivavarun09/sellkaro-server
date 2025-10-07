const express = require("express");
const router = express.Router();
// const protect  = require("../middleware/auth"); // destructure properly

const adminGetAllGC = require("../controllers/AdminGetAllGC");
const getUserBankAccountByAdmin = require("../controllers/AdminGetUserBankdetails");
const updateGiftCardStatus = require("../controllers/AdminUpdateGcStatus");
const protect = require("../middleware/auth");
// Only authenticated users can access
router.get("/allgc",protect, adminGetAllGC);
router.get("/bankaccount/:userId",protect,getUserBankAccountByAdmin);

// PUT request to update gift card status
router.put("/giftcards/:id/status", updateGiftCardStatus);
module.exports = router;
