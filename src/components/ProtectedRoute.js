import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../service/AuthService';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const location = useLocation();
  const isAuthenticated = AuthService.isAuthenticated();
  const hasPermission = AuthService.hasPermission(location.pathname);

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion si non authentifié
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermission) {
    // Rediriger vers le dashboard si authentifié mais sans permission
    return <Navigate to="/admin/dashboard" replace />;
  }

  
  // Retourner le composant avec les props appropriées
  return React.cloneElement(Element, { ...rest });
};

export default ProtectedRoute;
