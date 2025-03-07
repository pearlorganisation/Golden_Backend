import jwt from "jsonwebtoken";
import User from "../models/user/user.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// Middleware to authenticate token
export const authenticateToken = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

  console.log("Token from cookies:", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token is missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(400).json({ message: "Invalid user ID in token." });
    }

    const user = await User.findById(decoded.userId).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res
        .status(401)
        .json({ message: "User associated with the token not found!" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Token Verification Error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token has expired. Please log in again." });
    }

    res.status(401).json({ message: "Invalid or expired token!" });
  }
});

// Middleware to verify user permissions based on roles
export const verifyPermission = (roles = []) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User is missing!" });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions!" });
    }

    next();
  });

export const checkAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. User is missing!" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only!" });
  }

  next();
});
