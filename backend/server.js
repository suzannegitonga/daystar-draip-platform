const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Custom MongoDB injection sanitizer middleware
function sanitizeMongo(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeMongo);
  }
  if (obj !== null && typeof obj === "object") {
    const sanitized = {};
    for (const key of Object.keys(obj)) {
      if (!key.startsWith("$")) {
        sanitized[key] = sanitizeMongo(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
}

app.use((req, res, next) => {
  if (req.body) req.body = sanitizeMongo(req.body);
  if (req.query) req.query = sanitizeMongo(req.query);
  next();
});

// Rate limiting: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: "error",
    message: "Too many requests, please try again later.",
  },
});
app.use("/api/", limiter);

// Stricter rate limit for auth endpoints to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    status: "error",
    message: "Too many auth attempts, please try again after 15 minutes.",
  },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/reset-password", authLimiter);

// Routes
const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
