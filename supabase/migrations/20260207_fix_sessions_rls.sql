-- Fix RLS policies to ensure Clients can view their own sessions
-- This is necessary if the initial_schema.sql changes were not applied

-- 1. Ensure client_profile_id exists in clients table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'client_profile_id'
    ) THEN
        ALTER TABLE clients ADD COLUMN client_profile_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- 2. Update RLS Policy for Sessions
-- Drop potentially old or incorrect policies
DROP POLICY IF EXISTS "Clients can view their own sessions" ON sessions;

-- Create correct policy linking session -> client -> client_profile_id -> auth.uid()
CREATE POLICY "Clients can view their own sessions" ON sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM clients
            WHERE clients.id = sessions.client_id
            AND clients.client_profile_id = auth.uid()
        )
    );

-- 3. Update RLS Policy for Tarot Cards (Session Cards)
-- session_cards table (created in 20260207_tarot_deck_enhancement.sql)
-- We need to ensure clients can view cards for their sessions

DROP POLICY IF EXISTS "Clients can view their own session cards" ON session_cards;

CREATE POLICY "Clients can view their own session cards"
    ON session_cards
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sessions
            JOIN clients ON sessions.client_id = clients.id
            WHERE sessions.id = session_cards.session_id
            AND clients.client_profile_id = auth.uid()
        )
    );
