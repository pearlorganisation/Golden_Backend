

import express, { Router } from "express"
import { createOrder, getPurchaseByUser, verifyPayment } from "../controllers/order/orderController.js"

const orderRouter= express.Router()

orderRouter.route("/create").post(createOrder)
orderRouter.route("/verify").post(verifyPayment)
orderRouter.route("/purchase").get(getPurchaseByUser)

/** route for buying all the pdfs */

export default orderRouter;