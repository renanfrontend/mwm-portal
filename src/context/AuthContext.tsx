// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { decodeJwt, type MockUser } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: Partial<MockUser> | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<Partial<MockUser> | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      setToken(storedToken);
      const decodedUser = decodeJwt(storedToken);
      setUser(decodedUser);
    }
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('jwtToken', newToken);
    setToken(newToken);
    const decodedUser = decodeJwt(newToken);
    setUser(decodedUser);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwtToken');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};