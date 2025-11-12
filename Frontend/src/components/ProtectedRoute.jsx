import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Se não estiver logado, redireciona para o Login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Se estiver logado, mostra a página que o utilizador pediu
  return children;
}

export default ProtectedRoute;