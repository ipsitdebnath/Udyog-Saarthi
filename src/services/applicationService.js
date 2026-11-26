import api from './api';

/**
 * Service for candidate job application recording, status tracking, and notes
 */
const applicationService = {
  /**
   * Get application summary counts across stages
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  getApplicationStats: async () => {
    try {
      const response = await api.get('/api/applications/stats');
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return {
        success: false,
        error: response.data?.error || 'Failed to fetch application stats',
      };
    } catch (err) {
      console.warn('applicationService.getApplicationStats error:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Error fetching stats',
      };
    }
  },

  /**
   * Get all applications recorded by the candidate
   * @returns {Promise<{success: boolean, data?: Array<object>, error?: string}>}
   */
  getApplications: async () => {
    try {
      const response = await api.get('/api/applications');
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
        };
      }
      return {
        success: false,
        error: response.data?.error || 'Failed to fetch applications',
      };
    } catch (err) {
      console.warn('applicationService.getApplications error:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Error loading applications',
      };
    }
  },

  /**
   * Record a new application submission
   * @param {Object} payload - { jobId, status, appliedAt, notes }
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  recordApplication: async (payload) => {
    try {
      const response = await api.post('/api/applications', payload);
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }
      return {
        success: false,
        error: response.data?.error || 'Failed to record application',
      };
    } catch (err) {
      console.warn('applicationService.recordApplication error:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Error recording application',
      };
    }
  },

  /**
   * Get application detail by ID
   * @param {string} id - Application UUID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  getApplicationById: async (id) => {
    try {
      const response = await api.get(`/api/applications/${id}`);
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return {
        success: false,
        error: response.data?.error || 'Failed to fetch application details',
      };
    } catch (err) {
      console.warn('applicationService.getApplicationById error:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Error loading application',
      };
    }
  },

  /**
   * Update application status or notes
   * @param {string} id - Application UUID
   * @param {Object} updates - { status, notes }
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  updateApplication: async (id, updates) => {
    try {
      const response = await api.patch(`/api/applications/${id}`, updates);
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }
      return {
        success: false,
        error: response.data?.error || 'Failed to update application',
      };
    } catch (err) {
      console.warn('applicationService.updateApplication error:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Error updating application',
      };
    }
  },
};

export default applicationService;
