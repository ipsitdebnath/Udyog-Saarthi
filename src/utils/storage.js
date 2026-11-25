import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'udyog_saarthi_auth_token',
  USER_DATA: 'udyog_saarthi_user_data',
  ACCESSIBILITY_SETTINGS: 'udyog_saarthi_a11y_settings',
  OFFLINE_PROFILE: 'udyog_saarthi_offline_profile',
};

export const storage = {
  async setItem(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (e) {
      console.warn('AsyncStorage setItem error:', e);
    }
  },

  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (e) {
      console.warn('AsyncStorage getItem error:', e);
      return null;
    }
  },

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn('AsyncStorage removeItem error:', e);
    }
  },

  // Secure storage for sensitive tokens where hardware keystore is supported
  async setSecureItem(key, value) {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('SecureStore setItem error, falling back to AsyncStorage:', e);
      await AsyncStorage.setItem(key, value);
    }
  },

  async getSecureItem(key) {
    try {
      if (Platform.OS !== 'web') {
        return await SecureStore.getItemAsync(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (e) {
      console.warn('SecureStore getItem error, falling back to AsyncStorage:', e);
      return await AsyncStorage.getItem(key);
    }
  },

  async removeSecureItem(key) {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('SecureStore deleteItem error:', e);
      await AsyncStorage.removeItem(key);
    }
  },

  KEYS: STORAGE_KEYS,
};

export default storage;
