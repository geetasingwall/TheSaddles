import uuid
from datetime import datetime, date, time
from decimal import Decimal
from sqlalchemy import (
    Boolean, Column, Date, DateTime, ForeignKey, Integer,
    Numeric, String, Text, Time, UniqueConstraint, CheckConstraint
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship as orm_relationship
from app.database.connection import Base


def _uuid():
    return str(uuid.uuid4())


class Configuration(Base):
    __tablename__ = "configuration"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category = Column(String(50), nullable=False)
    config_key = Column(String(100), nullable=False)
    string_value = Column(Text)
    integer_value = Column(Integer)
    decimal_value = Column(Numeric(12, 2))
    boolean_value = Column(Boolean)
    json_value = Column(JSONB)
    description = Column(Text)
    is_active = Column(Boolean, nullable=False, default=True)
    display_order = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))

    __table_args__ = (UniqueConstraint("category", "config_key", name="uq_configuration"),)


class Administrator(Base):
    __tablename__ = "administrators"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100))
    mobile_number = Column(String(15), nullable=False, unique=True)
    email = Column(String(255), unique=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name or ''}".strip()


class Coach(Base):
    __tablename__ = "coaches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100))
    mobile_number = Column(String(15), nullable=False, unique=True)
    email = Column(String(255), unique=True)
    experience_years = Column(Integer)
    specialization = Column(String(200))
    joining_date = Column(Date)
    assigned_place = Column(String(20))
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))

    batches = orm_relationship("Batch", back_populates="coach")
    attendance_records = orm_relationship("Attendance", back_populates="coach")
    progress_records = orm_relationship("StudentProgress", back_populates="coach")

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name or ''}".strip()


class Batch(Base):
    __tablename__ = "batches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_name = Column(String(100), nullable=False)
    description = Column(Text)
    coach_id = Column(UUID(as_uuid=True), ForeignKey("coaches.id"), nullable=False)
    training_day = Column(String(20), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    maximum_strength = Column(Integer, nullable=False, default=8)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))

    coach = orm_relationship("Coach", back_populates="batches")
    students = orm_relationship("Student", back_populates="batch")


class Facility(Base):
    __tablename__ = "facilities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    facility_name = Column(String(150), nullable=False, unique=True)
    short_description = Column(String(500))
    detailed_description = Column(Text)
    image_path = Column(String(500))
    display_order = Column(Integer, nullable=False, default=1)
    show_on_homepage = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))


class Horse(Base):
    __tablename__ = "horses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    registered_name = Column(String(150))
    stable_name = Column(String(100), nullable=False, unique=True)
    gender = Column(String(20))
    date_of_birth = Column(Date)
    approximate_age_years = Column(Integer)
    breed = Column(String(100))
    color = Column(String(100))
    height_cm = Column(Numeric(5, 2))
    weight_kg = Column(Numeric(6, 2))
    temperament = Column(String(100))
    training_level = Column(String(100))
    suitable_for_beginners = Column(Boolean, nullable=False, default=True)
    available_for_lessons = Column(Boolean, nullable=False, default=True)
    available_for_lease = Column(Boolean, nullable=False, default=False)
    lease_events = Column(Text)
    image_path = Column(String(500))
    gallery_images = Column(JSONB, default=list)
    notes = Column(Text)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100))
    designation = Column(String(150), nullable=False)
    short_bio = Column(String(500))
    detailed_bio = Column(Text)
    email = Column(String(255))
    phone_number = Column(String(15))
    facebook_url = Column(String(500))
    instagram_url = Column(String(500))
    linkedin_url = Column(String(500))
    profile_image_path = Column(String(500))
    display_order = Column(Integer, nullable=False, default=1)
    show_on_homepage = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name or ''}".strip()


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_name = Column(String(150), nullable=False)
    customer_type = Column(String(20), nullable=False)
    rating = Column(Integer, nullable=False, default=5)
    testimonial = Column(Text, nullable=False)
    profile_image_path = Column(String(500))
    display_order = Column(Integer, nullable=False, default=1)
    show_on_homepage = Column(Boolean, nullable=False, default=True)
    is_approved = Column(Boolean, nullable=False, default=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))


class ClubLocation(Base):
    __tablename__ = "club_locations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    branch_name = Column(String(150), nullable=False, unique=True)
    short_description = Column(String(300))
    address_line_1 = Column(String(255), nullable=False)
    address_line_2 = Column(String(255))
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    postal_code = Column(String(20))
    country = Column(String(100), nullable=False, default="India")
    latitude = Column(Numeric(10, 7))
    longitude = Column(Numeric(10, 7))
    contact_number = Column(String(15))
    email = Column(String(255))
    image_path = Column(String(500))
    display_order = Column(Integer, nullable=False, default=1)
    show_on_website = Column(Boolean, nullable=False, default=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))


class TrialBooking(Base):
    __tablename__ = "trial_bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_reference = Column(String(30), nullable=False, unique=True)
    booking_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    number_of_participants = Column(Integer, nullable=False, default=1)
    amount_per_person = Column(Numeric(10, 2), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    full_name = Column(String(200), nullable=False)
    mobile_number = Column(String(15), nullable=False)
    place = Column(String(100), nullable=False)
    booking_status = Column(String(20), nullable=False, default="Booked")
    remarks = Column(Text)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))


class Registration(Base):
    __tablename__ = "registrations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100))
    date_of_birth = Column(Date)
    gender = Column(String(20))
    mobile_number = Column(String(15), nullable=False, unique=True)
    alternate_mobile_number = Column(String(15))
    email = Column(String(255))
    address_line_1 = Column(String(255))
    address_line_2 = Column(String(255))
    city = Column(String(100))
    state = Column(String(100))
    postal_code = Column(String(20))
    emergency_contact_name = Column(String(150))
    emergency_contact_number = Column(String(15))
    relationship = Column(String(50))
    riding_experience = Column(String(50))
    medical_conditions = Column(Text)
    comments = Column(Text)
    registration_status = Column(String(20), nullable=False, default="Pending")
    approved_by = Column(UUID(as_uuid=True), ForeignKey("administrators.id"))
    approved_at = Column(DateTime(timezone=True))
    rejection_reason = Column(Text)
    student_id = Column(UUID(as_uuid=True))
    trial_booking_id = Column(UUID(as_uuid=True), ForeignKey("trial_bookings.id"))
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))

    approver = orm_relationship("Administrator")
    student = orm_relationship("Student", back_populates="registration", uselist=False)

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name or ''}".strip()


class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    registration_id = Column(UUID(as_uuid=True), ForeignKey("registrations.id"), nullable=False, unique=True)
    student_number = Column(String(30), nullable=False, unique=True)
    joining_date = Column(Date, nullable=False)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("batches.id"))
    membership_status = Column(String(20), nullable=False, default="Active")
    monthly_fee = Column(Numeric(10, 2))
    notes = Column(Text)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))

    registration = orm_relationship("Registration", back_populates="student")
    batch = orm_relationship("Batch", back_populates="students")
    attendance_records = orm_relationship("Attendance", back_populates="student")
    progress_records = orm_relationship("StudentProgress", back_populates="student")
    fee_payments = orm_relationship("FeePayment", back_populates="student")


class FeePayment(Base):
    __tablename__ = "fee_payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    payment_date = Column(Date, nullable=False)
    payment_for_month = Column(Date, nullable=False)
    amount_paid = Column(Numeric(10, 2), nullable=False)
    payment_mode = Column(String(30), nullable=False)
    transaction_reference = Column(String(100))
    receipt_number = Column(String(50), unique=True)
    remarks = Column(Text)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))

    student = orm_relationship("Student", back_populates="fee_payments")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    coach_id = Column(UUID(as_uuid=True), ForeignKey("coaches.id"), nullable=False)
    attendance_date = Column(Date, nullable=False)
    attendance_status = Column(String(10), nullable=False, default="Present")
    remarks = Column(Text)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))

    student = orm_relationship("Student", back_populates="attendance_records")
    coach = orm_relationship("Coach", back_populates="attendance_records")

    __table_args__ = (UniqueConstraint("student_id", "attendance_date", name="uq_attendance"),)


class StudentProgress(Base):
    __tablename__ = "student_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    coach_id = Column(UUID(as_uuid=True), ForeignKey("coaches.id"), nullable=False)
    assessment_date = Column(Date, nullable=False)
    riding_level = Column(String(100), nullable=False)
    skills_learned = Column(Text)
    strengths = Column(Text)
    areas_for_improvement = Column(Text)
    next_goals = Column(Text)
    coach_remarks = Column(Text)
    performance_rating = Column(Integer)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))

    student = orm_relationship("Student", back_populates="progress_records")
    coach = orm_relationship("Coach", back_populates="progress_records")
