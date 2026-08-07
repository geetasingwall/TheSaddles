/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 10_registrations.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Table : registrations
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS registrations
(
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ------------------------------------------------------
    -- Personal Information
    ------------------------------------------------------

    first_name                  VARCHAR(100) NOT NULL,

    last_name                   VARCHAR(100),

    date_of_birth               DATE,

    gender                      VARCHAR(20),

    ------------------------------------------------------
    -- Contact Information
    ------------------------------------------------------

    mobile_number               VARCHAR(15) NOT NULL,

    alternate_mobile_number     VARCHAR(15),

    email                       VARCHAR(255),

    ------------------------------------------------------
    -- Address
    ------------------------------------------------------

    address_line_1              VARCHAR(255),

    address_line_2              VARCHAR(255),

    city                        VARCHAR(100),

    state                       VARCHAR(100),

    postal_code                 VARCHAR(20),

    ------------------------------------------------------
    -- Emergency Contact
    ------------------------------------------------------

    emergency_contact_name      VARCHAR(150),

    emergency_contact_number    VARCHAR(15),

    relationship                VARCHAR(50),

    ------------------------------------------------------
    -- Riding Information
    ------------------------------------------------------

    riding_experience           VARCHAR(50),

    medical_conditions          TEXT,

    comments                    TEXT,

    ------------------------------------------------------
    -- Workflow
    ------------------------------------------------------

    registration_status         VARCHAR(20)
                                NOT NULL
                                DEFAULT 'Pending',

    approved_by                 UUID,

    approved_at                 TIMESTAMPTZ,

    rejection_reason            TEXT,

    student_id                  UUID,

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

    trial_booking_id            UUID NULL,

    ------------------------------------------------------
    -- Constraints
    ------------------------------------------------------

    CONSTRAINT fk_registration_trial_booking
FOREIGN KEY (trial_booking_id)
REFERENCES trial_bookings(id),

    CONSTRAINT uq_registration_mobile
        UNIQUE (mobile_number),

    CONSTRAINT chk_registration_status
        CHECK
        (
            registration_status IN
            (
                'Pending',
                'Approved',
                'Rejected',
                'Cancelled'
            )
        ),

    CONSTRAINT chk_gender
        CHECK
        (
            gender IS NULL
            OR gender IN
            (
                'Male',
                'Female',
                'Other'
            )
        ),

    CONSTRAINT fk_registration_admin
        FOREIGN KEY (approved_by)
        REFERENCES administrators(id)
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_registration_mobile
ON registrations(mobile_number);

CREATE INDEX idx_registration_status
ON registrations(registration_status);

CREATE INDEX idx_registration_created
ON registrations(created_at);

CREATE INDEX idx_registration_student
ON registrations(student_id);

COMMIT;