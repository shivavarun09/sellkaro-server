const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  addOrUpdateBankAccount,
  getBankAccount,
} = require("../controllers/addOrUpdateBankAccount");

// Add or update bank account (only logged in users)
router.post("/addaccount", protect, addOrUpdateBankAccount);

// Get logged-in user's bank account
router.get("/myaccount", protect, getBankAccount);

module.exports = router;
