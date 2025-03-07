import User from "../models/user/user.js";
import dotenv from "dotenv";

import { asyncHandler } from "../utils/asyncHandler.js";
import { sendUserVerificationEmail } from "../utils/mail/sendMail.js";
import jwt from "jsonwebtoken";

dotenv.config();

/**--------------------------------signup----------------------------------- */
export const Register = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "user already exists" });
  }
  //
  const user = new User({
    name,
    email,
    phoneNumber,
    password,
  });
  await user.save();

  const verificationToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET, // You need to set JWT_SECRET in your environment variables
    { expiresIn: "24h" } // Token expires in 1 hour
  );
  console.log("verification token", verificationToken);

  // Create a verification link containing the token
  const verificationLink = `${process.env.PROD_FRONTEND_URL}/v1/auth/verify/${verificationToken}`;

  // Email content

  // Send the verification email
  await sendUserVerificationEmail(
    email,
    "Email Verification",
    verificationLink
  );

  // Respond to the client
  res.status(201).json({
    message: "User registered successfully. Please verify your email.",
    user: {
      id: user._id,
      name: user.name,
      phone: user.phoneNumber,
      email: user.email,
    },
  });
});

export const verify = asyncHandler(async (req, res) => {
  const { token } = req.params;
  console.log("toekn", token);

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token using JWT_SECRET

  // Find the user by the userId in the token
  const user = await User.findOne({ _id: decoded.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Check if the user is already verified
  if (user.isVerified) {
    return res.status(400).json({ message: "User already verified." });
  }

  // Mark the user as verified
  user.isVerified = true;
  await user.save();

  res.status(200).json({ message: "Account successfully verified." });

  res.redirect(`${process.env.PROD_FRONTEND_URL}` / login);
});

/**------------------------------------------------------------login------------------------------------------------------------*/
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await User.findOne({ email });
  console.log("user data is---------------", user);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      message: "Account is not verified ,please verified your account ",
    });
  }
  const isValidPassword = await user.matchPassword(password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid credentials" }); // 401 for unauthorized
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "3h",
    }
  );
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: (process.env.NODE_ENV = "production"),
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  const userData = {
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isVerified: user.isVerified,
  };
  res.status(200).json({ message: "Login successfull", data: userData });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  console.log("Cookies received:", req.cookies);

  const token =
    req.cookies?.authToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  console.log("Extracted Token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token is required!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      message: "User profile fetched successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ message: "Invalid or expired token!" });
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const allUsers = await User.find();

    if (allUsers.length == 0) {
      return res.status(404).json({ message: "No Users Found" });
    }

    return res
      .status(200)
      .json({ message: "All Users found for Admin", data: allUsers });
  } catch (error) {
    console.log(error, "My Error");
  }
});
