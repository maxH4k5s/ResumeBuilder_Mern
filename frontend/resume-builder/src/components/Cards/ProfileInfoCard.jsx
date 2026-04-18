import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import { LuSettings, LuLogOut, LuCircleAlert } from "react-icons/lu";
import Modal from "../Modal";

const ProfileInfoCard = () => {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logoutUser();
  };

  return (
    user && (
      <div className="flex items-center gap-3">
        {/* Avatar + Name — non-clickable display only */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-purple-100 border-2 border-purple-200">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-purple-500 font-semibold text-sm">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <div className="text-[13px] font-semibold text-gray-800 leading-4">
              {user.name || ""}
            </div>
            <div className="text-[11px] text-gray-400">{user.email || ""}</div>
          </div>
        </div>

        {/* Settings icon — only this opens settings */}
        <Link
          to="/profile-settings"
          title="Settings"
          className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
        >
          <LuSettings className="text-[16px]" />
        </Link>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutModal(true)}
          title="Logout"
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <LuLogOut className="text-[16px]" />
        </button>

        {/* Logout Warning Modal */}
        <Modal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          title="Confirm Logout"
        >
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-500">
              <LuCircleAlert className="text-3xl" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Are you sure you want to log out?
            </h4>
            <p className="text-sm text-gray-500 text-center mb-6">
              You will need to log back in to access your resumes and profile.
            </p>
            
            <div className="flex items-center gap-4 w-full">
              <button
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition-colors"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                onClick={handleLogout}
              >
                <LuLogOut className="text-[16px]" />
                Logout
              </button>
            </div>
          </div>
        </Modal>
      </div>
    )
  );
};

export default ProfileInfoCard;
