/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 15_student_progress.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Table : student_progress
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS student_progress
(
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ------------------------------------------------------
    -- Student Information
    ------------------------------------------------------

    student_id                  UUID NOT NULL,

    coach_id                    UUID NOT NULL,

    ------------------------------------------------------
    -- Assessment
    ------------------------------------------------------

    assessment_date             DATE NOT NULL,

    riding_level                VARCHAR(100) NOT NULL,

    ------------------------------------------------------
    -- Progress Details
    ------------------------------------------------------

    skills_learned              TEXT,

    strengths                   TEXT,

    areas_for_improvement       TEXT,

    next_goals                  TEXT,

    coach_remarks               TEXT,

    ------------------------------------------------------
    -- Overall Rating
    ------------------------------------------------------

    performance_rating          INTEGER,

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

    CONSTRAINT fk_progress_student
        FOREIGN KEY (student_id)
        REFERENCES students(id),

    CONSTRAINT fk_progress_coach
        FOREIGN KEY (coach_id)
        REFERENCES coaches(id),

    CONSTRAINT chk_performance_rating
        CHECK
        (
            performance_rating IS NULL
            OR performance_rating BETWEEN 1 AND 5
        )
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_progress_student
ON student_progress(student_id);

CREATE INDEX idx_progress_coach
ON student_progress(coach_id);

CREATE INDEX idx_progress_date
ON student_progress(assessment_date);

CREATE INDEX idx_progress_rating
ON student_progress(performance_rating);

COMMIT;