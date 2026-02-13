-- Fix missing columns in sessions table (Migration 20260211_fix_sessions_schema)
-- Ensures risk_flags, sentiment_score, and review_status exist

ALTER TABLE public.sessions
    ADD COLUMN IF NOT EXISTS risk_flags TEXT[], -- e.g. {'Suicide', 'SelfHarm', 'Abuse'}
    ADD COLUMN IF NOT EXISTS sentiment_score INTEGER CHECK (sentiment_score BETWEEN 0 AND 100),
    ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'Pending' CHECK (review_status IN ('Pending', 'Approved', 'Rejected'));

-- Enhance RLS for sessions if not already present
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Ensure index on client_id for faster history lookups
CREATE INDEX IF NOT EXISTS idx_sessions_client_id ON public.sessions(client_id);
