-- Fix missing columns in clients table
-- This is a safety migration to ensure schema is consistent

ALTER TABLE public.clients 
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Archived', 'Banned')),
    ADD COLUMN IF NOT EXISTS phone_encrypted TEXT,
    ADD COLUMN IF NOT EXISTS phone_hash TEXT,
    ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Update RLS if needed (ensure readable)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Counselors can view their own clients" ON public.clients
    FOR SELECT USING (auth.uid() = counselor_id);

CREATE POLICY "Counselors can insert their own clients" ON public.clients
    FOR INSERT WITH CHECK (auth.uid() = counselor_id);

CREATE POLICY "Counselors can update their own clients" ON public.clients
    FOR UPDATE USING (auth.uid() = counselor_id);
