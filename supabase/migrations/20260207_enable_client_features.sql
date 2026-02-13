-- Enable RLS policies for Self-Service Client usage
-- This allows clients to create their own profiles, sessions, and cards.

-- 1. CLIENTS TABLE POLICIES
-- Allow clients to view their own record
DROP POLICY IF EXISTS "Clients can view their own record" ON clients;
CREATE POLICY "Clients can view their own record" ON clients
    FOR SELECT
    USING (client_profile_id = auth.uid());

-- Allow clients to register themselves
DROP POLICY IF EXISTS "Users can register themselves as clients" ON clients;
CREATE POLICY "Users can register themselves as clients" ON clients
    FOR INSERT
    WITH CHECK (client_profile_id = auth.uid());

-- 2. SESSIONS TABLE POLICIES
-- Allow clients to create sessions for themselves
DROP POLICY IF EXISTS "Clients can create their own sessions" ON sessions;
CREATE POLICY "Clients can create their own sessions" ON sessions
    FOR INSERT
    WITH CHECK (
        client_id IN (
            SELECT id FROM clients WHERE client_profile_id = auth.uid()
        )
    );

-- Note: SELECT policy was already handled in previous fix, but ensuring it's comprehensive
DROP POLICY IF EXISTS "Clients can view their own sessions" ON sessions;
CREATE POLICY "Clients can view their own sessions" ON sessions
    FOR SELECT
    USING (
         client_id IN (
            SELECT id FROM clients WHERE client_profile_id = auth.uid()
        )
    );

-- 3. SESSION_CARDS TABLE POLICIES
-- Allow clients to insert cards for their sessions
DROP POLICY IF EXISTS "Clients can insert their own session cards" ON session_cards;
CREATE POLICY "Clients can insert their own session cards" ON session_cards
    FOR INSERT
    WITH CHECK (
        session_id IN (
            SELECT id FROM sessions 
            WHERE client_id IN (
                SELECT id FROM clients WHERE client_profile_id = auth.uid()
            )
        )
    );

-- Ensure SELECT policy exists (same as previous fix)
DROP POLICY IF EXISTS "Clients can view their own session cards" ON session_cards;
CREATE POLICY "Clients can view their own session cards" ON session_cards
    FOR SELECT
    USING (
        session_id IN (
            SELECT id FROM sessions 
            WHERE client_id IN (
                SELECT id FROM clients WHERE client_profile_id = auth.uid()
            )
        )
    );
