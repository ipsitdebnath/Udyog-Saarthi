import api from './api';
import storage from '../utils/storage';

export const profileService = {
  /**
   * Fetch current candidate and disability profile from backend
   */
  async getProfile() {
    try {
      const response = await api.get('/profile/me');
      if (response.data?.success && response.data?.data) {
        await storage.setItem(storage.KEYS.OFFLINE_PROFILE, response.data.data);
        return { data: response.data.data, error: null };
      }
      throw new Error(response.data?.error || 'Failed to fetch profile');
    } catch (err) {
      console.warn('Profile fetch API error, checking local cached profile:', err.message);
      const cached = await storage.getItem(storage.KEYS.OFFLINE_PROFILE);
      if (cached) {
        return { data: cached, error: null };
      }
      return { data: null, error: err };
    }
  },

  /**
   * Save or update candidate profile and disability profile
   */
  async saveProfile(profileData) {
    try {
      // 1. Save to backend database
      const response = await api.post('/profile/me', profileData);

      if (response.data?.success) {
        await storage.setItem(storage.KEYS.OFFLINE_PROFILE, response.data.data);
        return { data: response.data.data, error: null };
      }
      throw new Error(response.data?.error || 'Failed to save profile');
    } catch (err) {
      console.warn('Backend profile save error, persisting locally for sync:', err.message);
      // Fallback cache
      const localData = {
        candidateProfile: {
          ...profileData,
          updated_at: new Date().toISOString(),
        },
        disabilityProfile: {
          udidReference: profileData.udidReference,
          disabilityCategory: profileData.disabilityCategory,
          functionalDifficulties: profileData.functionalDifficulties,
          assistiveDevices: profileData.assistiveDevices,
          humanAssistanceRequirements: profileData.humanAssistanceRequirements,
          updated_at: new Date().toISOString(),
        },
      };
      await storage.setItem(storage.KEYS.OFFLINE_PROFILE, localData);
      return { data: localData, error: null, isOfflineFallback: true };
    }
  },
};

export default profileService;
