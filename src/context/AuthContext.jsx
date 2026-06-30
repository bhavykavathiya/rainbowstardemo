import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const buildUser = useCallback(async (session) => {
    if (!session?.user) {
      setUser(false);
      return;
    }
    const authUser = session.user;
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, name, company')
      .eq('id', authUser.id)
      .maybeSingle();

    const guestFlag = localStorage.getItem('rs_guest');
    if (guestFlag === '1') {
      localStorage.removeItem('rs_guest');
    }

    setUser({
      id: authUser.id,
      email: authUser.email,
      name: profile?.name || authUser.user_metadata?.name || '',
      company: profile?.company || authUser.user_metadata?.company || '',
      role: profile?.role || 'buyer',
    });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        buildUser(session).finally(() => setChecking(false));
      } else {
        const guestFlag = localStorage.getItem('rs_guest');
        if (guestFlag === '1') {
          setUser({ role: 'guest', name: 'Guest', email: 'guest@rainbowstar.in' });
        } else {
          setUser(false);
        }
        setChecking(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session) {
          await buildUser(session);
        } else {
          const guestFlag = localStorage.getItem('rs_guest');
          if (guestFlag === '1') {
            setUser({ role: 'guest', name: 'Guest', email: 'guest@rainbowstar.in' });
          } else {
            setUser(false);
          }
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, [buildUser]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await buildUser(data.session);
    localStorage.removeItem('rs_guest');
    return user;
  };

  const register = async (payload) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
          company: payload.company || '',
          phone: payload.phone || '',
        },
      },
    });
    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email: payload.email.toLowerCase(),
        name: payload.name,
        company: payload.company || null,
        phone: payload.phone || null,
        role: 'buyer',
      });
      if (profileError) console.error('Profile creation failed:', profileError);
    }

    await buildUser(data.session);
    localStorage.removeItem('rs_guest');
    return user;
  };

  const loginAsGuest = () => {
    localStorage.setItem('rs_guest', '1');
    setUser({ role: 'guest', name: 'Guest', email: 'guest@rainbowstar.in' });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('rs_guest');
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, checking, login, register, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
