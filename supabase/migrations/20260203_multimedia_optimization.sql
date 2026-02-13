-- Add session_audios table for multiple recordings per session
CREATE TABLE IF NOT EXISTS public.session_audios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    audio_url TEXT NOT NULL,
    file_name TEXT,
    segment_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.session_audios ENABLE ROW LEVEL SECURITY;

-- Policy for counselors to manage their own session audios
DROP POLICY IF EXISTS "Counselors can manage their session audios" ON public.session_audios;
CREATE POLICY "Counselors can manage their session audios" ON public.session_audios
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.sessions
            WHERE public.sessions.id = public.session_audios.session_id
            AND public.sessions.counselor_id = auth.uid()
        )
    );

-- Policy for clients to view session audios
DROP POLICY IF EXISTS "Clients can view their session audios" ON public.session_audios;
CREATE POLICY "Clients can view their session audios" ON public.session_audios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sessions
            JOIN public.clients ON public.sessions.client_id = public.clients.id
            WHERE public.sessions.id = public.session_audios.session_id
            AND public.clients.client_profile_id = auth.uid()
        )
    );
