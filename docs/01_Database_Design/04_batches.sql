/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 04_batches.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Table : batches
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS batches
(
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ------------------------------------------------------
    -- Batch Information
    ------------------------------------------------------

    batch_name          VARCHAR(100) NOT NULL,

    description         TEXT,

    coach_id            UUID NOT NULL,

    ------------------------------------------------------
    -- Schedule
    ------------------------------------------------------

    training_day        VARCHAR(20) NOT NULL,

    start_time          TIME NOT NULL,

    end_time            TIME NOT NULL,

    ------------------------------------------------------
    -- Capacity
    ------------------------------------------------------

    maximum_strength    INTEGER NOT NULL DEFAULT 8,

    ------------------------------------------------------
    -- Status
    ------------------------------------------------------

    is_active           BOOLEAN NOT NULL DEFAULT TRUE,

    ------------------------------------------------------
    -- Audit
    ------------------------------------------------------

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at          TIMESTAMPTZ,

    created_by          VARCHAR(100),

    updated_by          VARCHAR(100),

    ------------------------------------------------------
    -- Constraints
    ------------------------------------------------------

    CONSTRAINT fk_batch_coach
        FOREIGN KEY (coach_id)
        REFERENCES coaches(id),

    CONSTRAINT chk_batch_capacity
        CHECK (maximum_strength > 0),

    CONSTRAINT chk_batch_time
        CHECK (start_time < end_time),

    CONSTRAINT uq_batch_schedule
        UNIQUE
        (
            coach_id,
            training_day,
            start_time
        )
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_batch_coach
ON batches(coach_id);

CREATE INDEX idx_batch_day
ON batches(training_day);

CREATE INDEX idx_batch_active
ON batches(is_active);

COMMIT;