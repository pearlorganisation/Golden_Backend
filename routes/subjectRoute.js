import express from "express";
import {
  createSubject,
  deleteSubject,
  getAllSubject,
  getSubjectById,
  updateSubject,
} from "../controllers/subjectController.js";
import fileParser from "../middlewares/fileParser.js";

const router = express.Router();

router.route("/").get(getAllSubject).post(fileParser, createSubject);
router
  .route("/:id")
  .delete(deleteSubject)
  .get(getSubjectById)
  .patch(updateSubject);

export default router;
