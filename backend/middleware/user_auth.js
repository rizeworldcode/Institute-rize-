require("dotenv").config();
const jwt = require("jsonwebtoken");
const user_model = require("../src/models/adminmodel");

// Middleware for handling auth
async function user_auth(req, res, next) {
  try {
    const tokenHead = req.headers["authorization"] || req.headers["Authorization"];
    if (!tokenHead) {
      return res.status(401).json({ message: "User is not logged in", success: false });
    }

    const parts = tokenHead.split(" ");
    const token = parts.length === 2 ? parts[1] : parts[0];
    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ message: "User is not logged in", success: false });
    }

    const jwtPassword = process.env.SECRET_KEY;
    const decode = jwt.verify(token, jwtPassword);
    let user = await user_model
      .findOne({ _id: decode.id })
      .select("-password -notificationToken")
      .exec();
    if (!user) return res.status(403).json({ msg: "User not found", success: false });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
}

module.exports = user_auth;