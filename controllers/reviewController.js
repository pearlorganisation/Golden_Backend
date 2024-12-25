import Review from "../models/reviews.js";
import ApiErrorResponse from "../utils/ApiErrorResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validateMongodbID from "../utils/validateMongodbId.js";

export const createReview = asyncHandler(async (req, res, next) => {
  const reviewInfo = await Review.create(req.body);
  if (!reviewInfo) {
    return next(new ApiErrorResponse("Review creation failed", 400));
  }
  return res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: reviewInfo,
  });
});

export const getReviewById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  console.log(id, "get single id");

  validateMongodbID(id);

  const review = await Review.findById(id);

  if (!review) {
    return next(
      new ApiErrorResponse("Review not found or already deleted", 404)
    );
  }

  return res.status(200).json({
    success: true,
    message: "Review fetched successfully",
    data: review,
  });
});

export const getAllReviews = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page ? req.query.page.toString() : "1");
  const limit = parseInt(req.query.limit ? req.query.limit.toString() : "10");
  const skip = (page - 1) * limit;

  const totalReviews = await Review.countDocuments();
  const reviews = await Review.find().skip(skip).limit(limit);

  if (!reviews || reviews.length === 0) {
    return next(new ApiErrorResponse("No reviews found", 404));
  }

  const totalPages = Math.ceil(totalReviews / limit);

  let pagesArray = [];

  pagesArray.push(1);

  if (totalPages > 3) {
    if (page > 2) {
      pagesArray.push(page - 1);
    }

    pagesArray.push(page);

    if (page < totalPages - 1) {
      pagesArray.push(page + 1);
    }

    if (!pagesArray.includes(totalPages)) {
      pagesArray.push(totalPages);
    }
  } else {
    for (let i = 2; i <= totalPages; i++) {
      pagesArray.push(i);
    }
  }

  pagesArray = [...new Set(pagesArray)].sort((a, b) => a - b);
  return res.status(200).json({
    success: true,
    message: "Reviews retrieved successfully",
    pagination: {
      count: totalReviews,
      current_page: page,
      limit,
      next: page < totalPages ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
      pages: pagesArray,
    },
    data: reviews,
  });
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  console.log(id, "delete id");

  validateMongodbID(id);

  const review = await Review.findByIdAndDelete(id);

  if (!review) {
    return next(
      new ApiErrorResponse("Review not found or already deleted", 404)
    );
  }

  return res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

export const updateReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  console.log(id, "update id");

  validateMongodbID(id);

  const review = await Review.findByIdAndUpdate(id, req.body, { new: true });

  if (!review) {
    return next(
      new ApiErrorResponse("Review not found or already deleted", 404)
    );
  }

  return res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: review,
  });
});
