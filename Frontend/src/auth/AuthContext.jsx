import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Usuarios (pode vir de uma API no futuro)
const USERS_DB = {
  'admin@grizflix.com': { pass: 'admin123', type: 'admin' },
  'user@grizflix.com': { pass: 'user123', type: 'user' }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Função de Login
  const login = (email, password) => {
    const foundUser = USERS_DB[email];
    
    if (foundUser && foundUser.pass === password) {
      setUser({ email: email, type: foundUser.type });
      return foundUser.type; // Retorna 'admin' ou 'user'
    }
    throw new Error('Email ou senha incorretos');
  };

  // Função de Logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};