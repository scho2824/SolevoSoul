-- Add status column to clients table for soft deletion
ALTER TABLE public.clients
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
