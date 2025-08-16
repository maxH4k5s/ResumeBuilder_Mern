const mongoose = require("mongoose");
const Resume = require("./models/Resume");


const MONGO_URI = "";

async function fixImageUrls() {
  await mongoose.connect(MONGO_URI);
  const resumes = await Resume.find({
    $or: [
      { thumbnailLink: { $regex: "localhost:8000" } },
      { "profileInfo.profilePreviewUrl": { $regex: "localhost:8000" } },
    ],
  });

  for (let resume of resumes) {
    if (resume.thumbnailLink?.includes("localhost:8000")) {
      resume.thumbnailLink = resume.thumbnailLink.replace(
        "localhost:8000",
        "resumebuilder-mern-backend.onrender.com"
      );
    }
    if (resume.profileInfo?.profilePreviewUrl?.includes("localhost:8000")) {
      resume.profileInfo.profilePreviewUrl =
        resume.profileInfo.profilePreviewUrl.replace(
          "localhost:8000",
          "resumebuilder-mern-backend.onrender.com"
        );
    }
    await resume.save();
  }

  console.log(`✅ Updated ${resumes.length} resumes`);
  mongoose.disconnect();
}

fixImageUrls();
