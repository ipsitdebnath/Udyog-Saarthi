const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseKey &&
  supabaseKey !== 'your-service-role-key-here' &&
  supabaseKey !== 'your-anon-key-here'
);

let supabase = null;
if (isConfigured) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('[Database] Connected to remote Supabase instance:', supabaseUrl);
} else {
  console.log('[Database] Remote Supabase not configured in server .env. Running with verified local memory store.');
}

// Optional direct PostgreSQL Pool if DATABASE_URL is provided
let pool = null;
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('your-project')) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    console.log('[Database] Direct PostgreSQL pool initialized.');
  } catch (err) {
    console.warn('[Database] PostgreSQL pool error:', err.message);
  }
}

// In-Memory Development Store (Pre-populated with synthetic development seed)
const devStore = {
  users: new Map([
    [
      '00000000-0000-0000-0000-000000000001',
      {
        id: '00000000-0000-0000-0000-000000000001',
        full_name: 'Aarav Sharma',
        email: 'aarav.candidate@example.gov.in',
        phone: '9876543210',
        role: 'candidate',
        created_at: new Date().toISOString(),
      },
    ],
  ]),
  candidateProfiles: new Map([
    [
      '00000000-0000-0000-0000-000000000001',
      {
        id: 'cp-001',
        user_id: '00000000-0000-0000-0000-000000000001',
        date_of_birth: '2001-05-15',
        address: 'Plot 42, Shanti Nagar, New Delhi - 110001',
        education: 'Higher Secondary (12th Pass)',
        literacy_level: 'Fluent Reading & Writing in Hindi and English',
        skills: 'Data Entry, Document Scanning, Digital Archiving, MS Office Basics',
        previous_training: 'NIEPMD Vocational Data Management Course (6 Months)',
        computer_proficiency: 'Basic to Intermediate (Typing speed 30 WPM)',
        preferred_sector: 'Public Sector Undertakings (PSU) & Government Offices',
        preferred_location: 'Delhi NCR',
        career_interests: 'Junior Assistant, Data Entry Operator, Record Keeper',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  ]),
  disabilityProfiles: new Map([
    [
      '00000000-0000-0000-0000-000000000001',
      {
        id: 'dp-001',
        user_id: '00000000-0000-0000-0000-000000000001',
        udid_reference: 'DL0120230009874',
        disability_category: 'Autism Spectrum Disorder & Specific Learning Disability',
        functional_difficulties: {
          seeing: 'no_difficulty',
          hearing: 'no_difficulty',
          walking: 'no_difficulty',
          cognition_remembering: 'some_difficulty',
          self_care: 'no_difficulty',
          communication: 'some_difficulty',
        },
        assistive_devices: 'Noise-cancelling headphones, Screen reader with text-to-speech',
        human_assistance_requirements: 'Scribe and extra compensatory time for written exams',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  ]),
};

module.exports = {
  supabase,
  pool,
  isConfigured,
  devStore,
};
