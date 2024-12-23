

import express, { Router } from "express"
import { createOrder, verifyPayment } from "../controllers/order/orderController.js"

const orderRouter= express.Router()

orderRouter.route("/create").post(createOrder)
orderRouter.route("/verify").post(verifyPayment)

export default orderRouter;