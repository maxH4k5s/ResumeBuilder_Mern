const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  deactivateAccount,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateProfile,
  updatePassword,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message: {
    message:
      "Too many login attempts from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  validate: { trustProxy: false }, // Disable trust proxy validation to prevent ERR_ERL_PERMISSIVE_TRUST_PROXY
});

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", logoutUser);
router.delete("/deactivate", protect, deactivateAccount);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateProfile); // Update name + photo
router.put("/update-password", protect, updatePassword); // Change password

// Image upload route
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = req.file.path; // Cloudinary URL
  res.status(200).json({ imageUrl });
});

module.exports = router;
