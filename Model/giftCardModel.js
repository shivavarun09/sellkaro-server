const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose) //Package of autoIncremt of orderId
const giftCardSchema = new mongoose.Schema(
  {
    orderId:{
type:Number,
unique:true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User model
      required: true,
    },
    gcbrand: {
      type: String,
      required: true,
    },
    gccode: {
      type: String,
      required: true,
      trim: true,
      unique:true,
    },
    gcpin: {
      type: String,
      required: true,
      trim: true,
    },
    gcvalue: {
      type: Number,
      required: true,
      min: 1,
    },
    gcexpiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);
// Auto-increment orderId
giftCardSchema.plugin(AutoIncrement, {
  inc_field: "orderId", // Field to increment
  start_seq: 1, // Start at 1
  collection_name: "giftcard_counters", // Custom counter collection name
});
module.exports = mongoose.model("GiftCard", giftCardSchema);
