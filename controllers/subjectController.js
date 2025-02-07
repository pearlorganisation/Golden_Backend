import Subject from "../models/subject.js";
import ApiErrorResponse from "../utils/ApiErrorResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileToCloudinary } from "../utils/cloudinaryConfig.js";
import validateMongodbID from "../utils/validateMongodbId.js";

export const createSubject = asyncHandler(async (req, res, next) => {
  const { banner, pdf } = req.files;

  const uploadedImages = banner ? await uploadFileToCloudinary(banner) : [];

  const uploadedPDF = pdf ? await uploadFileToCloudinary(pdf) : {};

  const subjectInfo = await Subject.create({
    ...req?.body,
    banner: uploadedImages,
    pdf: uploadedPDF[0],
  });
  if (!subjectInfo) {
    return next(new ApiErrorResponse("Subject creation failed", 400));
  }
  return res.status(201).json({
    success: true,
    message: "Subject created successfully",
    data: subjectInfo,
  });
});

export const searchSubjects = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new ApiErrorResponse("Search query is required", 400));
  }

  const notes = await Subject.find({
    name: { $regex: query, $options: "i" },
  });

  if (!notes.length) {
    return next(new ApiErrorResponse("No matching Subject found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Subjects found successfully",
    data: notes,
  });
});

export const getSubjectById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  console.log(id, "get single id");

  validateMongodbID(id);

  const subject = await Subject.findById(id);

  if (!subject) {
    return next(
      new ApiErrorResponse("Subject not found or already deleted", 404)
    );
  }

  return res.status(200).json({
    success: true,
    message: "Subject fetched successfully",
    data: subject,
  });
});

export const getAllSubject = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page ? req.query.page.toString() : "1");
  const limit = parseInt(req.query.limit ? req.query.limit.toString() : "");
  const skip = (page - 1) * limit;

  const totalSubject = await Subject.countDocuments();
  const subjects = await Subject.find().skip(skip).limit(limit);

  if (!subjects || subjects.length === 0) {
    return next(new ApiErrorResponse("No subjects found", 404));
  }

  const totalPages = Math.ceil(totalSubject / limit);

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
    message: "Subjects retrieved successfully",
    pagination: {
      count: totalSubject,
      current_page: page,
      limit,
      next: page < totalPages ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
      pages: pagesArray,
    },
    data: subjects,
  });
});

export const deleteSubject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  console.log(id, "delete id");

  validateMongodbID(id);

  const subject = await Subject.findByIdAndDelete(id);

  if (!subject) {
    return next(
      new ApiErrorResponse("Subject not found or already deleted", 404)
    );
  }

  return res.status(200).json({
    success: true,
    message: "Subject deleted successfully",
  });
});

export const updateSubject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  validateMongodbID(id);
  let updatedData = { ...req.body };

  if (req.files?.pdf) {
    const uploadedPDF = await uploadFileToCloudinary(req.files.pdf);
    updatedData.pdf = uploadedPDF[0];
  }

  // Handle new Banner upload if present
  if (req.files?.banner) {
    const uploadedImages = await uploadFileToCloudinary(req.files.banner);
    updatedData.banner = uploadedImages;
  }

  const subject = await Subject.findByIdAndUpdate(id, updatedData, {
    new: true,
  });

  if (!subject) {
    return next(
      new ApiErrorResponse("Subject not found or already deleted", 404)
    );
  }

  return res.status(200).json({
    success: true,
    message: "Subject updated successfully",
    data: subject,
  });
});
