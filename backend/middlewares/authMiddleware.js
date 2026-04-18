const jwt = require("jsonwebtoken");
const User = require("../models/User");

//middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; //Extract Token
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      if (req.user.isDeactivated) {
        return res.status(403).json({ message: "Your account has been deactivated." });
      }

      next();
    } else {
      res.status(401).json({ message: "Not authorize, no token" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token failed", error: error.message });
  }
};

module.exports = { protect };
