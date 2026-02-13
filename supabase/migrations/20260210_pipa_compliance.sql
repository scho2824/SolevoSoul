-- Ultra-strict PIPA (Personal Information Protection Act) Compliance Migration
-- Created: 2026-02-10

-- 1. Audit Logs (PIPA Requirement: Access Logs)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id), -- Nullable for system actions, but mostly for counselors
    action TEXT NOT NULL CHECK (action IN ('VIEW', 'EDIT', 'EXPORT', 'LOGIN', 'LOGOUT', 'DELETE')),
    resource_table TEXT NOT NULL,
    resource_id UUID NOT NULL,
    ip_address TEXT, -- PIPA Requirement: Log IP
    user_agent TEXT,
    details JSONB, -- Store changed fields or snapshot
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Audit Logs: Only admins or system can insert. Counselors can view their own logs?
-- Actually, for strict security, logs should be append-only and not deletable by normal users.
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true); -- Ideally restricted to service role, but for now allow app to insert via RPC/Edge Function

CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
    
-- 2. Update Clients Table (Encryption & Tagging)
ALTER TABLE public.clients 
    ADD COLUMN IF NOT EXISTS phone_encrypted TEXT, -- AES-256 encrypted string
    ADD COLUMN IF NOT EXISTS phone_hash TEXT, -- SHA-256 hash for searching
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Archived', 'Banned')),
    ADD COLUMN IF NOT EXISTS tags TEXT[]; -- Array of strings e.g. {'Reunion', 'Career'}

-- Create index for faster searching on hash
CREATE INDEX IF NOT EXISTS idx_clients_phone_hash ON public.clients(phone_hash);

-- Start migrating existing phone/contact_info if exists (This would likely be a manual script or Edge Function in production)
-- For MVP, we assume new data will populate these fields.

-- 3. Update Sessions Table (Risk & Review)
ALTER TABLE public.sessions
    ADD COLUMN IF NOT EXISTS risk_flags TEXT[], -- e.g. {'Suicide', 'SelfHarm', 'Abuse'}
    ADD COLUMN IF NOT EXISTS sentiment_score INTEGER CHECK (sentiment_score BETWEEN 0 AND 100),
    ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'Pending' CHECK (review_status IN ('Pending', 'Approved', 'Rejected'));

-- 4. Strict RLS Refinements
-- Call this function to log access (to be used in application layer or via triggers if possible, but application layer often easier for 'VIEW')

-- Prevent hard deletion of clients (PIPA: Retention period management usually requires soft delete first)
-- We'll use the 'Archived' status for now.

-- Trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- PIPA: Consent Timestamp
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS privacy_policy_agreed_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sensitive_info_agreed_at TIMESTAMPTZ;
