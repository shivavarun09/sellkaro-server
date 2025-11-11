const Razorpay = require("razorpay");
// initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Controller: Create Razorpay Order
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: "sellkaro_receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);

  } catch (error) {
    console.error("Razorpay createOrder error:", error);
    return res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};
module.exports=createOrder