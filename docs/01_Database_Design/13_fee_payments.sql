/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 13_fee_payments.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Table : fee_payments
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS fee_payments
(
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ------------------------------------------------------
    -- Student
    ------------------------------------------------------

    student_id                  UUID NOT NULL,

    ------------------------------------------------------
    -- Payment Information
    ------------------------------------------------------

    payment_date                DATE NOT NULL,

    payment_for_month           DATE NOT NULL,

    amount_paid                 NUMERIC(10,2) NOT NULL,

    payment_mode                VARCHAR(30) NOT NULL,

    transaction_reference       VARCHAR(100),

    receipt_number              VARCHAR(50),

    ------------------------------------------------------
    -- Remarks
    ------------------------------------------------------

    remarks                     TEXT,

    ------------------------------------------------------
    -- Audit
    ------------------------------------------------------

    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at                  TIMESTAMPTZ,

    created_by                  VARCHAR(100),

    updated_by                  VARCHAR(100),

    ------------------------------------------------------
    -- Constraints
    ------------------------------------------------------

    CONSTRAINT fk_fee_student
        FOREIGN KEY (student_id)
        REFERENCES students(id),

    CONSTRAINT chk_amount_paid
        CHECK (amount_paid > 0),

    CONSTRAINT chk_payment_mode
        CHECK
        (
            payment_mode IN
            (
                'Cash',
                'UPI',
                'Card',
                'Bank Transfer',
                'Cheque',
                'Other'
            )
        ),

    CONSTRAINT uq_receipt_number
        UNIQUE (receipt_number)
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_fee_student
ON fee_payments(student_id);

CREATE INDEX idx_fee_payment_date
ON fee_payments(payment_date);

CREATE INDEX idx_fee_month
ON fee_payments(payment_for_month);

CREATE INDEX idx_fee_receipt
ON fee_payments(receipt_number);

COMMIT;