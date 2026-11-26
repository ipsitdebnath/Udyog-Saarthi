const { supabase, isConfigured, devStore } = require('../config/database');
const crypto = require('crypto');

/**
 * Application Controller
 * Handles recording, tracking, and updating job applications for candidates
 */
const applicationController = {
  /**
   * POST /api/applications
   * Record a new application submission
   */
  async createApplication(req, res, next) {
    try {
      const userId = req.user.id;
      const { jobId, status = 'applied', appliedAt, notes = '' } = req.body;

      if (!jobId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: jobId',
        });
      }

      const validStatuses = [
        'saved',
        'applied',
        'examination',
        'interview',
        'selected',
        'placed',
        'rejected',
        'withdrawn',
        'on_hold',
      ];

      const cleanStatus = validStatuses.includes(status.toLowerCase())
        ? status.toLowerCase()
        : 'applied';

      const now = new Date().toISOString();
      const applicationDate = appliedAt ? new Date(appliedAt).toISOString() : now;

      if (isConfigured && supabase) {
        // Check if application exists
        const { data: existing } = await supabase
          .from('job_applications')
          .select('id')
          .eq('user_id', userId)
          .eq('job_id', jobId)
          .single();

        let resultData = null;
        if (existing) {
          const { data, error } = await supabase
            .from('job_applications')
            .update({
              status: cleanStatus,
              applied_at: applicationDate,
              notes,
              updated_at: now,
            })
            .eq('id', existing.id)
            .select('*')
            .single();

          if (error) throw error;
          resultData = data;
        } else {
          const { data, error } = await supabase
            .from('job_applications')
            .insert({
              id: crypto.randomUUID(),
              user_id: userId,
              job_id: jobId,
              status: cleanStatus,
              applied_at: applicationDate,
              notes,
              created_at: now,
              updated_at: now,
            })
            .select('*')
            .single();

          if (error) throw error;
          resultData = data;
        }

        return res.status(201).json({
          success: true,
          message: 'Application recorded successfully.',
          data: resultData,
        });
      }

      // Dev Store Fallback
      let existingApp = null;
      for (const app of devStore.jobApplications.values()) {
        if (app.user_id === userId && app.job_id === jobId) {
          existingApp = app;
          break;
        }
      }

      if (existingApp) {
        existingApp.status = cleanStatus;
        existingApp.applied_at = applicationDate;
        existingApp.notes = notes;
        existingApp.updated_at = now;

        return res.json({
          success: true,
          message: 'Application status updated.',
          data: existingApp,
        });
      }

      const newId = crypto.randomUUID();
      const newApp = {
        id: newId,
        user_id: userId,
        job_id: jobId,
        status: cleanStatus,
        applied_at: applicationDate,
        notes,
        created_at: now,
        updated_at: now,
      };

      devStore.jobApplications.set(newId, newApp);

      return res.status(201).json({
        success: true,
        message: 'Application recorded successfully.',
        data: newApp,
      });
    } catch (err) {
      console.error('[ApplicationController] createApplication error:', err);
      next(err);
    }
  },

  /**
   * GET /api/applications
   * Get all applications recorded by the candidate with joined job details
   */
  async getApplications(req, res, next) {
    try {
      const userId = req.user.id;

      if (isConfigured && supabase) {
        const { data, error } = await supabase
          .from('job_applications')
          .select(`
            *,
            job:jobs(*)
          `)
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        return res.json({
          success: true,
          count: (data || []).length,
          data: data || [],
        });
      }

      // Dev Store Fallback
      const userApps = [];
      for (const app of devStore.jobApplications.values()) {
        if (app.user_id === userId) {
          const job = devStore.jobs.get(app.job_id) || null;
          userApps.push({
            ...app,
            job,
          });
        }
      }

      userApps.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      return res.json({
        success: true,
        count: userApps.length,
        data: userApps,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/applications/stats
   * Summary stage counts for the candidate dashboard
   */
  async getApplicationStats(req, res, next) {
    try {
      const userId = req.user.id;

      let applications = [];
      let savedCount = 0;

      if (isConfigured && supabase) {
        const { data: apps } = await supabase
          .from('job_applications')
          .select('status')
          .eq('user_id', userId);
        applications = apps || [];

        const { count } = await supabase
          .from('saved_jobs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        savedCount = count || 0;
      } else {
        for (const app of devStore.jobApplications.values()) {
          if (app.user_id === userId) applications.push(app);
        }
        for (const sj of devStore.savedJobs.values()) {
          if (sj.user_id === userId) savedCount++;
        }
      }

      const stats = {
        total: applications.length,
        saved: savedCount,
        applied: 0,
        examination: 0,
        interview: 0,
        selected: 0,
        placed: 0,
        rejected: 0,
        on_hold: 0,
      };

      applications.forEach((a) => {
        const s = a.status?.toLowerCase();
        if (stats[s] !== undefined) {
          stats[s]++;
        }
      });

      return res.json({
        success: true,
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/applications/:id
   * Get specific application detail
   */
  async getApplicationById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (isConfigured && supabase) {
        const { data, error } = await supabase
          .from('job_applications')
          .select('*, job:jobs(*)')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (error || !data) {
          return res.status(404).json({ success: false, error: 'Application not found.' });
        }
        return res.json({ success: true, data });
      }

      let app = null;
      for (const item of devStore.jobApplications.values()) {
        if (item.id === id) {
          app = item;
          break;
        }
      }

      if (!app || app.user_id !== userId) {
        return res.status(404).json({ success: false, error: 'Application not found.' });
      }

      const job = devStore.jobs.get(app.job_id) || null;
      return res.json({
        success: true,
        data: { ...app, job },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /api/applications/:id
   * Update application status, stage, or candidate notes
   */
  async updateApplication(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { status, notes } = req.body;

      const now = new Date().toISOString();
      const updates = { updated_at: now };
      if (status) updates.status = status.toLowerCase();
      if (notes !== undefined) updates.notes = notes;

      if (isConfigured && supabase) {
        const { data, error } = await supabase
          .from('job_applications')
          .update(updates)
          .eq('id', id)
          .eq('user_id', userId)
          .select('*, job:jobs(*)')
          .single();

        if (error || !data) {
          return res.status(404).json({ success: false, error: 'Application not found or update failed.' });
        }
        return res.json({ success: true, data });
      }

      let app = null;
      for (const item of devStore.jobApplications.values()) {
        if (item.id === id) {
          app = item;
          break;
        }
      }

      if (!app || app.user_id !== userId) {
        return res.status(404).json({ success: false, error: 'Application not found.' });
      }

      if (status) app.status = status.toLowerCase();
      if (notes !== undefined) app.notes = notes;
      app.updated_at = now;

      const job = devStore.jobs.get(app.job_id) || null;
      return res.json({
        success: true,
        message: 'Application updated successfully.',
        data: { ...app, job },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = applicationController;
