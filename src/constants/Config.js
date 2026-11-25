export const Config = {
  APP_NAME: 'Udyog Saarthi',
  TAGLINE: 'Every Ability Deserves an Opportunity',
  MINISTRY: 'Ministry of Social Justice and Empowerment, Govt. of India',
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api',
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  ROLES: {
    CANDIDATE: 'candidate',
    PARENT: 'parent',
    JOB_COACH: 'job_coach',
    ADMINISTRATOR: 'administrator',
  },
  ROLE_LABELS: {
    candidate: 'Candidate (Job Seeker with Disability)',
    parent: 'Parent / Guardian',
    job_coach: 'Job Coach / Mentor',
    administrator: 'Administrator',
  },
};
