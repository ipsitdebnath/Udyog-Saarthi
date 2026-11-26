import api from './api';

/**
 * Service for managing candidate deadline and examination reminders
 */
const reminderService = {
  /**
   * Get all reminders for candidate
   * @returns {Promise<{success: boolean, data?: Array<object>, error?: string}>}
   */
  getReminders: async () => {
    try {
      const response = await api.get('/api/reminders');
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
        };
      }
      return {
        success: false,
        error: response.data?.error || 'Failed to fetch reminders',
      };
    } catch (err) {
      console.warn('reminderService.getReminders error:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Error fetching reminders',
      };
    }
  },

  /**
   * Create a deadline or examination reminder
   * @param {Object} payload - { jobId, title, reminderDate, reminderType, notes }
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  createReminder: async (payload) => {
    try {
      const response = await api.post('/api/reminders', payload);
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }
      return {
        success: false,
        error: response.data?.error || 'Failed to create reminder',
      };
    } catch (err) {
      console.warn('reminderService.createReminder error:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Error scheduling reminder',
      };
    }
  },

  /**
   * Delete a reminder by ID
   * @param {string} id - Reminder UUID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  deleteReminder: async (id) => {
    try {
      const response = await api.delete(`/api/reminders/${id}`);
      if (response.data && response.data.success) {
        return { success: true };
      }
      return {
        success: false,
        error: response.data?.error || 'Failed to delete reminder',
      };
    } catch (err) {
      console.warn('reminderService.deleteReminder error:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Error deleting reminder',
      };
    }
  },
};

export default reminderService;
