-- ============================================================
-- Migration 002: Add missing columns to documents and contacts
-- Run: psql -U postgres -d bounty -f migrations/002_missing_columns.sql
-- ============================================================

-- ── documents: add is_link and url (used by the Documents page) ──────────────
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS is_link BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS url     TEXT;

-- ── contacts: add plain-text company and role columns ────────────────────────
-- The contacts table already has company_id (FK) and title (job title).
-- The frontend and API use plain-text "company" and "role" fields, so we add
-- those as standalone text columns for simplicity.
ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS role    TEXT;

-- Backfill: if existing rows have a title value, copy it to role
UPDATE contacts SET role = title WHERE role IS NULL AND title IS NOT NULL;
