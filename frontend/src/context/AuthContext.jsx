import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, IS_DEMO_MODE } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(IS_DEMO_MODE);

  useEffect(() => {
    // Check saved session
    const storedToken = localStorage.getItem('plantiq_token');
    const storedUser = localStorage.getItem('plantiq_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    } else {
      // Default initial mock user for seamless demonstration
      const defaultUser = {
        id: 'usr-demo-01',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@agritech.in',
        role: 'ADMIN',
        preferredLanguage: 'English'
      };
      const defaultToken = 'mock_jwt_token_demo';
      setUser(defaultUser);
      setToken(defaultToken);
      localStorage.setItem('plantiq_user', JSON.stringify(defaultUser));
      localStorage.setItem('plantiq_token', defaultToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const res = await authService.login(email, password);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('plantiq_token', res.token);
    localStorage.setItem('plantiq_user', JSON.stringify(res.user));

    if (rememberMe) {
      localStorage.setItem('plantiq_remembered_email', email);
    } else {
      localStorage.removeItem('plantiq_remembered_email');
    }
    return res;
  };

  const register = async (name, email, password, preferredLanguage = 'English') => {
    const res = await authService.register(name, email, password, preferredLanguage);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('plantiq_token', res.token);
    localStorage.setItem('plantiq_user', JSON.stringify(res.user));
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('plantiq_token');
    localStorage.removeItem('plantiq_user');
  };

  const toggleDemoMode = () => {
    setDemoMode((prev) => !prev);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        login,
        register,
        logout,
        demoMode,
        toggleDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
