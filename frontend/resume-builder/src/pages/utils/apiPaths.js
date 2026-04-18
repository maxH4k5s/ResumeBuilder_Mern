const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_PATHS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    GET_PROFILE: `${BASE_URL}/api/auth/profile`,
    UPDATE_PROFILE: `${BASE_URL}/api/auth/profile`,
    UPDATE_PASSWORD: `${BASE_URL}/api/auth/update-password`,
    DEACTIVATE_ACCOUNT: `${BASE_URL}/api/auth/deactivate`,
  },
  RESUME: {
    CREATE: `${BASE_URL}/api/resume`,
    GET_ALL: `${BASE_URL}/api/resume`,
    GET_BY_ID: (id) => `${BASE_URL}/api/resume/${id}`,
    UPDATE: (id) => `${BASE_URL}/api/resume/${id}`,
    DELETE: (id) => `${BASE_URL}/api/resume/${id}`,
    UPLOAD_IMAGES: (id) => `${BASE_URL}/api/resume/${id}/upload-images`,
  },
  IMAGE: {
    UPLOAD_IMAGE: `${BASE_URL}/api/auth/upload-image`,
  },
};
