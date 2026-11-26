import api from './api';

/**
 * AI Service for client-side notification simplification and assistant requests
 */
const aiService = {
  /**
   * Simplify a job notification using Gemini AI through the backend
   * @param {string} jobId - UUID of the opportunity
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  simplifyJob: async (jobId) => {
    try {
      const response = await api.post('/api/ai/simplify', { jobId });
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          jobId: response.data.jobId,
        };
      }
      return {
        success: false,
        error: response.data?.error || 'Failed to simplify notification',
      };
    } catch (err) {
      console.warn('aiService.simplifyJob error:', err.response?.data || err.message);
      return {
        success: false,
        error:
          err.response?.data?.error ||
          err.message ||
          'Network error contacting Saarthi AI service',
      };
    }
  },
};

export default aiService;
