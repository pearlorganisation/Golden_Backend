import express from "express";
import {
  authenticateToken,
  checkAdmin,
} from "../middlewares/AuthMiddleware.js";
import { getAllUsers } from "../controllers/authController.js";
import { adminLogin, logoutAdmin } from "../controllers/adminController.js";

const router = express.Router();

router.route("/login").post(adminLogin);
router.route("/logout").post(logoutAdmin);
router.route("/get-all-users").get(authenticateToken, checkAdmin, getAllUsers);

export default router;
