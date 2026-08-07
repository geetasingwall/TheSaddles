/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 11_students.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Table : students
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS students
(
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ------------------------------------------------------
    -- Registration Reference
    ------------------------------------------------------

    registration_id             UUID NOT NULL,

    ------------------------------------------------------
    -- Club Information
    ------------------------------------------------------

    student_number              VARCHAR(30) NOT NULL,

    joining_date                DATE NOT NULL,

    ------------------------------------------------------
    -- Batch Assignment
    ------------------------------------------------------

    batch_id                    UUID,

    ------------------------------------------------------
    -- Membership
    ------------------------------------------------------

    membership_status           VARCHAR(20)
                                NOT NULL
                                DEFAULT 'Active',

    ------------------------------------------------------
    -- Fee Information
    ------------------------------------------------------

    monthly_fee                 NUMERIC(10,2),

   -- fee_due                     NUMERIC(10,2) NOT NULL DEFAULT 0.00,

    ------------------------------------------------------
    -- Performance
    ------------------------------------------------------

    -- current_level               VARCHAR(100),

    ------------------------------------------------------
    -- Remarks
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

    CONSTRAINT uq_student_number
        UNIQUE (student_number),

    CONSTRAINT uq_registration
        UNIQUE (registration_id),

    CONSTRAINT chk_membership_status
        CHECK
        (
            membership_status IN
            (
                'Active',
                'Inactive',
                'Suspended',
                'Completed'
            )
        ),

    CONSTRAINT chk_monthly_fee
        CHECK
        (
            monthly_fee IS NULL
            OR monthly_fee >= 0
        ),

    CONSTRAINT chk_fee_due
        CHECK
        (
            fee_due >= 0
        ),

    CONSTRAINT fk_student_registration
        FOREIGN KEY (registration_id)
        REFERENCES registrations(id),

    CONSTRAINT fk_student_batch
        FOREIGN KEY (batch_id)
        REFERENCES batches(id)
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_student_number
ON students(student_number);

CREATE INDEX idx_student_batch
ON students(batch_id);

CREATE INDEX idx_student_membership
ON students(membership_status);

CREATE INDEX idx_student_active
ON students(is_active);

COMMIT;