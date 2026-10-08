import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('acohst_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [applicant, setApplicant] = useState(null);
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('acohst_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      refreshProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const refreshProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/profile');
      if (res.data.success) {
        setUser(res.data.user);
        setApplicant(res.data.applicant || null);
        setStudent(res.data.student || null);
        localStorage.setItem('acohst_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('Failed to refresh profile:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token, user, applicant, student } = res.data;
      setToken(token);
      setUser(user);
      setApplicant(applicant || null);
      setStudent(student || null);
      localStorage.setItem('acohst_token', token);
      localStorage.setItem('acohst_user', JSON.stringify(user));
      return res.data;
    } else {
      throw new Error(res.data.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('acohst_token', token);
      localStorage.setItem('acohst_user', JSON.stringify(user));
      return res.data;
    } else {
      throw new Error(res.data.message || 'Registration failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setApplicant(null);
    setStudent(null);
    localStorage.removeItem('acohst_token');
    localStorage.removeItem('acohst_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      applicant,
      student,
      token,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
