import { supabase, isSupabaseConfigured } from './supabase';
import api from './api';
import storage from '../utils/storage';
import { Config } from '../constants/Config';

export const authService = {
  /**
   * Register a new user with Supabase Auth & create backend profile
   */
  async register({ email, password, fullName, phone, role }) {
    if (!isSupabaseConfigured()) {
      // Local fallback for offline/development environment
      console.info('Supabase credentials not configured in environment. Using simulated offline session.');
      const mockUser = {
        id: 'mock-user-' + Date.now(),
        email,
        user_metadata: {
          full_name: fullName,
          phone,
          role: role || Config.ROLES.CANDIDATE,
        },
      };
      const mockSession = {
        access_token: 'mock-jwt-token-' + Date.now(),
        user: mockUser,
      };

      await storage.setItem(storage.KEYS.USER_DATA, mockUser);
      await storage.setSecureItem(storage.KEYS.AUTH_TOKEN, mockSession.access_token);

      return { data: { user: mockUser, session: mockSession }, error: null };
    }

    try {
      // 1. Supabase Auth registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            role: role || Config.ROLES.CANDIDATE,
          },
        },
      });

      if (error) throw error;

      // 2. Sync user profile with Express Backend
      if (data?.session?.access_token) {
        try {
          await api.post(
            '/auth/register',
            {
              id: data.user.id,
              email: data.user.email,
              fullName,
              phone,
              role: role || Config.ROLES.CANDIDATE,
            },
            {
              headers: {
                Authorization: `Bearer ${data.session.access_token}`,
              },
            }
          );
        } catch (backendErr) {
          console.warn('Backend sync warning (will retry on profile edit):', backendErr.message);
        }
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Sign in an existing user with Supabase Auth
   */
  async login({ email, password }) {
    if (!isSupabaseConfigured()) {
      // Simulated dev login
      console.info('Supabase credentials not configured. Signing in to simulated dev session.');
      const storedUser = await storage.getItem(storage.KEYS.USER_DATA);
      const user = storedUser || {
        id: 'mock-dev-candidate-001',
        email,
        user_metadata: {
          full_name: 'Ramesh Kumar (Candidate)',
          phone: '9876543210',
          role: Config.ROLES.CANDIDATE,
        },
      };
      const session = {
        access_token: 'mock-dev-token-xyz',
        user,
      };
      await storage.setItem(storage.KEYS.USER_DATA, user);
      await storage.setSecureItem(storage.KEYS.AUTH_TOKEN, session.access_token);
      return { data: { user, session }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.session) {
        await storage.setSecureItem(storage.KEYS.AUTH_TOKEN, data.session.access_token);
        await storage.setItem(storage.KEYS.USER_DATA, data.user);
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Sign out current user and clear local sessions
   */
  async logout() {
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
      await storage.removeSecureItem(storage.KEYS.AUTH_TOKEN);
      await storage.removeItem(storage.KEYS.USER_DATA);
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  },

  /**
   * Get current session and user info
   */
  async getCurrentSession() {
    if (!isSupabaseConfigured()) {
      const user = await storage.getItem(storage.KEYS.USER_DATA);
      const token = await storage.getSecureItem(storage.KEYS.AUTH_TOKEN);
      if (user && token) {
        return { session: { access_token: token, user }, user };
      }
      return { session: null, user: null };
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) return { session: null, user: null };
      return { session: data.session, user: data.session.user };
    } catch {
      return { session: null, user: null };
    }
  },
};

export default authService;
