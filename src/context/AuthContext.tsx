import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCSC: boolean;
  cscData: any | null;
  login: (credentials: { username: string; password: string; role: 'admin' | 'csc' }) => Promise<void>;
  logout: () => void;
  quickLogin: (type: 'admin' | 'dhanora' | 'powerhouse') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('cs_consultancy_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('cs_consultancy_token') || null;
  });

  const [cscData, setCscData] = useState<any | null>(() => {
    try {
      const stored = localStorage.getItem('cs_consultancy_csc_data');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('cs_consultancy_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cs_consultancy_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('cs_consultancy_token', token);
    } else {
      localStorage.removeItem('cs_consultancy_token');
    }
  }, [token]);

  useEffect(() => {
    if (cscData) {
      localStorage.setItem('cs_consultancy_csc_data', JSON.stringify(cscData));
    } else {
      localStorage.removeItem('cs_consultancy_csc_data');
    }
  }, [cscData]);

  const login = async (credentials: { username: string; password: string; role: 'admin' | 'csc' }) => {
    const data = await api.login(credentials);
    setUser(data.user);
    setToken(data.token);
    if (data.user.cscData) {
      setCscData(data.user.cscData);
    } else {
      setCscData(null);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCscData(null);
    localStorage.removeItem('cs_consultancy_user');
    localStorage.removeItem('cs_consultancy_token');
    localStorage.removeItem('cs_consultancy_csc_data');
  };

  const quickLogin = async (type: 'admin' | 'dhanora' | 'powerhouse') => {
    if (type === 'admin') {
      await login({ username: 'admin', password: 'admin123', role: 'admin' });
    } else if (type === 'dhanora') {
      await login({ username: 'dhanora_csc', password: 'csc123', role: 'csc' });
    } else if (type === 'powerhouse') {
      await login({ username: 'powerhouse_csc', password: 'csc123', role: 'csc' });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isCSC: user?.role === 'csc',
        cscData,
        login,
        logout,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
