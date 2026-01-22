import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = '@MWM:user';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (userData: any) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialização síncrona do localStorage para evitar flickering no refresh
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = (userData: any) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};