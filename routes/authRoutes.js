const express = require("express");
const router = express.Router();
const registerUser = require("../controllers/registerUserController");
const loginUser = require("../controllers/loginUserController");
const forgetPassword = require("../controllers/ForgetPassword")

// Register Route
router.post("/register", registerUser);

//Login Route
router.post("/login",loginUser)

//Forget Password
router.get("/forgetpass",forgetPassword)
module.exports = router;
