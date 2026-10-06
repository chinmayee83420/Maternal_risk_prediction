import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('maternal_token'));
  const [loading, setLoading] = useState(true);

  // Verify stored token on initial load
  useEffect(() => {
    async function verifyToken() {
      if (token) {
        try {
          const res = await getCurrentUser();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            // Token invalid or expired
            logoutUser();
          }
        } catch (err) {
          console.error('Failed to verify user session:', err);
        }
      }
      setLoading(false);
    }
    verifyToken();
  }, [token]);

  const loginUser = async (identifier, password) => {
    const res = await apiLogin(identifier, password);
    if (res.success && res.token) {
      localStorage.setItem('maternal_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const registerUser = async (username, email, password) => {
    const res = await apiRegister(username, email, password);
    if (res.success && res.token) {
      localStorage.setItem('maternal_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logoutUser = () => {
    localStorage.removeItem('maternal_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        loginUser,
        registerUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
