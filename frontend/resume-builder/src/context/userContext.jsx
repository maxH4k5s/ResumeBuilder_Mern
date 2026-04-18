import React, { createContext, useState, useEffect } from "react";
import { API_PATHS } from "../pages/utils/apiPaths";
import axiosInstance from "../pages/utils/axiosInstance";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Called after successful login (handles backend response format)
  const updateUser = (data) => {
    // Handle backend response format: { _id, name, email, profileImageUrl }
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      profileImageUrl: data.profileImageUrl,
    };
    setUser(userData);
  };

  // Logout user
  const logoutUser = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch (error) {
      console.error("Failed to logout on server", error);
    } finally {
      clearUser();
      window.location.href = "/";
    }
  };

  // Clear user data on logout or error
  const clearUser = () => {
    setUser(null);
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
      value={{ user, loading, updateUser, logoutUser, clearUser, refreshUser, updateUserProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
