/**
 * Matching Service for Udyog Saarthi
 * Computes transparent, positive job match scores based on candidate profile.
 *
 * Mandate:
 * - Disability category must NEVER penalize a candidate.
 * - Reservation provisions expand opportunities, never restrict them.
 * - Matching logic must provide clear, human-understandable reasons.
 */

/**
 * Calculates a match score and reasons for a job given a candidate profile
 * @param {Object} candidate - Candidate user/profile object
 * @param {Object} job - Opportunity record
 * @returns {{ matchScore: number, matchReasons: string[] }}
 */
function scoreJobForCandidate(candidate = {}, job) {
  let score = 55; // Baseline compatibility score
  const reasons = [];

  const candidateSkills = Array.isArray(candidate.skills)
    ? candidate.skills.map((s) => s.toLowerCase().trim())
    : [];
  const candidateEducation = (candidate.highest_qualification || candidate.education || '').toLowerCase();
  const candidateLocation = (candidate.preferred_location || candidate.state || candidate.city || '').toLowerCase();
  const candidateSector = (candidate.preferred_sector || '').toLowerCase();

  // 1. Education Qualification Matching
  const jobEducations = Array.isArray(job.education_requirements)
    ? job.education_requirements.map((e) => e.toLowerCase())
    : [];

  const isGrad = candidateEducation.includes('graduate') || candidateEducation.includes('bachelor') || candidateEducation.includes('b.');
  const is12th = isGrad || candidateEducation.includes('12th') || candidateEducation.includes('higher secondary') || candidateEducation.includes('hsc');
  const is10th = is12th || candidateEducation.includes('10th') || candidateEducation.includes('matric');

  let educationMatched = false;
  if (jobEducations.length > 0) {
    if (jobEducations.some((e) => e.includes('10th') || e.includes('matric')) && is10th) {
      educationMatched = true;
    } else if (jobEducations.some((e) => e.includes('12th') || e.includes('higher secondary')) && is12th) {
      educationMatched = true;
    } else if (jobEducations.some((e) => e.includes('graduate') || e.includes('degree')) && isGrad) {
      educationMatched = true;
    } else if (jobEducations.some((e) => candidateEducation && e.includes(candidateEducation))) {
      educationMatched = true;
    }
  } else {
    // No specific education barrier specified
    educationMatched = true;
  }

  if (educationMatched) {
    score += 15;
    reasons.push(
      candidate.highest_qualification
        ? `Meets minimum education qualification requirement (${candidate.highest_qualification})`
        : 'Meets minimum educational qualification requirements'
    );
  }

  // 2. Skills Overlap Matching
  const jobSkills = Array.isArray(job.required_skills)
    ? job.required_skills.map((s) => s.toLowerCase())
    : [];

  const matchedSkills = [];
  jobSkills.forEach((js) => {
    if (candidateSkills.some((cs) => js.includes(cs) || cs.includes(js))) {
      matchedSkills.push(js);
    }
  });

  if (matchedSkills.length > 0) {
    const boost = Math.min(20, matchedSkills.length * 8);
    score += boost;
    reasons.push(
      `Matches ${matchedSkills.length} of your registered competencies`
    );
  } else if (jobSkills.length > 0) {
    // Default transferable skills boost
    reasons.push('Includes accessible on-the-job training and skill development');
  }

  // 3. Location Matching
  const jobLoc = (job.location || '').toLowerCase();
  if (
    jobLoc.includes('pan india') ||
    jobLoc.includes('remote') ||
    (candidateLocation && (jobLoc.includes(candidateLocation) || candidateLocation.includes(jobLoc)))
  ) {
    score += 10;
    reasons.push(`Accessible location in your preferred geographical zone (${job.location})`);
  }

  // 4. Sector Alignment
  const jobSector = (job.sector || '').toLowerCase();
  if (candidateSector && jobSector.includes(candidateSector)) {
    score += 5;
    reasons.push(`Directly aligns with your preferred ${job.sector} sector`);
  }

  // 5. Disability Inclusion & Accommodation Provisions
  // Reservation provisions always EXPAND opportunity, never penalize
  if (job.reservation_details?.quota) {
    reasons.push(`Verified PwD reservation quota: ${job.reservation_details.quota}`);
  }
  if (job.reservation_details?.scribeFacility) {
    reasons.push('Guaranteed scribe facility & compensatory exam time provisions');
  }

  // Cap score between 60 and 98
  const clampedScore = Math.min(98, Math.max(60, score));

  return {
    matchScore: clampedScore,
    matchReasons: reasons.length > 0 ? reasons : ['Compatible inclusive opportunity based on profile parameters'],
  };
}

/**
 * Ranks all available jobs for a candidate profile
 * @param {Object} candidate - Candidate user/profile
 * @param {Array<Object>} allJobs - List of all job records
 * @returns {Array<{ job: Object, matchScore: number, matchReasons: string[] }>}
 */
function rankJobsForCandidate(candidate, allJobs = []) {
  const ranked = allJobs.map((job) => {
    const { matchScore, matchReasons } = scoreJobForCandidate(candidate, job);
    return {
      job,
      matchScore,
      matchReasons,
    };
  });

  // Sort descending by matchScore
  return ranked.sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = {
  scoreJobForCandidate,
  rankJobsForCandidate,
};
