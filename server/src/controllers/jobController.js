const { supabase, isConfigured, devStore } = require('../config/database');

const jobController = {
  /**
   * GET /api/jobs
   * Fetch opportunities with search and filter capabilities
   */
  async getJobs(req, res, next) {
    try {
      const {
        search,
        sector,
        location,
        education,
        employmentType,
        disabilityCategory,
      } = req.query;

      const userId = req.user?.id;

      if (isConfigured && supabase) {
        let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });

        if (sector && sector !== 'All') {
          query = query.eq('sector', sector);
        }
        if (location && location !== 'All') {
          query = query.ilike('location', `%${location}%`);
        }
        if (employmentType && employmentType !== 'All') {
          query = query.ilike('employment_type', `%${employmentType}%`);
        }
        if (search) {
          query = query.or(`title.ilike.%${search}%,organization.ilike.%${search}%,description.ilike.%${search}%`);
        }

        const { data: jobs, error } = await query;
        if (error) throw error;

        // If user is authenticated, query user's saved jobs
        let savedJobIds = new Set();
        if (userId) {
          const { data: saved } = await supabase.from('saved_jobs').select('job_id').eq('user_id', userId);
          if (saved) savedJobIds = new Set(saved.map((s) => s.job_id));
        }

        const formatted = (jobs || []).map((job) => ({
          ...job,
          is_saved: savedJobIds.has(job.id),
        }));

        return res.json({ success: true, count: formatted.length, data: formatted });
      }

      // DevStore Fallback with comprehensive filtering
      let jobs = Array.from(devStore.jobs.values());

      if (sector && sector !== 'All') {
        jobs = jobs.filter((j) => j.sector.toLowerCase() === sector.toLowerCase());
      }

      if (location && location !== 'All') {
        jobs = jobs.filter((j) => j.location.toLowerCase().includes(location.toLowerCase()));
      }

      if (employmentType && employmentType !== 'All') {
        jobs = jobs.filter((j) => j.employment_type.toLowerCase().includes(employmentType.toLowerCase()));
      }

      if (disabilityCategory && disabilityCategory !== 'All') {
        jobs = jobs.filter((j) =>
          (j.eligible_disability_categories || []).some((cat) =>
            cat.toLowerCase().includes(disabilityCategory.toLowerCase())
          )
        );
      }

      if (education && education !== 'All') {
        jobs = jobs.filter((j) =>
          (j.education_requirements || []).some((req) =>
            req.toLowerCase().includes(education.toLowerCase())
          )
        );
      }

      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        jobs = jobs.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.organization.toLowerCase().includes(q) ||
            (j.description && j.description.toLowerCase().includes(q)) ||
            (j.required_skills && j.required_skills.some((s) => s.toLowerCase().includes(q)))
        );
      }

      // Determine saved state if user authenticated
      const userSavedSet = new Set();
      if (userId) {
        for (const [key, val] of devStore.savedJobs.entries()) {
          if (val.user_id === userId) {
            userSavedSet.add(val.job_id);
          }
        }
      }

      const formatted = jobs.map((job) => ({
        ...job,
        is_saved: userSavedSet.has(job.id),
      }));

      return res.json({
        success: true,
        count: formatted.length,
        data: formatted,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/jobs/:id
   * Fetch full details for a single job opportunity
   */
  async getJobById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (isConfigured && supabase) {
        const { data: job, error } = await supabase.from('jobs').select('*').eq('id', id).single();
        if (error || !job) {
          return res.status(404).json({ success: false, error: 'Opportunity not found' });
        }

        let isSaved = false;
        let application = null;

        if (userId) {
          const [savedRes, appRes] = await Promise.all([
            supabase.from('saved_jobs').select('id').eq('user_id', userId).eq('job_id', id).maybeSingle(),
            supabase.from('job_applications').select('*').eq('user_id', userId).eq('job_id', id).maybeSingle(),
          ]);
          isSaved = !!savedRes.data;
          application = appRes.data || null;
        }

        return res.json({
          success: true,
          data: {
            ...job,
            is_saved: isSaved,
            application,
          },
        });
      }

      // Dev Store Fallback
      const job = devStore.jobs.get(id);
      if (!job) {
        return res.status(404).json({ success: false, error: 'Opportunity not found' });
      }

      let isSaved = false;
      let application = null;
      if (userId) {
        const savedKey = `${userId}:${id}`;
        isSaved = devStore.savedJobs.has(savedKey);
        application = devStore.jobApplications.get(savedKey) || null;
      }

      return res.json({
        success: true,
        data: {
          ...job,
          is_saved: isSaved,
          application,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/jobs/saved
   * Get all saved opportunities for authenticated candidate
   */
  async getSavedJobs(req, res, next) {
    try {
      const userId = req.user.id;

      if (isConfigured && supabase) {
        const { data, error } = await supabase
          .from('saved_jobs')
          .select('id, created_at, job:jobs(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        const jobs = (data || []).map((item) => ({
          ...item.job,
          saved_id: item.id,
          saved_at: item.created_at,
          is_saved: true,
        }));
        return res.json({ success: true, count: jobs.length, data: jobs });
      }

      // Dev Store Fallback
      const savedList = [];
      for (const [key, val] of devStore.savedJobs.entries()) {
        if (val.user_id === userId) {
          const job = devStore.jobs.get(val.job_id);
          if (job) {
            savedList.push({
              ...job,
              saved_id: val.id,
              saved_at: val.created_at,
              is_saved: true,
            });
          }
        }
      }

      return res.json({
        success: true,
        count: savedList.length,
        data: savedList,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/jobs/:id/save
   * Save an opportunity for the candidate
   */
  async saveJob(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (isConfigured && supabase) {
        const { data, error } = await supabase
          .from('saved_jobs')
          .upsert(
            { user_id: userId, job_id: id },
            { onConflict: 'user_id,job_id' }
          )
          .select()
          .single();

        if (error) throw error;
        return res.status(201).json({
          success: true,
          message: 'Job saved to your bookmarks.',
          data,
        });
      }

      // Dev Store Fallback
      const job = devStore.jobs.get(id);
      if (!job) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }

      const saveKey = `${userId}:${id}`;
      const record = {
        id: 'sj-' + Date.now(),
        user_id: userId,
        job_id: id,
        created_at: new Date().toISOString(),
      };
      devStore.savedJobs.set(saveKey, record);

      return res.status(201).json({
        success: true,
        message: 'Job saved to your bookmarks.',
        data: record,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/jobs/:id/save
   * Remove job from saved bookmarks
   */
  async unsaveJob(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (isConfigured && supabase) {
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', userId)
          .eq('job_id', id);

        if (error) throw error;
        return res.json({ success: true, message: 'Job removed from saved bookmarks.' });
      }

      // Dev Store Fallback
      const saveKey = `${userId}:${id}`;
      devStore.savedJobs.delete(saveKey);

      return res.json({
        success: true,
        message: 'Job removed from saved bookmarks.',
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/jobs/recommended
   * Return personalized job recommendations based on candidate profile
   */
  async getRecommendedJobs(req, res, next) {
    try {
      const userId = req.user?.id;
      let candidateProfile = {};

      if (userId) {
        if (isConfigured && supabase) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
          if (data) candidateProfile = data;
        } else {
          candidateProfile =
            (devStore.candidateProfiles && devStore.candidateProfiles.get(userId)) ||
            (devStore.profiles && devStore.profiles.get(userId)) ||
            {};
        }
      }

      // Fetch all jobs
      let jobs = [];
      let savedJobIds = new Set();

      if (isConfigured && supabase) {
        const { data: jobData, error } = await supabase.from('jobs').select('*');
        if (error) throw error;
        jobs = jobData || [];

        if (userId) {
          const { data: saved } = await supabase
            .from('saved_jobs')
            .select('job_id')
            .eq('user_id', userId);
          if (saved) savedJobIds = new Set(saved.map((s) => s.job_id));
        }
      } else {
        jobs = Array.from(devStore.jobs.values());
        if (userId) {
          Array.from(devStore.savedJobs.values()).forEach((sj) => {
            if (sj.user_id === userId) savedJobIds.add(sj.job_id);
          });
        }
      }

      // Format jobs with is_saved
      const formattedJobs = jobs.map((j) => ({
        ...j,
        is_saved: savedJobIds.has(j.id),
      }));

      const { rankJobsForCandidate } = require('../services/matchingService');
      const ranked = rankJobsForCandidate(candidateProfile, formattedJobs);

      return res.json({
        success: true,
        count: ranked.length,
        data: ranked,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = jobController;
