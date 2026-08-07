/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 03_coaches.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Table : coaches
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS coaches
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
                                TRIM(first_name || ' ' || COALESCE(last_name,''))
                            ) STORED,

    mobile_number           VARCHAR(15) NOT NULL,

    email                   VARCHAR(255),

    ------------------------------------------------------
    -- Professional Information
    ------------------------------------------------------

    experience_years        INTEGER,

    specialization          VARCHAR(200),

    joining_date            DATE,

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

    CONSTRAINT uq_coach_mobile
        UNIQUE (mobile_number),

    CONSTRAINT uq_coach_email
        UNIQUE (email),

    CONSTRAINT chk_experience
        CHECK
        (
            experience_years IS NULL
            OR experience_years >= 0
        )
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_coach_mobile
ON coaches (mobile_number);

CREATE INDEX idx_coach_active
ON coaches (is_active);

CREATE INDEX idx_coach_joining_date
ON coaches (joining_date);

COMMIT;