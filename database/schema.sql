-- =========================================================================
-- UDYOG SAARTHI - DATABASE SCHEMA
-- Ministry of Social Justice and Empowerment, Government of India
-- Problem Statement 159: Employment Assistance Ecosystem for PwDs
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
-- Tracks base user account info and roles, linked to Supabase Auth
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'candidate' CHECK (role IN ('candidate', 'parent', 'job_coach', 'administrator')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CANDIDATE PROFILES TABLE
-- General educational, vocational, and career aspirations of the candidate
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    address TEXT,
    education VARCHAR(255),
    literacy_level VARCHAR(100),
    skills TEXT,
    previous_training TEXT,
    computer_proficiency VARCHAR(100),
    preferred_sector VARCHAR(255),
    preferred_location VARCHAR(255),
    career_interests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_candidate_profile UNIQUE (user_id)
);

-- 3. DISABILITY PROFILES TABLE
-- Sensitive disability category, Washington Group difficulties, and accommodations
-- Kept in a separately protected table with strict Row Level Security
CREATE TABLE IF NOT EXISTS public.disability_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    udid_reference VARCHAR(100),
    disability_category VARCHAR(255),
    functional_difficulties JSONB DEFAULT '{}'::jsonb,
    assistive_devices TEXT,
    human_assistance_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_disability_profile UNIQUE (user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_user_id ON public.candidate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_disability_profiles_user_id ON public.disability_profiles(user_id);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disability_profiles ENABLE ROW LEVEL SECURITY;

-- USERS POLICIES
CREATE POLICY "Users can read their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- CANDIDATE PROFILES POLICIES
CREATE POLICY "Candidates can read their own profile"
    ON public.candidate_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Candidates can insert their own profile"
    ON public.candidate_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Candidates can update their own profile"
    ON public.candidate_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- DISABILITY PROFILES POLICIES (Extra Protected)
CREATE POLICY "Candidates can read their own disability profile"
    ON public.disability_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Candidates can insert their own disability profile"
    ON public.disability_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Candidates can update their own disability profile"
    ON public.disability_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- =========================================================================
-- AUTOMATIC TIMESTAMP UPDATE TRIGGER
-- =========================================================================

CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_candidate_profiles_updated_at
    BEFORE UPDATE ON public.candidate_profiles
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_disability_profiles_updated_at
    BEFORE UPDATE ON public.disability_profiles
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
