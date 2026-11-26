-- =========================================================================
-- MIGRATION 003: DEADLINE & EXAMINATION REMINDERS
-- Udyog Saarthi (Problem Statement 159) - Day 2
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    reminder_date TIMESTAMPTZ NOT NULL,
    reminder_type TEXT DEFAULT 'deadline' CHECK (reminder_type IN ('deadline', 'exam', 'admit_card', 'custom')),
    notes TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_job_reminder UNIQUE (user_id, job_id, reminder_type)
);

-- Row Level Security
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates manage their own reminders"
    ON public.reminders FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_reminders_user_date ON public.reminders(user_id, reminder_date);
