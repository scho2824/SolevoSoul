-- Add counselor_memo column to sessions table
-- This allows counselors to securely save private notes for each session.

ALTER TABLE public.sessions 
    ADD COLUMN IF NOT EXISTS counselor_memo TEXT;
