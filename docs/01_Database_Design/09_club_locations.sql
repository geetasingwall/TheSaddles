/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 09_club_locations.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Table : club_locations
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS club_locations
(
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ------------------------------------------------------
    -- Branch Information
    ------------------------------------------------------

    branch_name             VARCHAR(150) NOT NULL,

    short_description       VARCHAR(300),

    ------------------------------------------------------
    -- Address
    ------------------------------------------------------

    address_line_1          VARCHAR(255) NOT NULL,

    address_line_2          VARCHAR(255),

    city                    VARCHAR(100) NOT NULL,

    state                   VARCHAR(100) NOT NULL,

    postal_code             VARCHAR(20),

    country                 VARCHAR(100) NOT NULL DEFAULT 'India',

    ------------------------------------------------------
    -- Map Coordinates
    ------------------------------------------------------

    latitude                NUMERIC(10,7),

    longitude               NUMERIC(10,7),

    ------------------------------------------------------
    -- Contact Information
    ------------------------------------------------------

    contact_number          VARCHAR(15),

    email                   VARCHAR(255),

    ------------------------------------------------------
    -- Website Display
    ------------------------------------------------------

    image_path              VARCHAR(500),

    display_order           INTEGER NOT NULL DEFAULT 1,

    show_on_website         BOOLEAN NOT NULL DEFAULT TRUE,

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

    CONSTRAINT uq_branch_name
        UNIQUE (branch_name),

    CONSTRAINT chk_display_order
        CHECK (display_order > 0),

    CONSTRAINT chk_latitude
        CHECK (
            latitude IS NULL
            OR (latitude BETWEEN -90 AND 90)
        ),

    CONSTRAINT chk_longitude
        CHECK (
            longitude IS NULL
            OR (longitude BETWEEN -180 AND 180)
        )
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_location_branch
ON club_locations(branch_name);

CREATE INDEX idx_location_city
ON club_locations(city);

CREATE INDEX idx_location_active
ON club_locations(is_active);

CREATE INDEX idx_location_display
ON club_locations(display_order);

----------------------------------------------------------
-- Seed Data
----------------------------------------------------------

INSERT INTO club_locations
(
    branch_name,
    address_line_1,
    city,
    state,
    country,
    display_order,
    show_on_website,
    created_by
)
VALUES
(
    'Noida',
    '',
    'Noida',
    'Uttar Pradesh',
    'India',
    1,
    TRUE,
    'SYSTEM'
),
(
    'New Delhi',
    '',
    'New Delhi',
    'Delhi',
    'India',
    2,
    TRUE,
    'SYSTEM'
)
ON CONFLICT (branch_name)
DO NOTHING;

COMMIT;