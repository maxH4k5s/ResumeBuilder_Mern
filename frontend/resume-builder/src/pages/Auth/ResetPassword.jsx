import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Input from "../../components/inputs/Input";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD(token), { password });
      setIsSuccess(true);
      toast.success("Password reset successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Set New Password</h3>

        {!isSuccess ? (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Please enter your new password below.
            </p>
            <form onSubmit={handleResetPassword}>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="New Password"
                placeholder="Min 8 Characters"
                type="password"
                minLength={8}
              />
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                label="Confirm New Password"
                placeholder="Repeat new password"
                type="password"
              />

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center py-2.5 mt-4"
                disabled={loading}
              >
                {loading ? <span className="spinner"></span> : "Reset Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Password Reset Successful!</h4>
            <p className="text-sm text-gray-500 mb-6">
              Your password has been changed. You can now log in with your new password.
            </p>
            <Link to="/" className="w-full btn-primary block text-center py-2.5">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
