// import React, { useContext } from "react";
// import { UserContext } from "../../context/userContext";
// import Navbar from "./Navbar";

// const DashboardLayout = ({ activeMenu, children }) => {
//   const { user } = useContext(UserContext);
//   return (
//     <div>
//       <Navbar activeMenu={activeMenu} />
//       {user && <div className="container mx-auto pt-4 pb-4">{children}</div>}
//     </div>
//   );
// };

// export default DashboardLayout;

// src/components/layouts/DashboardLayout.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  // Show a spinner (or placeholder) while we're loading the user
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  // If not loading and still no user, kick them back to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto pt-4 pb-4">{children}</div>
    </>
  );
};

export default DashboardLayout;
