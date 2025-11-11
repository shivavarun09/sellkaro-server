// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

const compression = require("compression");
const express = require("express");
const cors = require("cors");

const connectToDb = require("./config/dataBaseConn"); 
const authRoute = require("./routes/authRoutes");
const giftCardRoutes = require("./routes/giftCardRoutes");
const bankAccountRoutes = require("./routes/bankAccountRoutes");
const userRoutes = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoutes");
const razorpayPaymentsRoutes = require("./routes/razorpayPaymentRoutes")

const app = express();

// ✅ Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// ✅ CORS setup
const whitelist = [
  "http://localhost:5173",
  "https://app-smtp.brevo.com",
  "https://sellkaro.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or backend-to-backend calls)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// ✅ Optional: Handle CORS errors gracefully
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS error: Origin not allowed" });
  }
  next(err);
});

// ✅ Routes
app.get("/", (req, res) => {
  res.send("✅ GET request working successfully");
});

app.get("/api/users", (req, res) => {
  res.status(200).json({ message: "Users route working!" });
});

app.use("/auth", authRoute);
app.use("/giftcards", giftCardRoutes);
app.use("/bankaccount", bankAccountRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/admin/payment",razorpayPaymentsRoutes)


// ✅ Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectToDb(); // connect to DB first
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};


// 
startServer();
