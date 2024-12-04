import express from "express";
import {
  createNotes,
  deleteNotes,
  getAllNotes,
  getNotesById,
  updateNotes,
} from "../controllers/notesController.js";

const router = express.Router();

router.route("/").get(getAllNotes).post(createNotes);
router.route("/:id").delete(deleteNotes).get(getNotesById).patch(updateNotes);

export default router;
