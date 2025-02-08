import express from "express";
import User from "../models/user/user.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "Admin not found." });
  }

  if (!user.isVerified) {
    return res.status(403).json({ message: "Admin account is not verified." });
  }

  if (user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Only admins can log in." });
  }

  const isValidPassword = await user.matchPassword(password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "3h" }
  );

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3 * 60 * 60 * 1000, // 3 hours
  });

  res.status(200).json({
    message: "Admin login successful",
    adminData: { name: user.name, email: user.email, role: user.role },
  });
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Admin logged out successfully." });
});
