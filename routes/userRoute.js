// routes/userRoutes.js
const express = require("express");
const User = require("../Model/userModel");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/users/me
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name email");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
