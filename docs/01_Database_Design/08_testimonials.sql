/*
==========================================================
Horse Riding Club Management System
Database Schema

File        : 08_testimonials.sql
Version     : 1.0
Database    : PostgreSQL 16+
==========================================================
*/

BEGIN;

----------------------------------------------------------
-- Table : testimonials
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS testimonials
(
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ------------------------------------------------------
    -- Customer Information
    ------------------------------------------------------

    customer_name           VARCHAR(150) NOT NULL,

    customer_type           VARCHAR(20) NOT NULL,

    ------------------------------------------------------
    -- Testimonial
    ------------------------------------------------------

    rating                  INTEGER NOT NULL DEFAULT 5,

    testimonial             TEXT NOT NULL,

    ------------------------------------------------------
    -- Media
    ------------------------------------------------------

    profile_image_path      VARCHAR(500),

    ------------------------------------------------------
    -- Website Display
    ------------------------------------------------------

    display_order           INTEGER NOT NULL DEFAULT 1,

    show_on_homepage        BOOLEAN NOT NULL DEFAULT TRUE,

    ------------------------------------------------------
    -- Approval
    ------------------------------------------------------

    is_approved             BOOLEAN NOT NULL DEFAULT TRUE,

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

    CONSTRAINT chk_customer_type
        CHECK
        (
            customer_type IN
            (
                'Student',
                'Parent'
            )
        ),

    CONSTRAINT chk_rating
        CHECK
        (
            rating BETWEEN 1 AND 5
        ),

    CONSTRAINT chk_display_order
        CHECK
        (
            display_order > 0
        )
);

----------------------------------------------------------
-- Indexes
----------------------------------------------------------

CREATE INDEX idx_testimonial_customer
ON testimonials(customer_name);

CREATE INDEX idx_testimonial_rating
ON testimonials(rating);

CREATE INDEX idx_testimonial_active
ON testimonials(is_active);

CREATE INDEX idx_testimonial_homepage
ON testimonials(show_on_homepage);

CREATE INDEX idx_testimonial_display
ON testimonials(display_order);

COMMIT;