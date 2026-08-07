/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 01_configuration.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Required Extension
----------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

----------------------------------------------------------
-- Table : configuration
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS configuration
(
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ------------------------------------------------------------------
    -- Configuration Classification
    ------------------------------------------------------------------

    category            VARCHAR(50)  NOT NULL,
    config_key          VARCHAR(100) NOT NULL,

    ------------------------------------------------------------------
    -- Typed Values
    -- Only one of these should contain a value.
    ------------------------------------------------------------------

    string_value        TEXT,

    integer_value       INTEGER,

    decimal_value       NUMERIC(12,2),

    boolean_value       BOOLEAN,

    json_value          JSONB,

    ------------------------------------------------------------------
    -- Metadata
    ------------------------------------------------------------------

    description         TEXT,

    is_active           BOOLEAN NOT NULL DEFAULT TRUE,

    display_order       INTEGER NOT NULL DEFAULT 1,

    ------------------------------------------------------------------
    -- Audit Columns
    ------------------------------------------------------------------

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at          TIMESTAMPTZ,

    created_by          VARCHAR(100),

    updated_by          VARCHAR(100),

    ------------------------------------------------------------------
    -- Constraints
    ------------------------------------------------------------------

    CONSTRAINT uq_configuration
        UNIQUE(category, config_key)
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_configuration_category
ON configuration(category);

CREATE INDEX idx_configuration_key
ON configuration(config_key);

CREATE INDEX idx_configuration_active
ON configuration(is_active);

----------------------------------------------------------
-- Seed Data
----------------------------------------------------------

----------------------------------------------------------
-- Trial Configuration
----------------------------------------------------------

INSERT INTO configuration
(
    category,
    config_key,
    integer_value,
    description,
    display_order
)
VALUES
(
    'TRIAL',
    'TRIAL_FEE',
    400,
    'Fee per participant for trial ride.',
    1
);

INSERT INTO configuration
(
    category,
    config_key,
    json_value,
    description,
    display_order
)
VALUES
(
    'TRIAL',
    'TRIAL_TIME_SLOTS',
    '[
        {
            "day":"Sunday",
            "start":"06:00",
            "end":"06:30",
            "capacity":2
        },
        {
            "day":"Sunday",
            "start":"06:40",
            "end":"07:10",
            "capacity":2
        },
        {
            "day":"Sunday",
            "start":"07:20",
            "end":"07:50",
            "capacity":2
        }
    ]',
    'Trial ride schedule.',
    2
);

INSERT INTO configuration
(
    category,
    config_key,
    boolean_value,
    description,
    display_order
)
VALUES
(
    'TRIAL',
    'TRIAL_BOOKING_ENABLED',
    TRUE,
    'Enable or disable trial bookings.',
    3
);

----------------------------------------------------------
-- Website Configuration
----------------------------------------------------------

INSERT INTO configuration
(
    category,
    config_key,
    string_value,
    description,
    display_order
)
VALUES
(
    'WEBSITE',
    'CLUB_NAME',
    'Horse Riding Club',
    'Website title.',
    1
);

----------------------------------------------------------
-- Contact Information
----------------------------------------------------------

INSERT INTO configuration
(
    category,
    config_key,
    string_value,
    description,
    display_order
)
VALUES
(
    'CONTACT',
    'PRIMARY_PHONE',
    '',
    'Primary contact number.',
    1
);

INSERT INTO configuration
(
    category,
    config_key,
    string_value,
    description,
    display_order
)
VALUES
(
    'CONTACT',
    'PRIMARY_EMAIL',
    '',
    'Primary email address.',
    2
);

----------------------------------------------------------
-- Business Hours
----------------------------------------------------------

INSERT INTO configuration
(
    category,
    config_key,
    json_value,
    description,
    display_order
)
VALUES
(
    'BUSINESS',
    'BUSINESS_HOURS',
    '{
        "monday":"Closed",
        "tuesday":"05:30-19:00",
        "wednesday":"05:30-19:00",
        "thursday":"05:30-19:00",
        "friday":"05:30-19:00",
        "saturday":"06:00-19:00",
        "sunday":"06:00-08:00"
    }',
    'Club operating hours.',
    1
);

----------------------------------------------------------
-- Google Maps
----------------------------------------------------------

INSERT INTO configuration
(
    category,
    config_key,
    string_value,
    description,
    display_order
)
VALUES
(
    'LOCATION',
    'NOIDA_MAP_URL',
    '',
    'Google Maps URL for Noida location.',
    1
);

INSERT INTO configuration
(
    category,
    config_key,
    string_value,
    description,
    display_order
)
VALUES
(
    'LOCATION',
    'NEW_DELHI_MAP_URL',
    '',
    'Google Maps URL for New Delhi location.',
    2
);

COMMIT;