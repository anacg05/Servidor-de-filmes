import React, { createContext, useContext, useState } from 'react';

/* Contexto de Autenticação */
const AuthContext = createContext(null);

/* Base local de usuários (pode ser substituída por API futuramente) */
const USERS_DB = {
  'admin@grizflix.com': { pass: 'admin123', type: 'admin' },
  'user@grizflix.com': { pass: 'user123', type: 'user' }
};

/* Provider responsável por gerenciar estado global de autenticação */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /* Login */
  const login = (email, password) => {
    const foundUser = USERS_DB[email];

    if (foundUser && foundUser.pass === password) {
      setUser({ email, type: foundUser.type });
      return foundUser.type;
    }

    throw new Error('Email ou senha incorretos');
  };

  /* Logout */
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* Hook customizado para acessar o contexto */
export const useAuth = () => {
  return useContext(AuthContext);
};
