const express = require("express");
const router = express.Router();
// const protect  = require("../middleware/auth"); // destructure properly

const adminGetAllGC = require("../controllers/AdminGetAllGC");
const getUserBankAccountByAdmin = require("../controllers/AdminGetUserBankdetails");
const updateGiftCardStatus = require("../controllers/AdminUpdateGcStatus");
const protect = require("../middleware/auth");
const getGiftCardsByStatus = require("../controllers/AdminFilterGiftcards")
// Only authenticated users can access
router.get("/allgc",protect, adminGetAllGC);
router.get("/bankaccount/:userId",protect,getUserBankAccountByAdmin);

//Fiter gc by gc Status
router.get("/filter",protect, getGiftCardsByStatus); // GET /giftcards/filter?gcstatus=Under%20Review
// PUT request to update gift card status
router.put("/giftcards/:id/status",protect, updateGiftCardStatus);
module.exports = router;
