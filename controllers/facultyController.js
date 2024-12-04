import Faculty from "../models/faculty.js";
import ApiErrorResponse from "../utils/ApiErrorResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validateMongodbID from "../utils/validateMongodbId.js";

export const createFaculty = asyncHandler(async (req, res, next) => {
  const facultyInfo = await Faculty.create(req.body);
  if (!facultyInfo) {
    return next(new ApiErrorResponse("Faculty creation failed", 400));
  }
  return res.status(201).json({
    success: true,
    message: "Faculty created successfully",
    data: facultyInfo,
  });
});

export const getFacultyById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  console.log(id, "get single id");

  validateMongodbID(id);

  const faculty = await Faculty.findById(id);

  if (!faculty) {
    return next(
      new ApiErrorResponse("Faculty not found or already deleted", 404)
    );
  }

  return res.status(200).json({
    success: true,
    message: "Faculty fetched successfully",
    data: faculty,
  });
});

export const getAllFaculty = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page ? req.query.page.toString() : "1");
  const limit = parseInt(req.query.limit ? req.query.limit.toString() : "5");
  const skip = (page - 1) * limit;

  const totalFaculty = await Faculty.countDocuments();
  const faculties = await Faculty.find().skip(skip).limit(limit);

  if (!faculties || faculties.length === 0) {
    return next(new ApiErrorResponse("No Faculties found", 404));
  }

  const totalPages = Math.ceil(totalFaculty / limit);

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
    message: "Facultys retrieved successfully",
    pagination: {
      count: totalFaculty,
      current_page: page,
      limit,
      next: page < totalPages ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
      pages: pagesArray,
    },
    data: faculties,
  });
});

export const deleteFaculty = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  console.log(id, "delete id");

  validateMongodbID(id);

  const faculty = await Faculty.findByIdAndDelete(id);

  if (!faculty) {
    return next(
      new ApiErrorResponse("Faculty not found or already deleted", 404)
    );
  }

  return res.status(200).json({
    success: true,
    message: "Faculty deleted successfully",
  });
});

export const updateFaculty = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  console.log(id, "update id");

  validateMongodbID(id);

  const faculty = await Faculty.findByIdAndUpdate(id, data, { new: true });

  if (!faculty) {
    return next(
      new ApiErrorResponse("Faculty not found or already deleted", 404)
    );
  }

  return res.status(200).json({
    success: true,
    message: "Faculty updated successfully",
    data: faculty,
  });
});
