-- Migration: Fix client deletion by adding CASCADE to sessions and session_cards foreign keys

-- 1. Fix sessions table foreign key to clients
ALTER TABLE sessions 
DROP CONSTRAINT IF EXISTS sessions_client_id_fkey;

ALTER TABLE sessions 
ADD CONSTRAINT sessions_client_id_fkey 
FOREIGN KEY (client_id) 
REFERENCES clients(id) 
ON DELETE CASCADE;

-- 2. Fix session_cards table foreign key to sessions (if it exists under this or tarot_cards name)
-- Note: the table is named `tarot_cards` in the codebase and stores `session_id`, let's fix it safely
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'tarot_cards_session_id_fkey'
    ) THEN
        ALTER TABLE tarot_cards DROP CONSTRAINT tarot_cards_session_id_fkey;
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'tarot_cards'
    ) THEN
        ALTER TABLE tarot_cards 
        ADD CONSTRAINT tarot_cards_session_id_fkey 
        FOREIGN KEY (session_id) 
        REFERENCES sessions(id) 
        ON DELETE CASCADE;
    END IF;
END $$;
