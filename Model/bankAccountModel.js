const mongoose = require("mongoose");

const bankAccountModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    ifscCode: {
      type: String,
      required: true,
      uppercase: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // later you can add manual/auto verification
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BankAccount", bankAccountModel);
