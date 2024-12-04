import express from "express";
import {
  createFaculty,
  deleteFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
} from "../controllers/facultyController.js";

const router = express.Router();

router.route("/").get(getAllFaculty).post(createFaculty);
router
  .route("/:id")
  .delete(deleteFaculty)
  .get(getFacultyById)
  .patch(updateFaculty);

export default router;
