import express from "express"
import { sendPdfByAdmin } from "../controllers/sendPdfController.js"

const router = express.Router()

router.route("/").post(sendPdfByAdmin)

export default router