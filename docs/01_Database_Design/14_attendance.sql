/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 14_attendance.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Table : attendance
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS attendance
(
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ------------------------------------------------------
    -- Student
    ------------------------------------------------------

    student_id                  UUID NOT NULL,

    ------------------------------------------------------
    -- Coach
    ------------------------------------------------------

    coach_id                    UUID NOT NULL,

    ------------------------------------------------------
    -- Attendance Information
    ------------------------------------------------------

    attendance_date             DATE NOT NULL,

    attendance_status           VARCHAR(10)
                                NOT NULL
                                DEFAULT 'Present',

    ------------------------------------------------------
    -- Remarks
    ------------------------------------------------------

    remarks                     TEXT,

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

    CONSTRAINT fk_attendance_student
        FOREIGN KEY (student_id)
        REFERENCES students(id),

    CONSTRAINT fk_attendance_coach
        FOREIGN KEY (coach_id)
        REFERENCES coaches(id),

    CONSTRAINT uq_attendance
        UNIQUE
        (
            student_id,
            attendance_date
        ),

    CONSTRAINT chk_attendance_status
        CHECK
        (
            attendance_status IN
            (
                'Present',
                'Absent'
            )
        )
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_attendance_student
ON attendance(student_id);

CREATE INDEX idx_attendance_date
ON attendance(attendance_date);

CREATE INDEX idx_attendance_coach
ON attendance(coach_id);

CREATE INDEX idx_attendance_status
ON attendance(attendance_status);

COMMIT;