import React, { createContext, useState, useEffect } from "react";
import { API_PATHS } from "../pages/utils/apiPaths";
import axiosInstance from "../pages/utils/axiosInstance";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Attach token to axios headers whenever it changes
  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Fetch user profile on mount or when token updates
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  // Called after successful login (handles backend response format)
  const updateUser = (data) => {
    // Handle backend response format: { _id, name, email, profileImageUrl, token }
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      profileImageUrl: data.profileImageUrl,
    };
    setUser(userData);
    setToken(data.token);
    localStorage.setItem("token", data.token);
  };

  // Clear user data on logout or error
  const clearUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // Refresh user data from server (after profile update)
  const refreshUser = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to refresh user", error);
    }
  };

  // Direct update from PUT /api/auth/profile response (no extra GET needed)
  const updateUserProfile = (updatedData) => {
    setUser((prev) => ({
      ...prev,
      name: updatedData.name ?? prev?.name,
      profileImageUrl: updatedData.profileImageUrl ?? prev?.profileImageUrl,
    }));
  };

  return (
    <UserContext.Provider
      value={{ user, token, loading, updateUser, clearUser, refreshUser, updateUserProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
