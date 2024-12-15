import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { DarkModeProvider } from "./DarkModeContext";
import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./dark-mode.css";

import AdminLayout from "layouts/Admin.js";
import Loginn from "views/Loginn";
import Registre from "views/Registre";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <DarkModeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login/*" element={<Loginn />} />
        <Route path="/registre/*" element={<Registre />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/" element={<Navigate to="login" replace />} />
      </Routes>
    </BrowserRouter>
  </DarkModeProvider>
);
