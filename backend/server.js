require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Enable JSON parsing
app.use(express.json());

// CORS config
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Serve uploaded images with proper CORS and cache headers
// Adjusted path to serve from sibling 'uploads' directory
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    setHeaders: (res, filePath) => {
      const allowedOrigins = [
        "http://localhost:5173", // for local dev
        "https://resumebuilder-mern.onrender.com", // your deployed frontend
      ];
      const origin = res.req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "GET");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Cache-Control", "public, max-age=86400"); // cache for 1 day
      }
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Serve React frontend build (must come after uploading static)
app.use(express.static(path.join(__dirname, "client/build")));

// Fallback to React Router support using splat
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Resource not found" });
});

// Global error handler
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({ message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
