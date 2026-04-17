import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  // appnd image file to form data
  formData.append("image", imageFile);

  try {
    // NOTE: Do NOT set Content-Type manually — Axios auto-sets
    // "multipart/form-data; boundary=..." correctly when FormData is passed.
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData
    );

    return response.data; //return response data
  } catch (error) {
    console.error(
      "Error uploading the image:",
      error?.response?.data || error.message
    );
    throw error; //re through for handling
  }
};

export default uploadImage;
