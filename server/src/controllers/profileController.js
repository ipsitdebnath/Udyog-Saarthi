const { supabase, isConfigured, devStore } = require('../config/database');

const profileController = {
  /**
   * GET /api/profile/me
   * Retrieves candidate profile and protected disability profile for the authenticated candidate
   */
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;

      if (isConfigured && supabase) {
        const [candidateRes, disabilityRes] = await Promise.all([
          supabase.from('candidate_profiles').select('*').eq('user_id', userId).maybeSingle(),
          supabase.from('disability_profiles').select('*').eq('user_id', userId).maybeSingle(),
        ]);

        if (candidateRes.error) throw candidateRes.error;
        if (disabilityRes.error) throw disabilityRes.error;

        return res.json({
          success: true,
          data: {
            candidateProfile: candidateRes.data || null,
            disabilityProfile: disabilityRes.data || null,
          },
        });
      }

      // Dev Store Fallback
      const candidateProfile = devStore.candidateProfiles.get(userId) || null;
      const disabilityProfile = devStore.disabilityProfiles.get(userId) || null;

      return res.json({
        success: true,
        data: {
          candidateProfile,
          disabilityProfile,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST or PUT /api/profile/me
   * Upserts candidate profile and disability profile
   */
  async upsertProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const {
        // Candidate profile fields
        dateOfBirth,
        address,
        education,
        literacyLevel,
        skills,
        previousTraining,
        computerProficiency,
        preferredSector,
        preferredLocation,
        careerInterests,

        // Disability profile fields
        udidReference,
        disabilityCategory,
        functionalDifficulties,
        assistiveDevices,
        humanAssistanceRequirements,
      } = req.body;

      const candidatePayload = {
        user_id: userId,
        date_of_birth: dateOfBirth || null,
        address: address || null,
        education: education || null,
        literacy_level: literacyLevel || null,
        skills: skills || null,
        previous_training: previousTraining || null,
        computer_proficiency: computerProficiency || null,
        preferred_sector: preferredSector || null,
        preferred_location: preferredLocation || null,
        career_interests: careerInterests || null,
        updated_at: new Date().toISOString(),
      };

      const disabilityPayload = {
        user_id: userId,
        udid_reference: udidReference || null,
        disability_category: disabilityCategory || null,
        functional_difficulties: functionalDifficulties || {},
        assistive_devices: assistiveDevices || null,
        human_assistance_requirements: humanAssistanceRequirements || null,
        updated_at: new Date().toISOString(),
      };

      if (isConfigured && supabase) {
        const [candResult, disResult] = await Promise.all([
          supabase
            .from('candidate_profiles')
            .upsert(candidatePayload, { onConflict: 'user_id' })
            .select()
            .single(),
          supabase
            .from('disability_profiles')
            .upsert(disabilityPayload, { onConflict: 'user_id' })
            .select()
            .single(),
        ]);

        if (candResult.error) throw candResult.error;
        if (disResult.error) throw disResult.error;

        return res.json({
          success: true,
          data: {
            candidateProfile: candResult.data,
            disabilityProfile: disResult.data,
          },
          message: 'Candidate profile and support requirements saved successfully.',
        });
      }

      // Dev Store Fallback
      const candidateProfile = {
        id: 'cp-' + Date.now(),
        ...candidatePayload,
      };
      const disabilityProfile = {
        id: 'dp-' + Date.now(),
        ...disabilityPayload,
      };

      devStore.candidateProfiles.set(userId, candidateProfile);
      devStore.disabilityProfiles.set(userId, disabilityProfile);

      return res.json({
        success: true,
        data: {
          candidateProfile,
          disabilityProfile,
        },
        message: 'Candidate profile saved successfully in development store.',
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = profileController;
