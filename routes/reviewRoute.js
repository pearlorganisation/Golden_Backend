import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewById,
  updateReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.route("/").get(getAllReviews).post(createReview);
router
  .route("/:id")
  .delete(deleteReview)
  .get(getReviewById)
  .patch(updateReview);

export default router;
