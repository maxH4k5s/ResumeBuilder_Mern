import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const hasRun = React.useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      try {
        const res = await axiosInstance.get(API_PATHS.AUTH.VERIFY_EMAIL(token));
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully.");
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Invalid or expired verification token.");
        // Try to get email from localStorage if verification failed
        const email = localStorage.getItem("unverifiedEmail");
        if (email) setUserEmail(email);
      }
    };
    verifyToken();
  }, [token]);

  const handleResendEmail = async () => {
    if (!userEmail) {
      toast.error("Email address is required.");
      return;
    }

    setResendLoading(true);
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESEND_VERIFICATION_EMAIL, { email: userEmail });
      toast.success("Verification email sent! Check your inbox.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend email.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md text-center">

        {status === "verifying" && (
          <div className="py-8">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Verifying Email...</h3>
            <p className="text-sm text-gray-500">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-4">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Email Verified!</h3>
            <p className="text-sm text-gray-500 mb-8">{message}</p>
            <Link to="/" className="w-full btn-primary block text-center py-2.5">
              Login to Your Account
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="py-4">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              !
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Verification Failed</h3>
            <p className="text-sm text-gray-500 mb-6">{message}</p>

            {!userEmail && (
              <input
                type="email"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 text-sm"
              />
            )}

            <button
              onClick={handleResendEmail}
              disabled={resendLoading || !userEmail}
              className="w-full btn-primary py-2.5 mb-3"
            >
              {resendLoading ? <span className="spinner"></span> : "Resend Verification Email"}
            </button>

            <Link to="/" className="w-full btn-secondary block text-center py-2.5">
              Go to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
