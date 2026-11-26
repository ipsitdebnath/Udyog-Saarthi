-- =========================================================================
-- MIGRATION 002: JOBS, SAVED JOBS & JOB APPLICATIONS
-- Udyog Saarthi (Problem Statement 159) - Day 2
-- =========================================================================

-- 1. JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    sector TEXT NOT NULL CHECK (sector IN ('Government', 'PSU', 'Private Sector')),
    location TEXT NOT NULL,
    description TEXT,
    simplified_description TEXT,
    education_requirements JSONB DEFAULT '[]'::jsonb,
    required_skills JSONB DEFAULT '[]'::jsonb,
    eligible_disability_categories JSONB DEFAULT '[]'::jsonb,
    reservation_details JSONB DEFAULT '{}'::jsonb,
    vacancy_details JSONB DEFAULT '{}'::jsonb,
    age_requirement TEXT,
    employment_type TEXT DEFAULT 'Full-time',
    examination_details TEXT,
    required_documents JSONB DEFAULT '[]'::jsonb,
    application_deadline TIMESTAMPTZ,
    notification_url TEXT,
    official_application_url TEXT,
    source_name TEXT,
    source_verified_at TIMESTAMPTZ,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. SAVED JOBS TABLE
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_saved_job UNIQUE (user_id, job_id)
);

-- 3. JOB APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'applied' CHECK (
        status IN ('saved', 'applied', 'examination', 'interview', 'selected', 'placed', 'rejected', 'withdrawn', 'on_hold')
    ),
    applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_job_application UNIQUE (user_id, job_id)
);

-- Indexes for search and query performance
CREATE INDEX IF NOT EXISTS idx_jobs_sector ON public.jobs(sector);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON public.jobs(application_deadline);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON public.saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.job_applications(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- RLS: Jobs can be viewed by all authenticated users
CREATE POLICY "Anyone can view jobs"
    ON public.jobs FOR SELECT
    USING (true);

-- RLS: Candidates can only manage their own saved jobs
CREATE POLICY "Users can manage their saved jobs"
    ON public.saved_jobs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- RLS: Candidates can only manage their own applications
CREATE POLICY "Users can manage their applications"
    ON public.job_applications FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Update triggers for updated_at
CREATE TRIGGER trg_jobs_updated_at
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_job_applications_updated_at
    BEFORE UPDATE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
