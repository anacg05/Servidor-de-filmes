import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

/* Protege rotas permitindo acesso apenas a usuários logados */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  /* Se não estiver autenticado, redireciona para o Login */
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  /* Usuário autenticado → renderiza a rota protegida */
  return children;
}

export default ProtectedRoute;
