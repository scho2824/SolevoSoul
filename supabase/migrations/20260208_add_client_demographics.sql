-- Add demographic fields to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS region TEXT;

COMMENT ON COLUMN clients.age IS 'Client age';
COMMENT ON COLUMN clients.gender IS 'Client gender (e.g., Male, Female, Non-binary, etc.)';
COMMENT ON COLUMN clients.region IS 'Client region/location (e.g., Seoul, Busan)';
