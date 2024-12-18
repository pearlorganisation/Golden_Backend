

import express, { Router } from "express"
import { createOrder } from "../controllers/order/orderController.js"

const orderRouter= express.Router()

orderRouter.route("/create").post(createOrder)

export default orderRouter;