/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 06_horses.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Table : horses
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS horses
(
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ------------------------------------------------------
    -- Identification
    ------------------------------------------------------

    registered_name             VARCHAR(150),

    stable_name                 VARCHAR(100) NOT NULL,

    ------------------------------------------------------
    -- Basic Information
    ------------------------------------------------------

    gender                      VARCHAR(20),

    date_of_birth               DATE,

    approximate_age_years       INTEGER,

    breed                       VARCHAR(100),

    color                       VARCHAR(100),

    ------------------------------------------------------
    -- Physical Details
    ------------------------------------------------------

    height_cm                   NUMERIC(5,2),

    weight_kg                   NUMERIC(6,2),

    ------------------------------------------------------
    -- Training Information
    ------------------------------------------------------

    temperament                 VARCHAR(100),

    training_level              VARCHAR(100),

    suitable_for_beginners      BOOLEAN NOT NULL DEFAULT TRUE,

    available_for_lessons       BOOLEAN NOT NULL DEFAULT TRUE,

    available_for_lease         BOOLEAN NOT NULL DEFAULT FALSE,

    ------------------------------------------------------
    -- Media
    ------------------------------------------------------

    image_path                  VARCHAR(500),

    ------------------------------------------------------
    -- Additional Information
    ------------------------------------------------------

    notes                       TEXT,

    ------------------------------------------------------
    -- Status
    ------------------------------------------------------

    is_active                   BOOLEAN NOT NULL DEFAULT TRUE,

    ------------------------------------------------------
    -- Audit Information
    ------------------------------------------------------

    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at                  TIMESTAMPTZ,

    created_by                  VARCHAR(100),

    updated_by                  VARCHAR(100),

    ------------------------------------------------------
    -- Constraints
    ------------------------------------------------------

    CONSTRAINT uq_horse_stable_name
        UNIQUE (stable_name),

    CONSTRAINT chk_approx_age
        CHECK (
            approximate_age_years IS NULL
            OR approximate_age_years >= 0
        ),

    CONSTRAINT chk_weight
        CHECK (
            weight_kg IS NULL
            OR weight_kg > 0
        ),

    CONSTRAINT chk_height
        CHECK (
            height_cm IS NULL
            OR height_cm > 0
        )
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_horse_name
ON horses(stable_name);

CREATE INDEX idx_horse_active
ON horses(is_active);

CREATE INDEX idx_horse_lessons
ON horses(available_for_lessons);

CREATE INDEX idx_horse_lease
ON horses(available_for_lease);

COMMIT;