import express from "express";

import { sendOtpController, loginController } from "../controllers/otp.js";

const router = express.Router();

router.get("/send", sendOtpController);
router.post("/login", loginController);

export default router;
