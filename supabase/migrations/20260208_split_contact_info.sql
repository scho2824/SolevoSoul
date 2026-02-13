-- Create migration to add phone and email to clients
ALTER TABLE public.clients ADD COLUMN phone TEXT;
ALTER TABLE public.clients ADD COLUMN email TEXT;
