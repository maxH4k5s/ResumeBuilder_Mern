require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

// Middleware to handle cors
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect DataBase
connectDB();

// Middleware
app.use(express.json());

// Other routes above
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Serve uploaded images
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      const allowedOrigins = [
        "http://localhost:5173", // local dev
        "https://resumebuilder-mern.onrender.com", // production frontend
      ];
      const origin = res.req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }
    },
  })
);

res.setHeader("Cache-Control", "public, max-age=86400"); // 1 day
// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Resource not found" });
});
// Handle errors
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({ message });
});

// Serve frontend build
app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
