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

  // Called after successful login
  const updateUser = ({ user: userData, token: accessToken }) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("token", accessToken);
  };

  // Clear user data on logout or error
  const clearUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{ user, token, loading, updateUser, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
