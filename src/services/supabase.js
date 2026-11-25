import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../constants/Config';

const supabaseUrl = Config.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = Config.SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = () => {
  return (
    Config.SUPABASE_URL &&
    Config.SUPABASE_URL !== 'https://your-project.supabase.co' &&
    Config.SUPABASE_URL !== 'https://placeholder-project.supabase.co' &&
    Config.SUPABASE_ANON_KEY &&
    Config.SUPABASE_ANON_KEY !== 'your-anon-key-here' &&
    Config.SUPABASE_ANON_KEY !== 'placeholder-anon-key'
  );
};

// Custom AsyncStorage adapter for Supabase
const customStorageAdapter = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: (key) => AsyncStorage.removeItem(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
