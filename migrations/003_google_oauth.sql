-- =============================================================================
-- Google OAuth Support
-- Adds Google ID column and makes password_hash nullable for Google-only users
-- =============================================================================

-- Make password_hash nullable for Google-only users (who never set a password)
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Add Google ID for OAuth account linking
ALTER TABLE users ADD COLUMN google_id VARCHAR(255);
ALTER TABLE users ADD CONSTRAINT users_google_id_unique UNIQUE (google_id);
CREATE INDEX idx_users_google_id ON users (google_id);
