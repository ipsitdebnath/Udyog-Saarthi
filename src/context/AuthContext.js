import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import authService from '../services/authService';
import storage from '../utils/storage';
import { Config } from '../constants/Config';

const AuthContext = createContext({
  user: null,
  session: null,
  role: Config.ROLES.CANDIDATE,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { session: currentSession, user: currentUser } =
          await authService.getCurrentSession();

        if (isMounted) {
          setSession(currentSession);
          setUser(currentUser);
        }
      } catch (err) {
        console.warn('Auth initialization error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    // Set up Supabase auth listener if configured
    let subscription = null;
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        setUser(newSession?.user || null);
        if (newSession?.access_token) {
          await storage.setSecureItem(storage.KEYS.AUTH_TOKEN, newSession.access_token);
        } else {
          await storage.removeSecureItem(storage.KEYS.AUTH_TOKEN);
        }
      });
      subscription = data?.subscription;
    }

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await authService.login({ email, password });
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { data, error } = await authService.register(userData);
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    const { session: s, user: u } = await authService.getCurrentSession();
    setSession(s);
    setUser(u);
  };

  const role =
    user?.user_metadata?.role ||
    user?.role ||
    Config.ROLES.CANDIDATE;

  const value = {
    user,
    session,
    role,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    refreshUser,
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

export default AuthContext;
