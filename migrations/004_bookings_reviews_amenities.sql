-- =============================================================================
-- Migration 004: Bookings, Reviews, Amenities, and Listing Enhancements
-- Adds booking system, guest reviews, standardized amenities, property rules,
-- pricing tiers, cancellation policies, and availability tracking
-- =============================================================================

-- ---------------------------------------------------------------------------
-- New ENUM types
-- ---------------------------------------------------------------------------

CREATE TYPE booking_status AS ENUM (
    'pending',
    'confirmed',
    'checked_in',
    'checked_out',
    'cancelled',
    'refunded'
);

CREATE TYPE cancellation_policy_type AS ENUM (
    'flexible',
    'moderate',
    'strict',
    'non_refundable'
);

CREATE TYPE rental_duration_type AS ENUM (
    'nightly',
    'weekly',
    'monthly',
    'yearly'
);

-- ---------------------------------------------------------------------------
-- Amenities: standardized amenity set for Airbnb-style icons
-- ---------------------------------------------------------------------------
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL,            -- icon identifier (e.g., 'pool', 'spa', 'gym')
    category VARCHAR(100) NOT NULL,       -- e.g., 'outdoor', 'wellness', 'essentials'
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Property-amenity junction table
CREATE TABLE property_amenities (
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, amenity_id)
);

CREATE INDEX idx_property_amenities_property ON property_amenities (property_id);
CREATE INDEX idx_property_amenities_amenity ON property_amenities (amenity_id);

-- Seed standard amenities
INSERT INTO amenities (slug, name, icon, category, sort_order) VALUES
    ('pool', 'Swimming Pool', 'pool', 'outdoor', 1),
    ('private-pool', 'Private Pool', 'pool', 'outdoor', 2),
    ('infinity-pool', 'Infinity Pool', 'pool', 'outdoor', 3),
    ('spa', 'Spa', 'spa', 'wellness', 10),
    ('gym', 'Gym / Fitness', 'gym', 'wellness', 11),
    ('yoga-deck', 'Yoga Deck', 'yoga', 'wellness', 12),
    ('sauna', 'Sauna', 'sauna', 'wellness', 13),
    ('wifi', 'High-Speed WiFi', 'wifi', 'essentials', 20),
    ('ac', 'Air Conditioning', 'ac', 'essentials', 21),
    ('kitchen', 'Full Kitchen', 'kitchen', 'essentials', 22),
    ('washer', 'Washer / Dryer', 'washer', 'essentials', 23),
    ('tv', 'Smart TV', 'tv', 'essentials', 24),
    ('parking', 'Free Parking', 'parking', 'outdoor', 30),
    ('garden', 'Tropical Garden', 'garden', 'outdoor', 31),
    ('bbq', 'BBQ Area', 'bbq', 'outdoor', 32),
    ('ocean-view', 'Ocean View', 'ocean-view', 'views', 40),
    ('rice-field-view', 'Rice Field View', 'rice-field', 'views', 41),
    ('mountain-view', 'Mountain View', 'mountain', 'views', 42),
    ('beachfront', 'Beachfront', 'beach', 'location', 50),
    ('security', '24/7 Security', 'security', 'safety', 60),
    ('cctv', 'CCTV', 'cctv', 'safety', 61),
    ('staff', 'Housekeeping Staff', 'staff', 'services', 70),
    ('chef', 'Private Chef Available', 'chef', 'services', 71),
    ('airport-transfer', 'Airport Transfer', 'car', 'services', 72),
    ('pet-friendly', 'Pet Friendly', 'pet', 'policies', 80),
    ('kid-friendly', 'Kid Friendly', 'child', 'policies', 81);

-- ---------------------------------------------------------------------------
-- Property rules & policies (per-listing owner rules)
-- ---------------------------------------------------------------------------
CREATE TABLE property_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

    -- Check-in/out
    check_in_time TIME DEFAULT '14:00',
    check_out_time TIME DEFAULT '11:00',

    -- House rules
    max_guests INTEGER DEFAULT 2,
    pets_allowed BOOLEAN DEFAULT false,
    smoking_allowed BOOLEAN DEFAULT false,
    parties_allowed BOOLEAN DEFAULT false,
    quiet_hours_start TIME DEFAULT '22:00',
    quiet_hours_end TIME DEFAULT '07:00',
    custom_rules TEXT,                    -- Free-text additional rules

    -- Cancellation
    cancellation_policy cancellation_policy_type NOT NULL DEFAULT 'moderate',
    cancellation_details TEXT,            -- Custom cancellation text

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT property_rules_unique UNIQUE (property_id)
);

CREATE TRIGGER trigger_property_rules_updated_at
    BEFORE UPDATE ON property_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Pricing tiers (multiple pricing options per property)
-- ---------------------------------------------------------------------------
CREATE TABLE pricing_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    duration_type rental_duration_type NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    min_duration INTEGER DEFAULT 1,       -- Minimum stay in units of duration_type
    max_duration INTEGER,                 -- NULL = no maximum
    cleaning_fee DECIMAL(10, 2) DEFAULT 0,
    service_fee_percent DECIMAL(5, 2) DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pricing_tiers_price_positive CHECK (price >= 0),
    CONSTRAINT pricing_tiers_cleaning_positive CHECK (cleaning_fee >= 0)
);

CREATE INDEX idx_pricing_tiers_property ON pricing_tiers (property_id);
CREATE INDEX idx_pricing_tiers_active ON pricing_tiers (property_id, is_active) WHERE is_active = true;

CREATE TRIGGER trigger_pricing_tiers_updated_at
    BEFORE UPDATE ON pricing_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Additional services (per property)
-- ---------------------------------------------------------------------------
CREATE TABLE additional_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    price_type VARCHAR(50) DEFAULT 'per_stay',  -- per_stay, per_night, per_person
    is_included BOOLEAN DEFAULT false,    -- included in base price or extra
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_additional_services_property ON additional_services (property_id);

-- ---------------------------------------------------------------------------
-- Bookings
-- ---------------------------------------------------------------------------
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pricing_tier_id UUID REFERENCES pricing_tiers(id) ON DELETE SET NULL,

    -- Dates
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,

    -- Guest details
    num_guests INTEGER NOT NULL DEFAULT 1,
    special_requests TEXT,

    -- Pricing breakdown
    base_price DECIMAL(15, 2) NOT NULL,
    cleaning_fee DECIMAL(10, 2) DEFAULT 0,
    service_fee DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',

    -- Duration info
    duration_type rental_duration_type NOT NULL DEFAULT 'nightly',
    duration_count INTEGER NOT NULL DEFAULT 1,  -- e.g., 3 nights, 6 months

    -- Status
    status booking_status NOT NULL DEFAULT 'pending',
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT bookings_dates_valid CHECK (check_out > check_in),
    CONSTRAINT bookings_guests_positive CHECK (num_guests > 0),
    CONSTRAINT bookings_total_positive CHECK (total_price >= 0)
);

CREATE INDEX idx_bookings_property ON bookings (property_id);
CREATE INDEX idx_bookings_guest ON bookings (guest_id);
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_bookings_dates ON bookings (property_id, check_in, check_out);
CREATE INDEX idx_bookings_created_at ON bookings (created_at DESC);

CREATE TRIGGER trigger_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Blocked dates (owner-specified unavailability)
-- ---------------------------------------------------------------------------
CREATE TABLE blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT blocked_dates_valid CHECK (end_date >= start_date)
);

CREATE INDEX idx_blocked_dates_property ON blocked_dates (property_id, start_date, end_date);

-- ---------------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------------
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Rating (1-5 stars)
    overall_rating SMALLINT NOT NULL,
    cleanliness_rating SMALLINT,
    location_rating SMALLINT,
    value_rating SMALLINT,
    communication_rating SMALLINT,

    -- Review text
    title VARCHAR(255),
    comment TEXT NOT NULL,

    -- Owner response
    owner_response TEXT,
    owner_responded_at TIMESTAMPTZ,

    -- Moderation
    is_approved BOOLEAN NOT NULL DEFAULT false,
    is_flagged BOOLEAN NOT NULL DEFAULT false,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT reviews_rating_range CHECK (overall_rating >= 1 AND overall_rating <= 5),
    CONSTRAINT reviews_cleanliness_range CHECK (cleanliness_rating IS NULL OR (cleanliness_rating >= 1 AND cleanliness_rating <= 5)),
    CONSTRAINT reviews_location_range CHECK (location_rating IS NULL OR (location_rating >= 1 AND location_rating <= 5)),
    CONSTRAINT reviews_value_range CHECK (value_rating IS NULL OR (value_rating >= 1 AND value_rating <= 5)),
    CONSTRAINT reviews_communication_range CHECK (communication_rating IS NULL OR (communication_rating >= 1 AND communication_rating <= 5))
);

CREATE INDEX idx_reviews_property ON reviews (property_id);
CREATE INDEX idx_reviews_user ON reviews (user_id);
CREATE INDEX idx_reviews_booking ON reviews (booking_id);
CREATE INDEX idx_reviews_approved ON reviews (property_id, is_approved) WHERE is_approved = true;
CREATE INDEX idx_reviews_created_at ON reviews (created_at DESC);

CREATE TRIGGER trigger_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Conversations & Messages (live chat)
-- ---------------------------------------------------------------------------
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    participant_1 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    participant_2 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT conversations_different_users CHECK (participant_1 != participant_2)
);

CREATE INDEX idx_conversations_participant1 ON conversations (participant_1);
CREATE INDEX idx_conversations_participant2 ON conversations (participant_2);
CREATE INDEX idx_conversations_property ON conversations (property_id);
CREATE INDEX idx_conversations_last_message ON conversations (last_message_at DESC);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages (conversation_id, created_at);
CREATE INDEX idx_messages_sender ON messages (sender_id);
CREATE INDEX idx_messages_unread ON messages (conversation_id, is_read) WHERE is_read = false;

-- ---------------------------------------------------------------------------
-- Add review stats columns to properties for fast queries
-- ---------------------------------------------------------------------------
ALTER TABLE properties
    ADD COLUMN avg_rating DECIMAL(3, 2) DEFAULT 0,
    ADD COLUMN review_count INTEGER DEFAULT 0;
