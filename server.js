
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();
// console.log(process.env.MONGO_URI)
const compression = require("compression")
const express = require("express");
const cors = require("cors");
// Initialize app
const app = express();

// Enable gzip compression
app.use(compression());

var whitelist = ['http://localhost:5173', 'https://app-smtp.brevo.com','https://sellkaro.vercel.app']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
//Enabling cors
app.use(cors(corsOptions));


// Middlewareggggggggggggggggggggggg
app.use(express.json());

// (Optional) for form-urlencoded data
app.use(express.urlencoded({ extended: true }));

const connectToDb = require("./config/dataBaseConn"); 
const authRoute = require("./routes/authRoutes");
const giftCardRoutes = require("./routes/giftCardRoutes");
const bankAccountRoutes= require("./routes/bankAccountRoutes");
const userRoutesme = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoutes")




// Test route
app.get("/", (req, res) => {
  res.send("✅ GET request working successfully");
});

app.get("/api/users", (req, res) => {
  res.status(404).json({ message: "Users route working!" });
});

//Register AND Login Route 
app.use("/auth",authRoute)

//List and get giftCards

// Routes
app.use("/giftcards", giftCardRoutes);

//Bank account

app.use("/bankaccount", bankAccountRoutes);

//Admin functionalitys
//  /admin/allgc
app.use("/admin",adminRoutes)

// User routes (protected)
app.use("/users", userRoutesme);


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectToDb(); // connect to DB first
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // stop app if DB fails
  }
};


startServer();


