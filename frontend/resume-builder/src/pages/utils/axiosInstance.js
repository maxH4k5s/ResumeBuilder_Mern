import axios from "axios";
import { API_PATHS } from "./apiPaths";

// Automatically derive baseURL from any full path in API_PATHS
const extractBaseUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.host}`;
  } catch {
    console.error("Invalid API URL:", url);
    return "";
  }
};

const axiosInstance = axios.create({
  baseURL: extractBaseUrl(API_PATHS.AUTH.LOGIN), // derive from LOGIN URL
  timeout: 30000,
  headers: {
    // NOTE: Do NOT set Content-Type here globally.
    // For JSON requests it's set per-call; for FormData, Axios sets it automatically.
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Only set Content-Type for non-FormData requests
    // FormData lets Axios auto-set "multipart/form-data; boundary=..." correctly
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // If the error is from the login endpoint, let the component handle it (so it can show the error message)
        if (!error.config || !error.config.url.includes("login")) {
          window.location.href = "/";
        }
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
