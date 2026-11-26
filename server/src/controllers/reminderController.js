const { supabase, isConfigured, devStore } = require('../config/database');
const crypto = require('crypto');

/**
 * Reminder Controller
 * Manages upcoming application deadlines, examination alerts, and candidate calendar reminders
 */
const reminderController = {
  /**
   * GET /api/reminders
   * Fetch all active reminders for the candidate
   */
  async getReminders(req, res, next) {
    try {
      const userId = req.user.id;

      if (isConfigured && supabase) {
        const { data, error } = await supabase
          .from('reminders')
          .select('*, job:jobs(*)')
          .eq('user_id', userId)
          .order('reminder_date', { ascending: true });

        if (error) throw error;
        return res.json({
          success: true,
          count: (data || []).length,
          data: data || [],
        });
      }

      // Dev Store Fallback
      const userReminders = [];
      for (const rem of devStore.reminders.values()) {
        if (rem.user_id === userId) {
          const job = devStore.jobs.get(rem.job_id) || null;
          userReminders.push({
            ...rem,
            job,
          });
        }
      }

      userReminders.sort((a, b) => new Date(a.reminder_date) - new Date(b.reminder_date));

      return res.json({
        success: true,
        count: userReminders.length,
        data: userReminders,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/reminders
   * Schedule a new deadline or examination reminder
   */
  async createReminder(req, res, next) {
    try {
      const userId = req.user.id;
      const {
        jobId,
        title,
        reminderDate,
        reminderType = 'deadline',
        notes = '',
      } = req.body;

      if (!jobId || !reminderDate) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: jobId and reminderDate',
        });
      }

      const jobTitle = title || 'Application Deadline Reminder';
      const cleanDate = new Date(reminderDate).toISOString();
      const newId = crypto.randomUUID();

      if (isConfigured && supabase) {
        const { data, error } = await supabase
          .from('reminders')
          .insert({
            id: newId,
            user_id: userId,
            job_id: jobId,
            title: jobTitle,
            reminder_date: cleanDate,
            reminder_type: reminderType,
            notes,
            is_completed: false,
            created_at: new Date().toISOString(),
          })
          .select('*, job:jobs(*)')
          .single();

        if (error) throw error;
        return res.status(201).json({
          success: true,
          message: 'Reminder scheduled successfully.',
          data,
        });
      }

      const newReminder = {
        id: newId,
        user_id: userId,
        job_id: jobId,
        title: jobTitle,
        reminder_date: cleanDate,
        reminder_type: reminderType,
        notes,
        is_completed: false,
        created_at: new Date().toISOString(),
      };

      devStore.reminders.set(newId, newReminder);
      const job = devStore.jobs.get(jobId) || null;

      return res.status(201).json({
        success: true,
        message: 'Reminder scheduled successfully.',
        data: { ...newReminder, job },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/reminders/:id
   * Delete a scheduled reminder
   */
  async deleteReminder(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (isConfigured && supabase) {
        const { error } = await supabase
          .from('reminders')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);

        if (error) throw error;
        return res.json({ success: true, message: 'Reminder deleted.' });
      }

      const rem = devStore.reminders.get(id);
      if (!rem || rem.user_id !== userId) {
        return res.status(404).json({ success: false, error: 'Reminder not found.' });
      }

      devStore.reminders.delete(id);
      return res.json({ success: true, message: 'Reminder deleted.' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = reminderController;
