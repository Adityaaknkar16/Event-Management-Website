import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decode JWT to get user object
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = decodeToken(token);
        // Check if token is expired
        if (decoded && decoded.exp * 1000 > Date.now()) {
          try {
            // Optionally sync profile from backend
            const response = await api.get('/auth/profile');
            setUser(response.data);
          } catch (error) {
            console.error('Failed to sync profile', error);
            // If API check fails, fallback to local token decode or clear it if 401
            if (error.response && error.response.status === 401) {
              logout();
            } else {
              // Fallback to local decoded token if server is down
              setUser({
                _id: decoded.id,
                role: decoded.role || 'customer',
              });
            }
          }
        } else {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, _id, name, email: userEmail, role } = response.data;
    localStorage.setItem('token', token);
    setUser({ _id, name, email: userEmail, role });
    return response.data;
  };

  const register = async (name, email, password, phone) => {
    const response = await api.post('/auth/register', { name, email, password, phone });
    const { token, _id, name: userName, email: userEmail, role } = response.data;
    localStorage.setItem('token', token);
    setUser({ _id, name: userName, email: userEmail, role });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
