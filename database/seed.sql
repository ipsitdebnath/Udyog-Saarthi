-- =========================================================================
-- UDYOG SAARTHI - SYNTHETIC SEED DATA
-- Fictional records for local development, testing and validation
-- =========================================================================

-- Fictional Candidate User
INSERT INTO public.users (id, full_name, email, phone, role)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Aarav Sharma', 'aarav.candidate@example.gov.in', '9876543210', 'candidate'),
    ('00000000-0000-0000-0000-000000000002', 'Priya Patel (Parent)', 'priya.parent@example.gov.in', '9812345678', 'parent'),
    ('00000000-0000-0000-0000-000000000003', 'Dr. Sundaram Rao', 'sundaram.coach@niepmd.gov.in', '9823456789', 'job_coach')
ON CONFLICT (id) DO NOTHING;

-- Candidate Profile for Aarav
INSERT INTO public.candidate_profiles (
    user_id,
    date_of_birth,
    address,
    education,
    literacy_level,
    skills,
    previous_training,
    computer_proficiency,
    preferred_sector,
    preferred_location,
    career_interests
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '2001-05-15',
    'Plot 42, Shanti Nagar, New Delhi - 110001',
    'Higher Secondary (12th Pass)',
    'Fluent Reading & Writing in Hindi and English',
    'Data Entry, Document Scanning, Digital Archiving, MS Office Basics',
    'NIEPMD Vocational Data Management Course (6 Months)',
    'Basic to Intermediate (Typing speed 30 WPM)',
    'Public Sector Undertakings (PSU) & Government Offices',
    'Delhi NCR',
    'Junior Assistant, Data Entry Operator, Record Keeper'
)
ON CONFLICT (user_id) DO NOTHING;

-- Disability Profile for Aarav
INSERT INTO public.disability_profiles (
    user_id,
    udid_reference,
    disability_category,
    functional_difficulties,
    assistive_devices,
    human_assistance_requirements
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'DL0120230009874',
    'Autism Spectrum Disorder & Specific Learning Disability',
    '{
        "seeing": "no_difficulty",
        "hearing": "no_difficulty",
        "walking": "no_difficulty",
        "cognition_remembering": "some_difficulty",
        "self_care": "no_difficulty",
        "communication": "some_difficulty"
    }'::jsonb,
    'Noise-cancelling headphones for loud examination halls, Screen reader with text-to-speech',
    'Scribe and extra compensatory time for written exams; clear written instructions during workplace tasks'
)
ON CONFLICT (user_id) DO NOTHING;
