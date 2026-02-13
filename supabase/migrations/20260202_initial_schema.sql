-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('counselor', 'client')),
    consent_agreed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create clients table (counselor's view of clients)
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    counselor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    nickname TEXT NOT NULL, -- Recommended to be a pseudonym
    contact_info TEXT, -- Should be encrypted in application layer or via vault
    memo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    counselor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date TIMESTAMPTZ DEFAULT NOW(),
    audio_url TEXT,
    transcript_text TEXT,
    summary_text TEXT,
    sentiment_score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tarot_cards table
CREATE TABLE public.tarot_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    image_url TEXT,
    card_name TEXT,
    position_meaning TEXT,
    interpretation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarot_cards ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Clients Policies
CREATE POLICY "Counselors can view their own clients" ON public.clients
    FOR SELECT USING (auth.uid() = counselor_id);

CREATE POLICY "Counselors can insert their own clients" ON public.clients
    FOR INSERT WITH CHECK (auth.uid() = counselor_id);

CREATE POLICY "Counselors can update their own clients" ON public.clients
    FOR UPDATE USING (auth.uid() = counselor_id);

-- Sessions Policies
CREATE POLICY "Counselors can view sessions they conducted" ON public.sessions
    FOR SELECT USING (auth.uid() = counselor_id);

CREATE POLICY "Clients can view their own sessions" ON public.sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clients
            WHERE public.clients.id = public.sessions.client_id
            AND public.clients.contact_info = (SELECT email FROM auth.users WHERE id = auth.uid())
            -- Note: Real mapping might need a better way to link client_id to auth.uid()
            -- For simplicity in this demo, we'll assume the client profile ID matches a mapping table
        )
    );

-- Better Session Policy for Clients if we link client profile to client record
-- Let's add a client_profile_id to clients table
ALTER TABLE public.clients ADD COLUMN client_profile_id UUID REFERENCES public.profiles(id);

DROP POLICY IF EXISTS "Clients can view their own sessions" ON public.sessions;
CREATE POLICY "Clients can view their own sessions" ON public.sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clients
            WHERE public.clients.id = public.sessions.client_id
            AND public.clients.client_profile_id = auth.uid()
        )
    );

CREATE POLICY "Counselors can manage sessions" ON public.sessions
    FOR ALL USING (auth.uid() = counselor_id);

-- Tarot Cards Policies
CREATE POLICY "Counselors can manage tarot cards" ON public.tarot_cards
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.sessions
            WHERE public.sessions.id = public.tarot_cards.session_id
            AND public.sessions.counselor_id = auth.uid()
        )
    );

CREATE POLICY "Clients can view tarot cards from their sessions" ON public.tarot_cards
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sessions
            JOIN public.clients ON public.sessions.client_id = public.clients.id
            WHERE public.sessions.id = public.tarot_cards.session_id
            AND public.clients.client_profile_id = auth.uid()
        )
    );

-- Trigger for profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'client'); -- Default role is client
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
