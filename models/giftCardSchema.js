
const mongoose = require("mongoose");

const giftCardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gcName: {
      type: String,
      required: true,
      // enum: ["Amazon", "Flipkart", "Myntra", "MakeMyTrip"],
    },
    cardNumber: {
      type: String,
      required: true, // store encrypted
    },
    pin: {
      type: String, // optional: encrypt this too
    },
    faceValue: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GiftCard", giftCardSchema);
