const Resume = require("../models/Resume");
const upload = require("../middlewares/uploadMiddleware");

const uploadResumeImage = async (req, res) => {
  try {
    upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])(
      req,
      res,
      async (err) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "File upload failed", error: err.message });
        }

        const resumeId = req.params.id;
        const resume = await Resume.findOne({
          _id: resumeId,
          userId: req.user._id,
        });

        if (!resume) {
          return res
            .status(404)
            .json({ message: "Resume not found or unauthorized" });
        }

        const newThumbnail = req.files.thumbnail?.[0];
        const newProfileImage = req.files.profileImage?.[0];

        // Update thumbnail if uploaded
        if (newThumbnail) {
          resume.thumbnailLink = newThumbnail.path; // Cloudinary URL
        }

        // Update profile image if uploaded
        if (newProfileImage) {
          resume.profileInfo.profilePreviewUrl = newProfileImage.path; // Cloudinary URL
        }

        await resume.save();
        res.status(200).json({
          message: "Image uploaded successfully",
          thumbnailLink: resume.thumbnailLink,
          profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
        });
      }
    );
  } catch (error) {
    console.log("Error uploading images:", error);
    res
      .status(500)
      .json({ message: "Failed to upload images", error: error.message });
  }
};

module.exports = { uploadResumeImage };
