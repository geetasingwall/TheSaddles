/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 07_team_members.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Table : team_members
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS team_members
(
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ------------------------------------------------------
    -- Personal Information
    ------------------------------------------------------

    first_name              VARCHAR(100) NOT NULL,

    last_name               VARCHAR(100),

    full_name               VARCHAR(200)
                            GENERATED ALWAYS AS
                            (
                                TRIM(first_name || ' ' || COALESCE(last_name, ''))
                            ) STORED,

    ------------------------------------------------------
    -- Website Information
    ------------------------------------------------------

    designation             VARCHAR(150) NOT NULL,

    short_bio               VARCHAR(500),

    detailed_bio            TEXT,

    ------------------------------------------------------
    -- Contact Information
    ------------------------------------------------------

    email                   VARCHAR(255),

    phone_number            VARCHAR(15),

    ------------------------------------------------------
    -- Social Links
    ------------------------------------------------------

    facebook_url            VARCHAR(500),

    instagram_url           VARCHAR(500),

    linkedin_url            VARCHAR(500),

    ------------------------------------------------------
    -- Media
    ------------------------------------------------------

    profile_image_path      VARCHAR(500),

    ------------------------------------------------------
    -- Display Options
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

    CONSTRAINT chk_display_order
        CHECK (display_order > 0)
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_team_member_name
ON team_members(full_name);

CREATE INDEX idx_team_member_designation
ON team_members(designation);

CREATE INDEX idx_team_member_active
ON team_members(is_active);

CREATE INDEX idx_team_member_display
ON team_members(display_order);

COMMIT;