import express from "express";
import multer from "multer";
import { uploadFile, downloadFile } from "../controllers/fileController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadFile);

router.get("/download", downloadFile);

export default router;
