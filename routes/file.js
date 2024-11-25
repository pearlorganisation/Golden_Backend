import express from "express";
import multer from "multer";
import fileController from "../controllers/fileController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), fileController.uploadFile);

router.get("/download", fileController.downloadFile);

export default router;
