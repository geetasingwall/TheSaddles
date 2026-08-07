/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 05_facilities.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Table : facilities
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS facilities
(
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ------------------------------------------------------
    -- Facility Information
    ------------------------------------------------------

    facility_name           VARCHAR(150) NOT NULL,

    short_description       VARCHAR(500),

    detailed_description    TEXT,

    ------------------------------------------------------
    -- Media
    ------------------------------------------------------

    image_path              VARCHAR(500),

    ------------------------------------------------------
    -- Website Display
    ------------------------------------------------------

    display_order           INTEGER NOT NULL DEFAULT 1,

    show_on_homepage        BOOLEAN NOT NULL DEFAULT FALSE,

    ------------------------------------------------------
    -- Status
    ------------------------------------------------------

    is_active               BOOLEAN NOT NULL DEFAULT TRUE,

    ------------------------------------------------------
    -- Audit Information
    ------------------------------------------------------

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at              TIMESTAMPTZ,

    created_by              VARCHAR(100),

    updated_by              VARCHAR(100),

    ------------------------------------------------------
    -- Constraints
    ------------------------------------------------------

    CONSTRAINT uq_facility_name
        UNIQUE (facility_name),

    CONSTRAINT chk_display_order
        CHECK (display_order > 0)
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_facility_name
ON facilities(facility_name);

CREATE INDEX idx_facility_active
ON facilities(is_active);

CREATE INDEX idx_facility_display
ON facilities(display_order);

----------------------------------------------------------
-- Seed Data
----------------------------------------------------------

INSERT INTO facilities
(
    facility_name,
    short_description,
    display_order,
    show_on_homepage,
    created_by
)
VALUES
(
    'Horse Riding Training',
    'Professional horse riding lessons for beginners and experienced riders.',
    1,
    TRUE,
    'SYSTEM'
),
(
    'Horse Livery',
    'Full and partial horse livery services.',
    2,
    TRUE,
    'SYSTEM'
),
(
    'Horse Leasing',
    'Horse leasing for show jumping and competitions.',
    3,
    TRUE,
    'SYSTEM'
)
ON CONFLICT (facility_name)
DO NOTHING;

COMMIT;