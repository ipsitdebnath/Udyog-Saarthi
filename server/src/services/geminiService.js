/**
 * Gemini AI Service for Udyog Saarthi
 * Translates dense, complex recruitment circulars and official gazette notifications
 * into plain-language, accessible summaries for candidates with disabilities.
 */

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Validates and ensures structured shape for the AI simplification output
 */
function validateSimplificationShape(parsed, job) {
  return {
    simpleTitle: parsed.simpleTitle || job.title,
    whatThisJobMeans:
      parsed.whatThisJobMeans ||
      job.simplified_description ||
      `This is an opportunity for ${job.title} at ${job.organization} in ${job.location}. The role involves supporting ${job.sector} operations.`,
    whoCanApply:
      Array.isArray(parsed.whoCanApply) && parsed.whoCanApply.length > 0
        ? parsed.whoCanApply
        : job.education_requirements || [
            'Candidates meeting the prescribed educational qualifications and age criteria',
          ],
    skillsRequired:
      Array.isArray(parsed.skillsRequired) && parsed.skillsRequired.length > 0
        ? parsed.skillsRequired
        : job.required_skills || ['Basic communication and role-relevant domain skills'],
    importantDates:
      Array.isArray(parsed.importantDates) && parsed.importantDates.length > 0
        ? parsed.importantDates
        : [
            {
              label: 'Application Deadline',
              date: job.application_deadline
                ? new Date(job.application_deadline).toISOString().split('T')[0]
                : 'Refer to official circular',
            },
          ],
    documentsRequired:
      Array.isArray(parsed.documentsRequired) && parsed.documentsRequired.length > 0
        ? parsed.documentsRequired
        : job.required_documents || [
            '10th / 12th / Degree certificates',
            'Disability certificate or Unique Disability ID (UDID) card',
            'Government photo ID (Aadhaar / Voter ID)',
            'Recent passport-sized photographs',
          ],
    stepsToApply:
      Array.isArray(parsed.stepsToApply) && parsed.stepsToApply.length > 0
        ? parsed.stepsToApply
        : [
            'Review this simplified summary and verify official notification terms',
            'Ensure all required certificates and UDID card are scanned and ready',
            'Click on "Apply on Official Portal" to navigate to the recruitment website',
            'Complete candidate registration and note down your registration number',
            'Fill online application form and upload scanned documents',
            'Submit application before the specified deadline and save a copy',
          ],
    thingsToRemember:
      Array.isArray(parsed.thingsToRemember) && parsed.thingsToRemember.length > 0
        ? parsed.thingsToRemember
        : [
            job.reservation_details?.quota
              ? `PwD Reservation Quota: ${job.reservation_details.quota}`
              : 'Disability reservation benefits apply as per Government of India guidelines',
            job.reservation_details?.ageRelaxation ||
              'Age relaxation is applicable for PwD candidates as per official rules',
            job.reservation_details?.scribeFacility
              ? 'Scribe assistance and compensatory exam time are guaranteed under RPwD Act 2016'
              : 'Check examination center accessibility guidelines prior to test date',
            'Never share OTP or banking credentials for job application fees',
          ],
    disclaimer:
      parsed.disclaimer ||
      'This is a simplified AI explanation created by Udyog Saarthi. Verify all eligibility criteria and recruitment rules using the official recruitment notification.',
  };
}

/**
 * Generates an intelligent, rule-based simplification if Gemini API key is missing or offline
 */
function generateStructuredFallback(job) {
  const deadlineStr = job.application_deadline
    ? new Date(job.application_deadline).toISOString().split('T')[0]
    : 'Refer to official circular';

  return {
    simpleTitle: `${job.title} (${job.sector})`,
    whatThisJobMeans:
      job.simplified_description ||
      `This position at ${job.organization} located in ${job.location} provides employment in the ${job.sector} sector. Your work will focus on day-to-day operations and assigned organizational responsibilities in an inclusive environment.`,
    whoCanApply:
      job.education_requirements && job.education_requirements.length > 0
        ? job.education_requirements
        : ['Candidates matching the specified educational qualifications'],
    skillsRequired:
      job.required_skills && job.required_skills.length > 0
        ? job.required_skills
        : ['Basic professional competencies and task-specific skills'],
    importantDates: [
      {
        label: 'Application Deadline',
        date: deadlineStr,
      },
      {
        label: 'Source Verification Date',
        date: job.source_verified_at
          ? new Date(job.source_verified_at).toISOString().split('T')[0]
          : 'Verified Recently',
      },
    ],
    documentsRequired:
      job.required_documents && job.required_documents.length > 0
        ? job.required_documents
        : [
            'Educational marksheets & certificates',
            'Disability Certificate / UDID card',
            'Identity proof (Aadhaar / Voter ID)',
            'Passport-size photograph',
          ],
    stepsToApply: [
      '1. Review the verified summary and confirm your eligibility',
      '2. Gather your UDID card, certificates, and ID proof',
      '3. Open the official recruitment portal link provided',
      '4. Complete the online registration form accurately',
      '5. Upload required documents and submit before the deadline',
    ],
    thingsToRemember: [
      job.reservation_details?.quota
        ? `Reservation quota: ${job.reservation_details.quota}`
        : 'Disability reservation applies as per official rules',
      job.reservation_details?.ageRelaxation ||
        'Age relaxation is available for eligible candidates',
      job.reservation_details?.scribeFacility
        ? 'Scribe assistance & 20 min/hour compensatory time are provided'
        : 'Exam accessibility provisions are governed by RPwD Act 2016',
      'Always refer to the official gazette/circular for binding terms',
    ],
    disclaimer:
      'This is a simplified explanation. Verify all eligibility and recruitment information using the official notification.',
  };
}

/**
 * Simplifies a job notification using Gemini AI or structured fallback
 * @param {Object} job - Complete job record from database
 * @returns {Promise<Object>} Structured simplification JSON
 */
async function simplifyNotification(job) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    console.log('[GeminiService] No GEMINI_API_KEY found. Generating structured fallback.');
    return generateStructuredFallback(job);
  }

  const prompt = `
You are an expert accessibility counselor and legal simplifier for "Udyog Saarthi", the Government of India platform for Persons with Disabilities (PwDs).
Your task is to translate the following official job notification into plain, clear, accessible language suitable for candidates with various educational backgrounds and disabilities.

Job Details:
- Title: ${job.title}
- Organization: ${job.organization}
- Sector: ${job.sector}
- Location: ${job.location}
- Employment Type: ${job.employment_type || 'Regular'}
- Description: ${job.description}
- Education Requirements: ${JSON.stringify(job.education_requirements)}
- Required Skills: ${JSON.stringify(job.required_skills)}
- Eligible Disability Categories: ${JSON.stringify(job.eligible_disability_categories)}
- Reservation & Facilities: ${JSON.stringify(job.reservation_details)}
- Vacancy: ${JSON.stringify(job.vacancy_details)}
- Age Requirement: ${job.age_requirement}
- Application Deadline: ${job.application_deadline}

Output Requirement:
You must respond with ONLY valid JSON with no markdown backticks, matching this exact schema:
{
  "simpleTitle": "Clear, friendly job title",
  "whatThisJobMeans": "A simple 1-2 sentence explanation of what the candidate will actually do every day",
  "whoCanApply": ["Point 1", "Point 2"],
  "skillsRequired": ["Skill 1", "Skill 2"],
  "importantDates": [{"label": "Application deadline", "date": "YYYY-MM-DD"}],
  "documentsRequired": ["Document 1", "Document 2"],
  "stepsToApply": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "thingsToRemember": ["Important condition 1", "Reservation/scribe note"],
  "disclaimer": "This is a simplified explanation. Verify all eligibility and recruitment information using the official notification."
}
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.warn(`[GeminiService] API error (${response.status}):`, errBody);
      return generateStructuredFallback(job);
    }

    const data = await response.json();
    const candidateText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Strip markdown fences if present
    const cleaned = candidateText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);
    return validateSimplificationShape(parsed, job);
  } catch (err) {
    console.error('[GeminiService] Error calling Gemini API or parsing response:', err.message);
    return generateStructuredFallback(job);
  }
}

module.exports = {
  simplifyNotification,
  validateSimplificationShape,
  generateStructuredFallback,
};
