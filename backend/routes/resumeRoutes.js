const express = require("express");

const {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");
const { protect } = require("../middlewares/authMiddleware");
const { uploadResumeImage } = require("../controllers/uploadImages");

const router = express.Router();
router.post("/", protect, createResume); //Create Resume
router.get("/", protect, getUserResumes); //get Resume
router.get("/:id", protect, getResumeById); //get Resume by id
router.put("/:id", protect, updateResume); //Update Resume
router.put("/:id/upload-images", protect, uploadResumeImage);

router.delete("/:id", protect, deleteResume); //delete resume

module.exports = router;
