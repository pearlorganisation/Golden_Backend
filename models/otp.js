import axios from "axios";

import { FAST2SMS_API_KEY, BASE_URL } from "../config/fast2smsConfig.js";

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
};

const sendOtp = async (phone, otp) => {
  try {
    const params = {
      authorization: FAST2SMS_API_KEY,
      route: "otp",
      variables_values: otp,
      flash: 0,
      numbers: phone,
    };

    // Send request to Fast2SMS
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.log(error, "Why OTP Sending is Failed Error");

    console.log(error.response.data.message, "error response message");
    throw new Error("Failed to send OTP");
  }
};

export { sendOtp, generateOtp };
