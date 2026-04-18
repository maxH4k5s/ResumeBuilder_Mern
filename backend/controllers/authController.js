const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
  const isProd = process.env.NODE_ENV === "production";
  
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProd, // Must be true for SameSite=None
    sameSite: isProd ? "none" : "strict", // Cross-site required in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Basic email validator
const validateEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(String(email).toLowerCase());
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    if (!email || !validateEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address." });
    }

    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    // Password complexity check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      verificationToken,
    });

    // Send verification email
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const verificationUrl = `${clientUrl}/verify-email/${verificationToken}`;
    
    try {
      await sendEmail({
        to: user.email,
        subject: "Verify Your Email - Resume Builder",
        html: `
          <h3>Welcome to Resume Builder!</h3>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}" target="_blank">Verify Email</a>
          <p>If you did not request this, please ignore this email.</p>
        `,
      });
    } catch (emailError) {
      console.error("Verification email failed:", emailError);
      // We still return success but maybe user will have to request a new link later
    }

    // Return user data with jwt (user can login but needs to verify)
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation for login
    if (!email || !validateEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address." });
    }

    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.isDeactivated) {
      return res.status(403).json({ message: "Your account has been deactivated. Please contact support to reactivate it." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email address before logging in." });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Return User data with jwt
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Logout user
// @route POST /api/auth/logout
// @access Public
const logoutUser = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "strict",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc Deactivate user account
// @route DELETE /api/auth/deactivate
// @access Private
const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.isDeactivated = true;
    await user.save();

    // Clear the cookie to log the user out immediately
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "strict",
      expires: new Date(0),
    });

    res.json({ message: "Account successfully deactivated." });
  } catch (error) {
    res.status(500).json({ message: "Failed to deactivate account", error: error.message });
  }
};

// @desc Verify User Email
// @route GET /api/auth/verify-email/:token
// @access Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token." });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email successfully verified. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Forgot Password
// @route POST /api/auth/forgot-password
// @access Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No account with that email address exists." });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request - Resume Builder",
        html: `
          <h3>Password Reset Request</h3>
          <p>You requested a password reset. Click the link below to set a new password:</p>
          <a href="${resetUrl}" target="_blank">Reset Password</a>
          <p>This link is valid for 1 hour.</p>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `,
      });
      res.status(200).json({ message: "Password reset email sent." });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.error("Reset email failed:", emailError);
      return res.status(500).json({ message: "Email could not be sent." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Reset Password
// @route POST /api/auth/reset-password/:token
// @access Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Clear reset tokens
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been successfully reset. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get user profile
// @route POST /api/auth/profile
// @access Private (Requires JWT)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update user profile (name, profileImageUrl)
// @route PUT /api/auth/profile
// @access Private
const updateProfile = async (req, res) => {
  try {
    const { name, profileImageUrl } = req.body;

    console.log("[updateProfile] Received body:", { name, profileImageUrl });

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required." });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim(), profileImageUrl: profileImageUrl || null },
      { new: true },
    );

    console.log("[updateProfile] Saved to DB:", {
      name: user.name,
      profileImageUrl: user.profileImageUrl,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
    });
  } catch (error) {
    console.error("[updateProfile] Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update user password
// @route PUT /api/auth/update-password
// @access Private
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new password are required." });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
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
};
