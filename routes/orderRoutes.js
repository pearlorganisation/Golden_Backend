import express, { Router } from "express";
import {
  createOrder,
  getAllPurchases,
  getPurchaseByUser,
  verifyPayment,
} from "../controllers/order/orderController.js";

const orderRouter = express.Router();

orderRouter.route("/create").post(createOrder);
orderRouter.route("/verify").post(verifyPayment);
orderRouter.route("/purchase").get(getPurchaseByUser);
orderRouter.route("/all-orders").get(getAllPurchases);

/** route for buying all the pdfs */

export default orderRouter;
