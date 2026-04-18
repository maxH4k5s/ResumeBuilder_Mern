import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuArrowLeft,
  LuCamera,
  LuCheck,
  LuEye,
  LuEyeOff,
  LuKeyRound,
  LuLock,
  LuMail,
  LuSave,
  LuUser,
} from "react-icons/lu";
import { TbAlertTriangle } from "react-icons/tb";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Modal from "../../components/Modal";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import uploadImage from "../utils/uploadImg";

const ProfileSettings = () => {
  const { user, updateUserProfile, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  // ─── Profile form state ────────────────────────────────────
  const [name, setName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // ─── Password form state ───────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ─── Deactivate account state ──────────────────────────────
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  // Fetch fresh data from server every time this page opens — reliable, no context dependency
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setName(res.data.name || "");
        setProfileImageUrl(res.data.profileImageUrl || null);
        setPreviewImage(res.data.profileImageUrl || null);
      } catch {
        // fallback to context if request fails
        if (user) {
          setName(user.name || "");
          setProfileImageUrl(user.profileImageUrl || null);
          setPreviewImage(user.profileImageUrl || null);
        }
      }
    };
    loadProfile();
  }, []); // empty deps = runs only on mount


  // ─── Handlers ─────────────────────────────────────────────

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    setPreviewImage(URL.createObjectURL(file));

    try {
      setImageUploading(true);
      const data = await uploadImage(file);
      setProfileImageUrl(data.imageUrl);
      toast.success("Photo ready — click Save to apply");
    } catch {
      toast.error("Photo upload failed. Try again.");
      // Revert preview on failure
      setPreviewImage(profileImageUrl);
    } finally {
      setImageUploading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (imageUploading) {
      toast.error("Please wait for the photo to finish uploading");
      return;
    }
    try {
      setProfileLoading(true);
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        name: name.trim(),
        profileImageUrl: profileImageUrl || null,
      });
      // Sync context AND local state from server response (most reliable)
      updateUserProfile(response.data);
      setName(response.data.name || "");
      setProfileImageUrl(response.data.profileImageUrl || null);
      setPreviewImage(response.data.profileImageUrl || null);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Enter your current password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      setPasswordLoading(true);
      await axiosInstance.put(API_PATHS.AUTH.UPDATE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      setDeactivateLoading(true);
      await axiosInstance.delete(API_PATHS.AUTH.DEACTIVATE_ACCOUNT);
      toast.success("Account deactivated successfully.");
      logoutUser(); // Logs out and redirects
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to deactivate account");
    } finally {
      setDeactivateLoading(false);
      setShowDeactivateModal(false);
    }
  };

  // ─── Sub-components ────────────────────────────────────────

  const PasswordField = ({ label, value, onChange, show, onToggle, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent text-sm text-gray-800 transition"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
        >
          {show ? <LuEyeOff className="text-base" /> : <LuEye className="text-base" />}
        </button>
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto py-6 px-4">

        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-lg hover:bg-purple-50 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <LuArrowLeft className="text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage your account details</p>
          </div>
        </div>

        {/* ── Profile Info Card ───────────────────────────── */}
        <form
          onSubmit={handleProfileSave}
          className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 mb-5"
        >
          {/* Card title */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <LuUser className="text-purple-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-800">Profile Information</h2>
          </div>

          {/* Avatar picker */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group mb-2">
              {/* Avatar circle */}
              <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-50 border-4 border-white shadow-lg">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-purple-300">
                      {user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                )}
              </div>

              {/* Hover overlay */}
              <label
                htmlFor="profile-photo-input"
                className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {imageUploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LuCamera className="text-white text-xl" />
                )}
              </label>
              <input
                id="profile-photo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
                disabled={imageUploading}
              />

              {/* Upload success badge */}
              {profileImageUrl && !imageUploading && (
                <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow">
                  <LuCheck className="text-white text-xs" />
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">Click photo to change</p>
          </div>

          {/* Name input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <LuUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent text-sm text-gray-800 transition"
              />
            </div>
          </div>

          {/* Email — read-only */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                tabIndex={-1}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-400 cursor-not-allowed select-none"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email address cannot be changed.</p>
          </div>

          <button
            type="submit"
            disabled={profileLoading || imageUploading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all shadow-sm"
          >
            {profileLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <LuSave />
            )}
            {profileLoading ? "Saving…" : "Save Changes"}
          </button>
        </form>

        {/* ── Change Password Card ────────────────────────── */}
        <form
          onSubmit={handlePasswordChange}
          className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6"
        >
          {/* Card title */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <LuKeyRound className="text-purple-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-800">Change Password</h2>
          </div>

          <div className="space-y-4 mb-6">
            <PasswordField
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrent}
              onToggle={() => setShowCurrent((p) => !p)}
              placeholder="Enter your current password"
            />
            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNew}
              onToggle={() => setShowNew((p) => !p)}
              placeholder="Minimum 8 characters"
            />
            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirm}
              onToggle={() => setShowConfirm((p) => !p)}
              placeholder="Repeat new password"
            />
          </div>

          {/* Password strength hint */}
          {newPassword.length > 0 && newPassword.length < 8 && (
            <p className="text-xs text-red-400 mb-4">
              Password too short — needs at least 8 characters
            </p>
          )}
          {newPassword.length >= 8 && confirmPassword.length > 0 && newPassword !== confirmPassword && (
            <p className="text-xs text-red-400 mb-4">
              Passwords do not match
            </p>
          )}
          {newPassword.length >= 8 && confirmPassword === newPassword && confirmPassword.length > 0 && (
            <p className="text-xs text-green-500 mb-4 flex items-center gap-1">
              <LuCheck className="text-sm" /> Passwords match
            </p>
          )}

          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all shadow-sm"
          >
            {passwordLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <LuKeyRound />
            )}
            {passwordLoading ? "Updating…" : "Update Password"}
          </button>
        </form>

        {/* ── Danger Zone Card ────────────────────────────── */}
        <div className="bg-red-50/50 rounded-2xl border border-red-100 shadow-sm p-6 mt-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
              <TbAlertTriangle className="text-red-600" />
            </div>
            <h2 className="text-base font-semibold text-red-800">Danger Zone</h2>
          </div>
          <p className="text-sm text-red-600/80 mb-6 pl-10">
            Deactivating your account will immediately log you out. Your resumes and profile will be disabled. You will need to contact an administrator to reactivate your account.
          </p>
          <div className="pl-10">
            <button
              onClick={() => setShowDeactivateModal(true)}
              className="px-5 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
            >
              Deactivate Account
            </button>
          </div>
        </div>

      </div>

      {/* ── Deactivate Confirmation Modal ───────────────── */}
      <Modal
        isOpen={showDeactivateModal}
        onClose={() => !deactivateLoading && setShowDeactivateModal(false)}
        title="Confirm Deactivation"
      >
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-500">
            <TbAlertTriangle className="text-3xl" />
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
            Deactivate your account?
          </h4>
          <p className="text-sm text-gray-500 text-center mb-6">
            You will be logged out immediately and will not be able to log back in. Your published resumes will also be disabled. This action requires an administrator to reverse.
          </p>

          <div className="flex items-center gap-4 w-full">
            <button
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition-colors"
              onClick={() => setShowDeactivateModal(false)}
              disabled={deactivateLoading}
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              onClick={handleDeactivateAccount}
              disabled={deactivateLoading}
            >
              {deactivateLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Yes, Deactivate"
              )}
            </button>
          </div>
        </div>
      </Modal>

    </DashboardLayout>
  );
};

export default ProfileSettings;
