import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import authService, { type LoginResponse } from '../services/authService';

interface AuthContextType {
  user: LoginResponse | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(() => authService.getUser());

  const login = useCallback(async (username: string, password: string) => {
    const data = await authService.login({ username, password });
    setUser(data);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
