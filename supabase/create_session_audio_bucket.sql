-- Note: If you receive "ERROR: 42501: must be owner of table objects",
-- you cannot run ALTER TABLE or DROP POLICY from the SQL Editor.
-- In that case, simply create the bucket using this script,
-- and then create the policies manually via the Supabase Dashboard -> Storage -> Policies UI.

-- 1. Insert the session-audio bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('session-audio', 'session-audio', true)
ON CONFLICT (id) DO NOTHING;
