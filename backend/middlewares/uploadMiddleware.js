const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "resume-builder", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed formats
  },
});

const upload = multer({ storage });

module.exports = upload;
