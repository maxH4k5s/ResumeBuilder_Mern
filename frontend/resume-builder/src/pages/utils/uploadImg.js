import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  // appnd image file to form data
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", //set headers for file upload
        },
      }
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
