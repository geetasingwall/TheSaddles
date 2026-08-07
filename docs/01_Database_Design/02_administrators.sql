/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 02_administrators.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Table : administrators
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS administrators
(
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ------------------------------------------------------
    -- Personal Information
    ------------------------------------------------------

    first_name              VARCHAR(100) NOT NULL,

    last_name               VARCHAR(100),

    full_name               VARCHAR(200) GENERATED ALWAYS AS
                            (
                                TRIM(first_name || ' ' || COALESCE(last_name,''))
                            ) STORED,

    mobile_number           VARCHAR(15) NOT NULL,

    email                   VARCHAR(255),

    ------------------------------------------------------
    -- Status
    ------------------------------------------------------

    is_active               BOOLEAN NOT NULL DEFAULT TRUE,

    ------------------------------------------------------
    -- Audit
    ------------------------------------------------------

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at              TIMESTAMPTZ,

    created_by              VARCHAR(100),

    updated_by              VARCHAR(100),

    ------------------------------------------------------
    -- Constraints
    ------------------------------------------------------

    CONSTRAINT uq_admin_mobile
        UNIQUE(mobile_number),

    CONSTRAINT uq_admin_email
        UNIQUE(email)
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_admin_mobile
ON administrators(mobile_number);

CREATE INDEX idx_admin_active
ON administrators(is_active);

----------------------------------------------------------
-- Default Administrator
----------------------------------------------------------

INSERT INTO administrators
(
    first_name,
    last_name,
    mobile_number,
    email,
    created_by
)
VALUES
(
    'System',
    'Administrator',
    '9999999999',
    'admin@localhost',
    'SYSTEM'
)
ON CONFLICT (mobile_number)
DO NOTHING;

COMMIT;