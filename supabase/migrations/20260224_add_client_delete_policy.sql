-- Add missing DELETE policy for the clients table.
-- Without this, Supabase SILENTLY blocks deletions from the UI via Row Level Security.
-- The ON DELETE CASCADE we added previously is correct for the foreign keys,
-- but the main operation on 'clients' itself was being blocked by RLS.

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Safely drop if exists to ensure idempotency
DROP POLICY IF EXISTS "Counselors can delete their own clients" ON public.clients;

-- Create DELETE policy so the authenticated counselor can delete their client
CREATE POLICY "Counselors can delete their own clients" ON public.clients
    FOR DELETE USING (auth.uid() = counselor_id);
