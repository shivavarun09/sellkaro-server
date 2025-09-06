const express = require("express");
const router = express.Router();
const registerUser = require("../controllers/registerUserController");
const loginUser = require("../controllers/loginUserController")
// Register Route
router.post("/register", registerUser);

//Login Route
router.post("/login",loginUser)
module.exports = router;
