import React, { useRef, useState } from "react";
import { LuTrash2, LuUpload, LuUser } from "react-icons/lu";
import axiosInstance from "../../pages/utils/axiosInstance";
import { API_PATHS } from "../../pages/utils/apiPaths";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false); // State for upload progress

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Store the file locally
      setPreview(URL.createObjectURL(file)); // Generate a local preview

      // Upload the image to the backend or Cloudinary
      try {
        setUploading(true); // Start uploading
        const formData = new FormData();
        formData.append("image", file);

        const response = await axiosInstance.post(
          API_PATHS.IMAGE.UPLOAD_IMAGE,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Use the hosted URL from the response
        const uploadedImageUrl = response.data.url;
        setPreview(uploadedImageUrl); // Update the preview with the hosted URL
        setUploading(false); // Stop uploading
      } catch (error) {
        console.error("Image upload failed:", error);
        setUploading(false); // Stop uploading
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = ""; // Reset input
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-purple-50 rounded-full relative cursor-pointer">
          <LuUser className="text-4xl text-purple-500" />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-purple-500/85 to-purple-700 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            className="w-20 h-20 rounded-full object-cover"
            alt="profile photo"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
              <span className="spinner"></span>{" "}
              {/* Spinner for upload progress */}
            </div>
          )}
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={handleRemoveImage}
          >
            <LuTrash2 />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
