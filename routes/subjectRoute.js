import express from "express";
import {
  createSubject,
  deleteSubject,
  getAllSubject,
  getSubjectById,
  searchSubjects,
  updateSubject,
} from "../controllers/subjectController.js";
import fileParser from "../middlewares/fileParser.js";

const router = express.Router();

router.route("/").get(getAllSubject).post(fileParser, createSubject);
router.route("/search").get(searchSubjects);
router
  .route("/:id")
  .delete(deleteSubject)
  .get(getSubjectById)
  .patch(fileParser, updateSubject);

export default router;
