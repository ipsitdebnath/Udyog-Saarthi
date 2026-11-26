import api from './api';

/**
 * Service for fetching personalized job recommendations for candidates
 */
const recommendationService = {
  /**
   * Get personalized recommendations ranked by positive compatibility
   * @returns {Promise<{success: boolean, data?: Array<{job: object, matchScore: number, matchReasons: string[]}>, error?: string}>}
   */
  getRecommendations: async () => {
    try {
      const response = await api.get('/api/jobs/recommended');
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
        };
      }
      return {
        success: false,
        error: response.data?.error || 'Failed to fetch recommendations',
      };
    } catch (err) {
      console.warn('recommendationService.getRecommendations error:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Error loading job recommendations',
      };
    }
  },
};

export default recommendationService;
