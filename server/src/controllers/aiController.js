const { isConfigured, supabase, devStore } = require('../config/database');
const { simplifyNotification } = require('../services/geminiService');

/**
 * AI Controller
 * Handles AI-powered notification simplification and analysis
 */

/**
 * POST /api/ai/simplify
 * Request: { jobId: "uuid" }
 */
async function simplifyJob(req, res, next) {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: jobId',
      });
    }

    let job = null;

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error || !data) {
        return res.status(404).json({
          success: false,
          error: 'Job notification not found in database',
        });
      }
      job = data;
    } else {
      job = devStore.jobs.get(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job notification not found in store',
        });
      }
    }

    console.log(`[AIController] Simplifying notification for job: "${job.title}" (${job.id})`);
    const simplified = await simplifyNotification(job);

    return res.json({
      success: true,
      data: simplified,
      jobId: job.id,
      cached: false,
    });
  } catch (err) {
    console.error('[AIController] Error in simplifyJob:', err);
    return next(err);
  }
}

module.exports = {
  simplifyJob,
};
