import api from './api';

export const jobService = {
  /**
   * Fetch opportunities with search and filter parameters
   */
  async getJobs(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.sector && params.sector !== 'All') queryParams.append('sector', params.sector);
      if (params.location && params.location !== 'All') queryParams.append('location', params.location);
      if (params.education && params.education !== 'All') queryParams.append('education', params.education);
      if (params.employmentType && params.employmentType !== 'All') queryParams.append('employmentType', params.employmentType);
      if (params.disabilityCategory && params.disabilityCategory !== 'All') queryParams.append('disabilityCategory', params.disabilityCategory);

      const qs = queryParams.toString();
      const url = qs ? `/jobs?${qs}` : '/jobs';
      const response = await api.get(url);
      return { data: response.data.data, count: response.data.count, error: null };
    } catch (err) {
      console.warn('getJobs API error:', err.message);
      return { data: [], count: 0, error: err };
    }
  },

  /**
   * Fetch single opportunity by ID
   */
  async getJobById(id) {
    try {
      const response = await api.get(`/jobs/${id}`);
      return { data: response.data.data, error: null };
    } catch (err) {
      console.warn('getJobById API error:', err.message);
      return { data: null, error: err };
    }
  },

  /**
   * Get all saved jobs for current user
   */
  async getSavedJobs() {
    try {
      const response = await api.get('/jobs/saved');
      return { data: response.data.data, count: response.data.count, error: null };
    } catch (err) {
      console.warn('getSavedJobs API error:', err.message);
      return { data: [], count: 0, error: err };
    }
  },

  /**
   * Save a job bookmark
   */
  async saveJob(id) {
    try {
      const response = await api.post(`/jobs/${id}/save`);
      return { success: true, data: response.data.data, error: null };
    } catch (err) {
      console.warn('saveJob API error:', err.message);
      return { success: false, error: err };
    }
  },

  /**
   * Remove job bookmark
   */
  async unsaveJob(id) {
    try {
      const response = await api.delete(`/jobs/${id}/save`);
      return { success: true, error: null };
    } catch (err) {
      console.warn('unsaveJob API error:', err.message);
      return { success: false, error: err };
    }
  },
};

export default jobService;
