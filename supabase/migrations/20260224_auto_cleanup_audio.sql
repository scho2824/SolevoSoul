-- Enable the pg_cron extension if it's not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Add audio_files column to sessions to permanently store audio links
ALTER TABLE public.sessions
    ADD COLUMN IF NOT EXISTS audio_files JSONB DEFAULT '[]'::jsonb;

-- Create a scheduled job that runs every day at 3:00 AM
-- It deletes all objects in the 'session-audio' bucket that are older than 24 hours
-- AND are NOT linked to any saved session in the database
SELECT cron.schedule(
  'cleanup_old_session_audio',
  '0 3 * * *',
  $$
    DELETE FROM storage.objects
    WHERE bucket_id = 'session-audio'
      AND created_at < NOW() - INTERVAL '1 day'
      AND name NOT IN (
          SELECT jsonb_array_elements(audio_files)->>'path'
          FROM public.sessions
          WHERE audio_files IS NOT NULL
      );
  $$
);
