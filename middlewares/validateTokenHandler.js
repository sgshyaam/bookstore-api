const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const blacklistedTokens = new Set();

// Middleware to validate token
const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    if (blacklistedTokens.has(token)) {
      res.status(403);
      throw new Error("Invalid Token. Retry Logging in!");
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is unauthorized");
      }
      req.user = decoded.user;
      next();
    });
  } else {
    res.status(401);
    throw new Error("User is unauthorized");
  }
});

// Middleware to blacklist a token
const blacklistNewToken = asyncHandler(async (req, res) => {
  let blacklistToken;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    blacklistToken = authHeader.split(" ")[1];
  }
  if (blacklistToken) {
    blacklistedTokens.add(blacklistToken);
    res.status(200).json({ message: "User has been logged out successfully!" });
  } else {
    res.status(400).json({ message: "Token required" });
  }
});

module.exports = { validateToken, blacklistNewToken };
