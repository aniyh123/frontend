import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "layouts/Admin.js";
import Loginn from "views/Loginn";
import Registre from "views/Registre";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Loginn />} />
      <Route path="/registre" element={<Registre />} />
      <Route path="/admin" element={<AdminLayout />}>
        {/* Routes par défaut pour /admin */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="icons" element={<Icons />} />
        <Route path="maps" element={<Maps />} />
        <Route path="notifications" element={<Notifications />} />
        
        {/* Routes pour la section Personne */}
        <Route path="user-page" element={<UserPage />} />
        <Route path="user-page/admin" element={<UserPage />} />
        <Route path="user-page/client" element={<UserPage />} />
        <Route path="user-page/vendeur" element={<UserPage />} />
        <Route path="user-page/gerant" element={<UserPage />} />
        <Route path="user-page/fournisseur" element={<UserPage />} />
        
        <Route path="tables" element={<ArticleApp />} />
        <Route path="typography" element={<Typography />} />
      </Route>
      
      {/* Routes de redirection */}
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;