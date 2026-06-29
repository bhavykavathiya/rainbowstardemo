import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (e) {
      setUser(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data);
    return data;
  };
  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    setUser(data);
    return data;
  };
  const logout = async () => {
    await api.post('/auth/logout');
    setUser(false);
  };

  return <AuthContext.Provider value={{ user, checking, login, register, logout, refresh }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
