const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");
const bookingRoutes = require("./routes/bookings");
const reviewRoutes = require("./routes/reviews");
const dbUpdateRoutes = require("./routes/db-update");

// Initialize express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    cookie: {
      httpOnly: true,
      secure: false, // Set to true only in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "lax",
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/db-update", dbUpdateRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Hotel Booking API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
