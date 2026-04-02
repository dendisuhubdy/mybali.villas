-- Migration 006: Add super_admin and operational roles
-- Extends the user_role enum for role-based access control:
--   super_admin  – can manage admins and operational team
--   admin        – can manage operational team
--   operational  – can view stats and manage site content (properties, bookings, inquiries, reviews)

-- Add new enum values to user_role
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'operational';

-- Promote the default admin user to super_admin
UPDATE users
SET role = 'super_admin', updated_at = NOW()
WHERE email = 'admin@mybalivilla.com' AND role = 'admin';
