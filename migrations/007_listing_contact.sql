-- Per-listing enquiry contact and source tracking for externally sourced listings
-- (e.g. listings synced from baliboundrealty.com). NULL contact fields fall back
-- to the site's default contact on the listing page.

ALTER TABLE properties
    ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS contact_company VARCHAR(255),
    ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
    ADD COLUMN IF NOT EXISTS contact_whatsapp VARCHAR(50),
    ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS source_url TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS properties_source_url_unique
    ON properties (source_url) WHERE source_url IS NOT NULL;
