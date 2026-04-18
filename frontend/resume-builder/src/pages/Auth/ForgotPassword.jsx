import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/inputs/Input";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { validateEmail } from "../utils/helper";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
      setIsSent(true);
      toast.success("Password reset email sent.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Forgot Password</h3>
        
        {!isSent ? (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleForgotPassword}>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email Address"
                placeholder="john@example.com"
                type="email"
              />
              
              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center py-2.5 mt-4"
                disabled={loading}
              >
                {loading ? <span className="spinner"></span> : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Email Sent</h4>
            <p className="text-sm text-gray-500">
              Check your inbox for a password reset link. If it doesn't appear within a few minutes, check your spam folder.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-primary hover:underline font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
