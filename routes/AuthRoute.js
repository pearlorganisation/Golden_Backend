import { Router } from "express";
import express from "express"
import { getUserProfile, login, logout, Register, verify } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/AuthMiddleware.js"
const authRouter= express.Router()




authRouter.route('/register').post(Register)
authRouter.route('/login').post(login)
authRouter.route('/verify/:token').get(verify)
authRouter.route("/profile").get(authenticateToken, getUserProfile); // Protected profile route
authRouter.route("/logout").post(logout); // Logout route


export default  authRouter
 