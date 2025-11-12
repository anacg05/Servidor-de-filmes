import React, { createContext, useContext, useState } from 'react';

// 1. Criar o Contexto
const AuthContext = createContext(null);

// 2. Definir os utilizadores (pode vir de uma API no futuro)
const USERS_DB = {
  'admin@grizflix.com': { pass: 'admin123', type: 'admin' },
  'user@grizflix.com': { pass: 'user123', type: 'user' }
};

// 3. Criar o "Provedor" (que envolve a aplicação)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Função de Login
  const login = (email, password) => {
    const foundUser = USERS_DB[email];
    
    if (foundUser && foundUser.pass === password) {
      setUser({ email: email, type: foundUser.type });
      return foundUser.type; // Retorna 'admin' ou 'user'
    }
    // Se falhar, lança um erro
    throw new Error('Email ou senha incorretos');
  };

  // Função de Logout
  const logout = () => {
    setUser(null);
    // (no futuro, pode adicionar navegação para '/')
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Hook customizado (para facilitar o uso)
export const useAuth = () => {
  return useContext(AuthContext);
};