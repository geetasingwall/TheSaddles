/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 12_trial_bookings.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Table : trial_bookings
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS trial_bookings
(
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ------------------------------------------------------
    -- Booking Information
    ------------------------------------------------------

    booking_reference           VARCHAR(30) NOT NULL,

    booking_date                DATE NOT NULL,

    start_time                  TIME NOT NULL,

    end_time                    TIME NOT NULL,

    number_of_participants      INTEGER NOT NULL DEFAULT 1,

    amount_per_person           NUMERIC(10,2) NOT NULL,

    total_amount                NUMERIC(10,2) NOT NULL,

    ------------------------------------------------------
    -- Customer Information
    ------------------------------------------------------

    full_name                   VARCHAR(200) NOT NULL,

    mobile_number               VARCHAR(15) NOT NULL,

    place                       VARCHAR(100) NOT NULL,

    ------------------------------------------------------
    -- Booking Status
    ------------------------------------------------------

    booking_status VARCHAR(20)
               NOT NULL
               DEFAULT 'Booked',

CONSTRAINT chk_booking_status
CHECK
(
    booking_status IN
    (
        'Booked',
        'Attended',
        'Cancelled',
        'No Show'
    )
),

    ------------------------------------------------------
    -- Remarks
    ------------------------------------------------------

    remarks                     TEXT,

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

    CONSTRAINT uq_booking_reference
        UNIQUE (booking_reference),

    CONSTRAINT chk_participants
        CHECK
        (
            number_of_participants > 0
        ),

    CONSTRAINT chk_amount
        CHECK
        (
            amount_per_person >= 0
        ),

    CONSTRAINT chk_total_amount
        CHECK
        (
            total_amount >= 0
        ),

    CONSTRAINT chk_booking_status
        CHECK
        (
            booking_status IN
            (
                'Booked',
                'Completed',
                'Cancelled',
                'No Show'
            )
        ),

    CONSTRAINT chk_place
        CHECK
        (
            place IN
            (
                'Noida',
                'New Delhi'
            )
        ),

    CONSTRAINT chk_booking_time
        CHECK
        (
            start_time < end_time
        )
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_trial_booking_date
ON trial_bookings(booking_date);

CREATE INDEX idx_trial_booking_mobile
ON trial_bookings(mobile_number);

CREATE INDEX idx_trial_booking_status
ON trial_bookings(booking_status);

CREATE INDEX idx_trial_booking_attended
ON trial_bookings(attended);

CREATE INDEX idx_trial_booking_created
ON trial_bookings(created_at);

COMMIT;