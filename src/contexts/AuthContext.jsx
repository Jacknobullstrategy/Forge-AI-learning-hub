import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.getMe();
          if (response.data) {
            setUser(response.data);
          }
        } catch (err) {
          console.error('Auth check failed:', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.login(email, password);
      const userData = await api.getMe();
      setUser(userData.data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const register = async (email, password, role, industry, department) => {
    try {
      setError(null);
      const response = await api.register(email, password, role, industry, department);
      const userData = await api.getMe();
      setUser(userData.data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      return true;
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null);
      return false;
    }
  };

  const updateProfile = async (role, industry, department) => {
    try {
      setError(null);
      await api.updateProfile(role, industry, department);
      const userData = await api.getMe();
      setUser(userData.data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
