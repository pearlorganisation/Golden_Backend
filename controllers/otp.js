import { sendOtp, generateOtp } from "../models/otp.js";

const sendOtpController = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required." });
    }

    const otp = generateOtp();

    console.log("Send OTP Controller called");

    const data = await sendOtp(phone, otp);

    res.status(200).json({ message: "OTP sent successfully", data });
  } catch (error) {
    console.error("Error in sendOtpController:", error);
    res.status(500).json({ error: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required." });
    }

    const otp = generateOtp();

    const data = await sendOtp(phone, otp);

    res
      .status(200)
      .json({ message: "Login OTP sent successfully", phone, otp, data });
  } catch (error) {
    console.error("Error in login Controller:", error);
    res.status(500).json({ error: "Something went wrong. Server error" });
  }
};

export { sendOtpController, loginController };
