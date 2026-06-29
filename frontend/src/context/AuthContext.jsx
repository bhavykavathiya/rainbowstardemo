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
    localStorage.removeItem('rs_guest');
    return data;
  };
  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    setUser(data);
    localStorage.removeItem('rs_guest');
    return data;
  };
  const loginAsGuest = () => {
    localStorage.setItem('rs_guest', '1');
    setUser({ role: 'guest', name: 'Guest', email: 'guest@rainbowstar.in' });
  };
  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('rs_guest');
    setUser(false);
  };

  // Restore guest session on mount if no real user
  useEffect(() => {
    if (user === false && localStorage.getItem('rs_guest') === '1') {
      setUser({ role: 'guest', name: 'Guest', email: 'guest@rainbowstar.in' });
    }
  }, [user]);

  return <AuthContext.Provider value={{ user, checking, login, register, loginAsGuest, logout, refresh }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
