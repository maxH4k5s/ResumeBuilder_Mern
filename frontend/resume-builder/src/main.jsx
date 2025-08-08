import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import UserProvider from "./context/userContext"; // adjust path if needed

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
