import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { router } from "./Router/Routes.jsx";
import AuthProvider from "./provider/AuthProvider.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
       <div className="max-w-screen-xl mx-auto">
      <RouterProvider router={router} />
    </div>
    </AuthProvider>
   
  </StrictMode>
);