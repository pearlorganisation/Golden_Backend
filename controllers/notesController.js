import Notes from "../models/notes.js";
import ApiErrorResponse from "../utils/ApiErrorResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validateMongodbID from "../utils/validateMongodbId.js";

export const createNotes = asyncHandler(async (req, res, next) => {
  const notesInfo = await Notes.create(req.body);
  if (!notesInfo) {
    return next(new ApiErrorResponse("Notes creation failed", 400));
  }
  return res.status(201).json({
    success: true,
    message: "Notes created successfully",
    data: notesInfo,
  });
});

export const getNotesById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  console.log(id, "get single id");

  validateMongodbID(id);

  const notes = await Notes.findById(id)
    .populate({
      path: "subject",
      select: "name banner pdf -_id price discountedPrice pages description",
    })
    .populate({ path: "faculty", select: "name institute -_id" });

  if (!notes) {
    return next(
      new ApiErrorResponse("Notes not found or already deleted", 404)
    );
  }

  return res.status(200).json({
    success: true,
    message: "notes fetched successfully",
    data: notes,
  });
});

export const searchNotes = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new ApiErrorResponse("Search query is required", 400));
  }

  const notes = await Notes.find({
    name: { $regex: query, $options: "i" }, // Case-insensitive regex search
  })
    .populate({
      path: "subject",
      select: "name banner -_id pdf price discountedPrice pages description",
    })
    .populate({ path: "faculty", select: "name institute -_id" });

  if (!notes.length) {
    return next(new ApiErrorResponse("No matching Subject found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Notes fetched successfully",
    data: notes,
  });
});

export const getAllNotes = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page ? req.query.page.toString() : "1");
  const limit = parseInt(req.query.limit ? req.query.limit.toString() : "20");
  const skip = (page - 1) * limit;

  const totalNotes = await Notes.countDocuments();
  const notes = await Notes.find()
    .skip(skip)
    .limit(limit)
    .populate({
      path: "subject",
      select: "name banner pdf -_id price discountedPrice pages description",
    })
    .populate({ path: "faculty", select: "name institute -_id" });

  if (!notes || notes.length === 0) {
    return next(new ApiErrorResponse("No notes found", 404));
  }

  const totalPages = Math.ceil(totalNotes / limit);

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
    message: "Notes retrieved successfully",
    pagination: {
      count: totalNotes,
      current_page: page,
      limit,
      next: page < totalPages ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
      pages: pagesArray,
    },
    data: notes,
  });
});

export const deleteNotes = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  console.log(id, "delete id");

  validateMongodbID(id);

  const note = await Notes.findByIdAndDelete(id);

  if (!note) {
    return next(new ApiErrorResponse("Note not found or already deleted", 404));
  }

  return res.status(200).json({
    success: true,
    message: "note deleted successfully",
  });
});

export const updateNotes = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  console.log(id, "update id");

  validateMongodbID(id);

  const note = await Notes.findByIdAndUpdate(id, data, { new: true });

  if (!note) {
    return next(new ApiErrorResponse("note not found or already deleted", 404));
  }

  return res.status(200).json({
    success: true,
    message: "note updated successfully",
    data: note,
  });
});
