/*
==========================================================
Horse Riding Club Management System
Combined Database Schema
Version: 1.0
==========================================================
Run this file to create all tables in order.
*/

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. configuration
CREATE TABLE IF NOT EXISTS configuration (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category        VARCHAR(50)  NOT NULL,
    config_key      VARCHAR(100) NOT NULL,
    string_value    TEXT,
    integer_value   INTEGER,
    decimal_value   NUMERIC(12,2),
    boolean_value   BOOLEAN,
    json_value      JSONB,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    display_order   INTEGER NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ,
    created_by      VARCHAR(100),
    updated_by      VARCHAR(100),
    CONSTRAINT uq_configuration UNIQUE(category, config_key)
);
CREATE INDEX IF NOT EXISTS idx_configuration_category ON configuration(category);
CREATE INDEX IF NOT EXISTS idx_configuration_key ON configuration(config_key);
CREATE INDEX IF NOT EXISTS idx_configuration_active ON configuration(is_active);

-- 2. administrators
CREATE TABLE IF NOT EXISTS administrators (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100),
    full_name       VARCHAR(200) GENERATED ALWAYS AS (TRIM(first_name || ' ' || COALESCE(last_name,''))) STORED,
    mobile_number   VARCHAR(15) NOT NULL,
    email           VARCHAR(255),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ,
    created_by      VARCHAR(100),
    updated_by      VARCHAR(100),
    CONSTRAINT uq_admin_mobile UNIQUE(mobile_number),
    CONSTRAINT uq_admin_email UNIQUE(email)
);
CREATE INDEX IF NOT EXISTS idx_admin_mobile ON administrators(mobile_number);
CREATE INDEX IF NOT EXISTS idx_admin_active ON administrators(is_active);

-- 3. coaches
CREATE TABLE IF NOT EXISTS coaches (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100),
    full_name           VARCHAR(200) GENERATED ALWAYS AS (TRIM(first_name || ' ' || COALESCE(last_name,''))) STORED,
    mobile_number       VARCHAR(15) NOT NULL,
    email               VARCHAR(255),
    experience_years    INTEGER,
    specialization      VARCHAR(200),
    joining_date        DATE,
    assigned_place      VARCHAR(20),
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ,
    created_by          VARCHAR(100),
    updated_by          VARCHAR(100),
    CONSTRAINT uq_coach_mobile UNIQUE(mobile_number),
    CONSTRAINT uq_coach_email UNIQUE(email),
    CONSTRAINT chk_experience CHECK(experience_years IS NULL OR experience_years >= 0),
    CONSTRAINT chk_coach_place CHECK(assigned_place IS NULL OR assigned_place IN ('Noida','New Delhi'))
);
CREATE INDEX IF NOT EXISTS idx_coach_mobile ON coaches(mobile_number);
CREATE INDEX IF NOT EXISTS idx_coach_active ON coaches(is_active);

-- 4. batches
CREATE TABLE IF NOT EXISTS batches (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_name          VARCHAR(100) NOT NULL,
    description         TEXT,
    coach_id            UUID NOT NULL,
    training_day        VARCHAR(20) NOT NULL,
    start_time          TIME NOT NULL,
    end_time            TIME NOT NULL,
    maximum_strength    INTEGER NOT NULL DEFAULT 8,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ,
    created_by          VARCHAR(100),
    updated_by          VARCHAR(100),
    CONSTRAINT fk_batch_coach FOREIGN KEY(coach_id) REFERENCES coaches(id),
    CONSTRAINT chk_batch_capacity CHECK(maximum_strength > 0),
    CONSTRAINT chk_batch_time CHECK(start_time < end_time),
    CONSTRAINT uq_batch_schedule UNIQUE(coach_id, training_day, start_time)
);
CREATE INDEX IF NOT EXISTS idx_batch_coach ON batches(coach_id);
CREATE INDEX IF NOT EXISTS idx_batch_day ON batches(training_day);
CREATE INDEX IF NOT EXISTS idx_batch_active ON batches(is_active);

-- 5. facilities
CREATE TABLE IF NOT EXISTS facilities (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_name           VARCHAR(150) NOT NULL,
    short_description       VARCHAR(500),
    detailed_description    TEXT,
    image_path              VARCHAR(500),
    display_order           INTEGER NOT NULL DEFAULT 1,
    show_on_homepage        BOOLEAN NOT NULL DEFAULT FALSE,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ,
    created_by              VARCHAR(100),
    updated_by              VARCHAR(100),
    CONSTRAINT uq_facility_name UNIQUE(facility_name),
    CONSTRAINT chk_facility_display_order CHECK(display_order > 0)
);
CREATE INDEX IF NOT EXISTS idx_facility_active ON facilities(is_active);
CREATE INDEX IF NOT EXISTS idx_facility_display ON facilities(display_order);

-- 6. horses
CREATE TABLE IF NOT EXISTS horses (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registered_name         VARCHAR(150),
    stable_name             VARCHAR(100) NOT NULL,
    gender                  VARCHAR(20),
    date_of_birth           DATE,
    approximate_age_years   INTEGER,
    breed                   VARCHAR(100),
    color                   VARCHAR(100),
    height_cm               NUMERIC(5,2),
    weight_kg               NUMERIC(6,2),
    temperament             VARCHAR(100),
    training_level          VARCHAR(100),
    suitable_for_beginners  BOOLEAN NOT NULL DEFAULT TRUE,
    available_for_lessons   BOOLEAN NOT NULL DEFAULT TRUE,
    available_for_lease     BOOLEAN NOT NULL DEFAULT FALSE,
    lease_events            TEXT,
    image_path              VARCHAR(500),
    gallery_images          JSONB DEFAULT '[]'::jsonb,
    notes                   TEXT,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ,
    created_by              VARCHAR(100),
    updated_by              VARCHAR(100),
    CONSTRAINT uq_horse_stable_name UNIQUE(stable_name),
    CONSTRAINT chk_approx_age CHECK(approximate_age_years IS NULL OR approximate_age_years >= 0),
    CONSTRAINT chk_weight CHECK(weight_kg IS NULL OR weight_kg > 0),
    CONSTRAINT chk_height CHECK(height_cm IS NULL OR height_cm > 0)
);
CREATE INDEX IF NOT EXISTS idx_horse_name ON horses(stable_name);
CREATE INDEX IF NOT EXISTS idx_horse_active ON horses(is_active);
CREATE INDEX IF NOT EXISTS idx_horse_lessons ON horses(available_for_lessons);

-- 7. team_members
CREATE TABLE IF NOT EXISTS team_members (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100),
    full_name           VARCHAR(200) GENERATED ALWAYS AS (TRIM(first_name || ' ' || COALESCE(last_name,''))) STORED,
    designation         VARCHAR(150) NOT NULL,
    short_bio           VARCHAR(500),
    detailed_bio        TEXT,
    email               VARCHAR(255),
    phone_number        VARCHAR(15),
    facebook_url        VARCHAR(500),
    instagram_url       VARCHAR(500),
    linkedin_url        VARCHAR(500),
    profile_image_path  VARCHAR(500),
    display_order       INTEGER NOT NULL DEFAULT 1,
    show_on_homepage    BOOLEAN NOT NULL DEFAULT FALSE,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ,
    created_by          VARCHAR(100),
    updated_by          VARCHAR(100),
    CONSTRAINT chk_team_display_order CHECK(display_order > 0)
);
CREATE INDEX IF NOT EXISTS idx_team_member_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_member_display ON team_members(display_order);

-- 8. testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name       VARCHAR(150) NOT NULL,
    customer_type       VARCHAR(20) NOT NULL,
    rating              INTEGER NOT NULL DEFAULT 5,
    testimonial         TEXT NOT NULL,
    profile_image_path  VARCHAR(500),
    display_order       INTEGER NOT NULL DEFAULT 1,
    show_on_homepage    BOOLEAN NOT NULL DEFAULT TRUE,
    is_approved         BOOLEAN NOT NULL DEFAULT TRUE,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ,
    created_by          VARCHAR(100),
    updated_by          VARCHAR(100),
    CONSTRAINT chk_customer_type CHECK(customer_type IN ('Student','Parent')),
    CONSTRAINT chk_rating CHECK(rating BETWEEN 1 AND 5),
    CONSTRAINT chk_testimonial_display_order CHECK(display_order > 0)
);
CREATE INDEX IF NOT EXISTS idx_testimonial_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonial_homepage ON testimonials(show_on_homepage);

-- 9. club_locations
CREATE TABLE IF NOT EXISTS club_locations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_name         VARCHAR(150) NOT NULL,
    short_description   VARCHAR(300),
    address_line_1      VARCHAR(255) NOT NULL,
    address_line_2      VARCHAR(255),
    city                VARCHAR(100) NOT NULL,
    state               VARCHAR(100) NOT NULL,
    postal_code         VARCHAR(20),
    country             VARCHAR(100) NOT NULL DEFAULT 'India',
    latitude            NUMERIC(10,7),
    longitude           NUMERIC(10,7),
    contact_number      VARCHAR(15),
    email               VARCHAR(255),
    image_path          VARCHAR(500),
    display_order       INTEGER NOT NULL DEFAULT 1,
    show_on_website     BOOLEAN NOT NULL DEFAULT TRUE,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ,
    created_by          VARCHAR(100),
    updated_by          VARCHAR(100),
    CONSTRAINT uq_branch_name UNIQUE(branch_name),
    CONSTRAINT chk_location_display_order CHECK(display_order > 0),
    CONSTRAINT chk_latitude CHECK(latitude IS NULL OR (latitude BETWEEN -90 AND 90)),
    CONSTRAINT chk_longitude CHECK(longitude IS NULL OR (longitude BETWEEN -180 AND 180))
);
CREATE INDEX IF NOT EXISTS idx_location_active ON club_locations(is_active);
CREATE INDEX IF NOT EXISTS idx_location_display ON club_locations(display_order);

-- 10. trial_bookings
CREATE TABLE IF NOT EXISTS trial_bookings (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference       VARCHAR(30) NOT NULL,
    booking_date            DATE NOT NULL,
    start_time              TIME NOT NULL,
    end_time                TIME NOT NULL,
    number_of_participants  INTEGER NOT NULL DEFAULT 1,
    amount_per_person       NUMERIC(10,2) NOT NULL,
    total_amount            NUMERIC(10,2) NOT NULL,
    full_name               VARCHAR(200) NOT NULL,
    mobile_number           VARCHAR(15) NOT NULL,
    place                   VARCHAR(100) NOT NULL,
    booking_status          VARCHAR(20) NOT NULL DEFAULT 'Booked',
    remarks                 TEXT,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ,
    created_by              VARCHAR(100),
    updated_by              VARCHAR(100),
    CONSTRAINT uq_booking_reference UNIQUE(booking_reference),
    CONSTRAINT chk_participants CHECK(number_of_participants > 0),
    CONSTRAINT chk_amount CHECK(amount_per_person >= 0),
    CONSTRAINT chk_total_amount CHECK(total_amount >= 0),
    CONSTRAINT chk_booking_status CHECK(booking_status IN ('Booked','Completed','Cancelled','No Show')),
    CONSTRAINT chk_place CHECK(place IN ('Noida','New Delhi')),
    CONSTRAINT chk_booking_time CHECK(start_time < end_time)
);
CREATE INDEX IF NOT EXISTS idx_trial_booking_date ON trial_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_trial_booking_mobile ON trial_bookings(mobile_number);
CREATE INDEX IF NOT EXISTS idx_trial_booking_status ON trial_bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_trial_booking_created ON trial_bookings(created_at);

-- 11. registrations
CREATE TABLE IF NOT EXISTS registrations (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name                  VARCHAR(100) NOT NULL,
    last_name                   VARCHAR(100),
    date_of_birth               DATE,
    gender                      VARCHAR(20),
    mobile_number               VARCHAR(15) NOT NULL,
    alternate_mobile_number     VARCHAR(15),
    email                       VARCHAR(255),
    address_line_1              VARCHAR(255),
    address_line_2              VARCHAR(255),
    city                        VARCHAR(100),
    state                       VARCHAR(100),
    postal_code                 VARCHAR(20),
    emergency_contact_name      VARCHAR(150),
    emergency_contact_number    VARCHAR(15),
    relationship                VARCHAR(50),
    riding_experience           VARCHAR(50),
    medical_conditions          TEXT,
    comments                    TEXT,
    registration_status         VARCHAR(20) NOT NULL DEFAULT 'Pending',
    approved_by                 UUID,
    approved_at                 TIMESTAMPTZ,
    rejection_reason            TEXT,
    student_id                  UUID,
    trial_booking_id            UUID,
    is_active                   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ,
    created_by                  VARCHAR(100),
    updated_by                  VARCHAR(100),
    CONSTRAINT uq_registration_mobile UNIQUE(mobile_number),
    CONSTRAINT chk_registration_status CHECK(registration_status IN ('Pending','Approved','Rejected','Cancelled')),
    CONSTRAINT chk_reg_gender CHECK(gender IS NULL OR gender IN ('Male','Female','Other')),
    CONSTRAINT fk_registration_admin FOREIGN KEY(approved_by) REFERENCES administrators(id),
    CONSTRAINT fk_registration_trial_booking FOREIGN KEY(trial_booking_id) REFERENCES trial_bookings(id)
);
CREATE INDEX IF NOT EXISTS idx_registration_mobile ON registrations(mobile_number);
CREATE INDEX IF NOT EXISTS idx_registration_status ON registrations(registration_status);
CREATE INDEX IF NOT EXISTS idx_registration_created ON registrations(created_at);

-- 12. students
CREATE TABLE IF NOT EXISTS students (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id     UUID NOT NULL,
    student_number      VARCHAR(30) NOT NULL,
    joining_date        DATE NOT NULL,
    batch_id            UUID,
    membership_status   VARCHAR(20) NOT NULL DEFAULT 'Active',
    monthly_fee         NUMERIC(10,2),
    notes               TEXT,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ,
    created_by          VARCHAR(100),
    updated_by          VARCHAR(100),
    CONSTRAINT uq_student_number UNIQUE(student_number),
    CONSTRAINT uq_registration UNIQUE(registration_id),
    CONSTRAINT chk_membership_status CHECK(membership_status IN ('Active','Inactive','Suspended','Completed')),
    CONSTRAINT chk_monthly_fee CHECK(monthly_fee IS NULL OR monthly_fee >= 0),
    CONSTRAINT fk_student_registration FOREIGN KEY(registration_id) REFERENCES registrations(id),
    CONSTRAINT fk_student_batch FOREIGN KEY(batch_id) REFERENCES batches(id)
);
CREATE INDEX IF NOT EXISTS idx_student_number ON students(student_number);
CREATE INDEX IF NOT EXISTS idx_student_batch ON students(batch_id);
CREATE INDEX IF NOT EXISTS idx_student_membership ON students(membership_status);
CREATE INDEX IF NOT EXISTS idx_student_active ON students(is_active);

-- 13. fee_payments
CREATE TABLE IF NOT EXISTS fee_payments (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id              UUID NOT NULL,
    payment_date            DATE NOT NULL,
    payment_for_month       DATE NOT NULL,
    amount_paid             NUMERIC(10,2) NOT NULL,
    payment_mode            VARCHAR(30) NOT NULL,
    transaction_reference   VARCHAR(100),
    receipt_number          VARCHAR(50),
    remarks                 TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ,
    created_by              VARCHAR(100),
    updated_by              VARCHAR(100),
    CONSTRAINT fk_fee_student FOREIGN KEY(student_id) REFERENCES students(id),
    CONSTRAINT chk_amount_paid CHECK(amount_paid > 0),
    CONSTRAINT chk_payment_mode CHECK(payment_mode IN ('Cash','UPI','Card','Bank Transfer','Cheque','Other')),
    CONSTRAINT uq_receipt_number UNIQUE(receipt_number)
);
CREATE INDEX IF NOT EXISTS idx_fee_student ON fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_payment_date ON fee_payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_fee_month ON fee_payments(payment_for_month);

-- 14. attendance
CREATE TABLE IF NOT EXISTS attendance (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id          UUID NOT NULL,
    coach_id            UUID NOT NULL,
    attendance_date     DATE NOT NULL,
    attendance_status   VARCHAR(10) NOT NULL DEFAULT 'Present',
    remarks             TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ,
    created_by          VARCHAR(100),
    updated_by          VARCHAR(100),
    CONSTRAINT fk_attendance_student FOREIGN KEY(student_id) REFERENCES students(id),
    CONSTRAINT fk_attendance_coach FOREIGN KEY(coach_id) REFERENCES coaches(id),
    CONSTRAINT uq_attendance UNIQUE(student_id, attendance_date),
    CONSTRAINT chk_attendance_status CHECK(attendance_status IN ('Present','Absent'))
);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_coach ON attendance(coach_id);

-- 15. student_progress
CREATE TABLE IF NOT EXISTS student_progress (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id              UUID NOT NULL,
    coach_id                UUID NOT NULL,
    assessment_date         DATE NOT NULL,
    riding_level            VARCHAR(100) NOT NULL,
    skills_learned          TEXT,
    strengths               TEXT,
    areas_for_improvement   TEXT,
    next_goals              TEXT,
    coach_remarks           TEXT,
    performance_rating      INTEGER,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ,
    created_by              VARCHAR(100),
    updated_by              VARCHAR(100),
    CONSTRAINT fk_progress_student FOREIGN KEY(student_id) REFERENCES students(id),
    CONSTRAINT fk_progress_coach FOREIGN KEY(coach_id) REFERENCES coaches(id),
    CONSTRAINT chk_performance_rating CHECK(performance_rating IS NULL OR performance_rating BETWEEN 1 AND 5)
);
CREATE INDEX IF NOT EXISTS idx_progress_student ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_coach ON student_progress(coach_id);
CREATE INDEX IF NOT EXISTS idx_progress_date ON student_progress(assessment_date);

-- 16. student_video_links
CREATE TABLE IF NOT EXISTS student_video_links (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL,
    title           VARCHAR(300) NOT NULL,
    url             VARCHAR(1000) NOT NULL,
    display_order   INTEGER NOT NULL DEFAULT 1,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ,
    CONSTRAINT fk_video_student FOREIGN KEY(student_id) REFERENCES students(id)
);
CREATE INDEX IF NOT EXISTS idx_video_student ON student_video_links(student_id);

-- 17. student_photos
CREATE TABLE IF NOT EXISTS student_photos (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID NOT NULL,
    image_path  VARCHAR(500) NOT NULL,
    caption     VARCHAR(300),
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ,
    CONSTRAINT fk_photo_student FOREIGN KEY(student_id) REFERENCES students(id)
);
CREATE INDEX IF NOT EXISTS idx_photo_student ON student_photos(student_id);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO configuration(category,config_key,integer_value,description,display_order)
VALUES('TRIAL','TRIAL_FEE',400,'Fee per participant for trial ride.',1)
ON CONFLICT(category,config_key) DO NOTHING;

INSERT INTO configuration(category,config_key,json_value,description,display_order)
VALUES('TRIAL','TRIAL_TIME_SLOTS','[{"day":"Monday","start":"17:30","end":"18:00","capacity":2},{"day":"Monday","start":"18:00","end":"18:30","capacity":2},{"day":"Monday","start":"18:30","end":"19:00","capacity":2},{"day":"Tuesday","start":"17:30","end":"18:00","capacity":2},{"day":"Tuesday","start":"18:00","end":"18:30","capacity":2},{"day":"Tuesday","start":"18:30","end":"19:00","capacity":2},{"day":"Wednesday","start":"17:30","end":"18:00","capacity":2},{"day":"Wednesday","start":"18:00","end":"18:30","capacity":2},{"day":"Wednesday","start":"18:30","end":"19:00","capacity":2},{"day":"Thursday","start":"17:30","end":"18:00","capacity":2},{"day":"Thursday","start":"18:00","end":"18:30","capacity":2},{"day":"Thursday","start":"18:30","end":"19:00","capacity":2},{"day":"Friday","start":"17:30","end":"18:00","capacity":2},{"day":"Friday","start":"18:00","end":"18:30","capacity":2},{"day":"Friday","start":"18:30","end":"19:00","capacity":2},{"day":"Saturday","start":"17:30","end":"18:00","capacity":2},{"day":"Saturday","start":"18:00","end":"18:30","capacity":2},{"day":"Saturday","start":"18:30","end":"19:00","capacity":2},{"day":"Sunday","start":"07:30","end":"08:00","capacity":1}]','Trial ride schedule.',2)
ON CONFLICT(category,config_key) DO NOTHING;

INSERT INTO configuration(category,config_key,boolean_value,description,display_order)
VALUES('TRIAL','TRIAL_BOOKING_ENABLED',TRUE,'Enable or disable trial bookings.',3)
ON CONFLICT (category, config_key) DO NOTHING;
INSERT INTO configuration (category, config_key, integer_value, description, display_order)
VALUES('ATTENDANCE','DASHBOARD_MONTHS',2,'Number of past months of attendance records to display on the Coach Dashboard and Admin Dashboard. E.g. 2 = show current month + previous month.',1)
ON CONFLICT(category,config_key) DO NOTHING;

INSERT INTO configuration(category,config_key,string_value,description,display_order)
VALUES('WEBSITE','CLUB_NAME','Horse Riding Club','Website title.',1)
ON CONFLICT(category,config_key) DO NOTHING;

INSERT INTO configuration(category,config_key,string_value,description,display_order)
VALUES('CONTACT','PRIMARY_PHONE','','Primary contact number.',1)
ON CONFLICT(category,config_key) DO NOTHING;

INSERT INTO configuration(category,config_key,string_value,description,display_order)
VALUES('CONTACT','PRIMARY_EMAIL','','Primary email address.',2)
ON CONFLICT(category,config_key) DO NOTHING;

INSERT INTO configuration(category,config_key,json_value,description,display_order)
VALUES('BUSINESS','BUSINESS_HOURS','{"monday":"Closed","tuesday":"05:30-19:00","wednesday":"05:30-19:00","thursday":"05:30-19:00","friday":"05:30-19:00","saturday":"06:00-19:00","sunday":"06:00-08:00"}','Club operating hours.',1)
ON CONFLICT(category,config_key) DO NOTHING;

INSERT INTO administrators(first_name,last_name,mobile_number,email,created_by)
VALUES('System','Administrator','9999999999','admin@localhost','SYSTEM')
ON CONFLICT(mobile_number) DO NOTHING;

INSERT INTO facilities(facility_name,short_description,display_order,show_on_homepage,created_by)
VALUES
('Horse Riding Training','Professional horse riding lessons for beginners and experienced riders.',1,TRUE,'SYSTEM'),
('Horse Livery','Full and partial horse livery services.',2,TRUE,'SYSTEM'),
('Horse Leasing','Horse leasing for show jumping and competitions.',3,TRUE,'SYSTEM')
ON CONFLICT(facility_name) DO NOTHING;

INSERT INTO club_locations(branch_name,address_line_1,city,state,country,display_order,show_on_website,created_by)
VALUES
('Noida','','Noida','Uttar Pradesh','India',1,TRUE,'SYSTEM'),
('New Delhi','','New Delhi','Delhi','India',2,TRUE,'SYSTEM')
ON CONFLICT(branch_name) DO NOTHING;
