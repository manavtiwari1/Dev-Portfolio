import React from "react";
import { createRoot } from "react-dom/client";
import AdminPanel from "../admin.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminPanel />
  </React.StrictMode>
);
