-- Phase 6: Universal Waite Deck Enhancement
-- Creates tables for 78-card tarot deck and session-card linking

-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Table: tarot_deck_data
-- Stores all 78 Universal Waite cards (Major + Minor Arcana)
CREATE TABLE IF NOT EXISTS tarot_deck_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_kr TEXT NOT NULL,
    suit TEXT, -- NULL for Major Arcana, 'wands'/'cups'/'swords'/'pentacles' for Minor
    number INTEGER, -- 0-21 for Major, 1-14 for Minor (11=Page, 12=Knight, 13=Queen, 14=King)
    arcana_type TEXT NOT NULL CHECK (arcana_type IN ('major', 'minor')),
    image_url TEXT,
    keywords TEXT[], -- Array of key themes
    description_upright TEXT,
    description_reversed TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: session_cards
-- Links drawn cards to counseling sessions
CREATE TABLE IF NOT EXISTS session_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES tarot_deck_data(id),
    position_index INTEGER NOT NULL, -- 0, 1, 2 for 3-card spread, etc.
    position_meaning TEXT, -- e.g., 'Past', 'Present', 'Future'
    is_reversed BOOLEAN DEFAULT FALSE,
    user_notes TEXT, -- Counselor's interpretation notes
    drawn_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, position_index) -- Prevent duplicate positions in same session
);

-- Add encryption function for sensitive data
-- Encrypts contact_info in clients table
ALTER TABLE clients 
    ALTER COLUMN contact_info TYPE TEXT;

-- Add interpretation_text column to sessions if not exists
-- (stores overall tarot reading interpretation)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sessions' AND column_name = 'interpretation_text'
    ) THEN
        ALTER TABLE sessions ADD COLUMN interpretation_text TEXT;
    END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_session_cards_session_id ON session_cards(session_id);
CREATE INDEX IF NOT EXISTS idx_session_cards_card_id ON session_cards(card_id);
CREATE INDEX IF NOT EXISTS idx_tarot_deck_arcana ON tarot_deck_data(arcana_type);
CREATE INDEX IF NOT EXISTS idx_tarot_deck_suit ON tarot_deck_data(suit);

-- Row Level Security (RLS) for session_cards
ALTER TABLE session_cards ENABLE ROW LEVEL SECURITY;

-- Policy: Counselors can only see cards from their own sessions
CREATE POLICY "Counselors can view their own session cards"
    ON session_cards
    FOR SELECT
    USING (
        session_id IN (
            SELECT s.id FROM sessions s
            JOIN clients c ON s.client_id = c.id
            WHERE c.counselor_id = auth.uid()
        )
    );

-- Policy: Counselors can insert cards into their own sessions
CREATE POLICY "Counselors can insert cards into their sessions"
    ON session_cards
    FOR INSERT
    WITH CHECK (
        session_id IN (
            SELECT s.id FROM sessions s
            JOIN clients c ON s.client_id = c.id
            WHERE c.counselor_id = auth.uid()
        )
    );

-- Policy: Counselors can update their session cards
CREATE POLICY "Counselors can update their session cards"
    ON session_cards
    FOR UPDATE
    USING (
        session_id IN (
            SELECT s.id FROM sessions s
            JOIN clients c ON s.client_id = c.id
            WHERE c.counselor_id = auth.uid()
        )
    );

-- RLS for tarot_deck_data (public read)
ALTER TABLE tarot_deck_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tarot deck data"
    ON tarot_deck_data
    FOR SELECT
    USING (true);

-- Comments for documentation
COMMENT ON TABLE tarot_deck_data IS 'Universal Waite 78-card tarot deck metadata';
COMMENT ON TABLE session_cards IS 'Links drawn tarot cards to counseling sessions with position and reversal info';
COMMENT ON COLUMN session_cards.position_index IS 'Card position in spread (0-based index)';
COMMENT ON COLUMN session_cards.is_reversed IS 'Whether the card was drawn in reversed position';
