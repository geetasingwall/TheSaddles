from __future__ import annotations
from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, field_validator


# ─── Shared ────────────────────────────────────────────────────────────────

class OrmBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ─── Auth ──────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    mobile_number: str

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile(cls, v: str) -> str:
        v = v.strip()
        if not v.isdigit() or len(v) < 10:
            raise ValueError("Invalid mobile number")
        return v


class LoginResponse(OrmBase):
    user_type: str
    user_id: Optional[str] = None
    name: Optional[str] = None
    mobile_number: str
    dashboard: Optional[str] = None


# ─── Configuration ─────────────────────────────────────────────────────────

class ConfigurationOut(OrmBase):
    id: UUID
    category: str
    config_key: str
    string_value: Optional[str] = None
    integer_value: Optional[int] = None
    decimal_value: Optional[Decimal] = None
    boolean_value: Optional[bool] = None
    json_value: Optional[Any] = None
    description: Optional[str] = None
    is_active: bool
    display_order: int


class ConfigurationUpdate(BaseModel):
    string_value: Optional[str] = None
    integer_value: Optional[int] = None
    decimal_value: Optional[Decimal] = None
    boolean_value: Optional[bool] = None
    json_value: Optional[Any] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


# ─── Trial Booking ─────────────────────────────────────────────────────────

class TrialSlot(BaseModel):
    slot_id: str
    day: str
    start_time: str
    end_time: str
    capacity: int
    booked: int
    available_slots: int


class TrialBookingCreate(BaseModel):
    full_name: str
    mobile_number: str
    place: str
    booking_date: date
    start_time: str
    end_time: str
    number_of_participants: int = 1

    @field_validator("place")
    @classmethod
    def validate_place(cls, v: str) -> str:
        if v not in ("Noida", "New Delhi"):
            raise ValueError("Place must be Noida or New Delhi")
        return v

    @field_validator("number_of_participants")
    @classmethod
    def validate_participants(cls, v: int) -> int:
        if v < 1:
            raise ValueError("At least 1 participant required")
        return v


class TrialBookingOut(OrmBase):
    id: UUID
    booking_reference: str
    booking_date: date
    start_time: time
    end_time: time
    number_of_participants: int
    amount_per_person: Decimal
    total_amount: Decimal
    full_name: str
    mobile_number: str
    place: str
    booking_status: str
    remarks: Optional[str] = None
    created_at: datetime


# ─── Registration ──────────────────────────────────────────────────────────

class RegistrationCreate(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    mobile_number: str
    email: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    address_line_1: Optional[str] = None
    riding_experience: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_number: Optional[str] = None
    relationship: Optional[str] = None
    medical_conditions: Optional[str] = None
    comments: Optional[str] = None
    trial_booking_id: Optional[UUID] = None

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile(cls, v: str) -> str:
        v = v.strip()
        if not v.isdigit() or len(v) < 10:
            raise ValueError("Invalid mobile number")
        return v


class RegistrationOut(OrmBase):
    id: UUID
    first_name: str
    last_name: Optional[str] = None
    mobile_number: str
    email: Optional[str] = None
    gender: Optional[str] = None
    city: Optional[str] = None
    riding_experience: Optional[str] = None
    registration_status: str
    created_at: datetime


class RegistrationApprove(BaseModel):
    batch_id: Optional[UUID] = None
    monthly_fee: Optional[Decimal] = None
    notes: Optional[str] = None


class RegistrationReject(BaseModel):
    rejection_reason: Optional[str] = None


# ─── Student ───────────────────────────────────────────────────────────────

class StudentOut(OrmBase):
    id: UUID
    student_number: str
    joining_date: date
    membership_status: str
    monthly_fee: Optional[Decimal] = None
    batch_id: Optional[UUID] = None
    is_active: bool


class StudentProfileOut(OrmBase):
    id: UUID
    student_number: str
    joining_date: date
    membership_status: str
    monthly_fee: Optional[Decimal] = None
    first_name: str = ""
    last_name: Optional[str] = None
    mobile_number: str = ""
    email: Optional[str] = None
    city: Optional[str] = None


class StudentStatusUpdate(BaseModel):
    membership_status: str

    @field_validator("membership_status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        allowed = {"Active", "Inactive", "Suspended", "Completed"}
        if v not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return v


# ─── Coach ─────────────────────────────────────────────────────────────────

class CoachCreate(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    mobile_number: str
    email: Optional[str] = None
    experience_years: Optional[int] = None
    specialization: Optional[str] = None
    joining_date: Optional[date] = None
    assigned_place: Optional[str] = None

    @field_validator("assigned_place")
    @classmethod
    def validate_place(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ("Noida", "New Delhi"):
            raise ValueError("assigned_place must be Noida or New Delhi")
        return v


class CoachOut(OrmBase):
    id: UUID
    first_name: str
    last_name: Optional[str] = None
    mobile_number: str
    email: Optional[str] = None
    experience_years: Optional[int] = None
    specialization: Optional[str] = None
    is_active: bool


class CoachUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    experience_years: Optional[int] = None
    specialization: Optional[str] = None
    assigned_place: Optional[str] = None
    is_active: Optional[bool] = None


# ─── Batch ─────────────────────────────────────────────────────────────────

class BatchCreate(BaseModel):
    batch_name: str
    coach_id: UUID
    training_day: str
    start_time: time
    end_time: time
    maximum_strength: int = 8
    description: Optional[str] = None


class BatchUpdate(BaseModel):
    batch_name: Optional[str] = None
    coach_id: Optional[UUID] = None
    training_day: Optional[str] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    maximum_strength: Optional[int] = None
    is_active: Optional[bool] = None


class BatchOut(OrmBase):
    id: UUID
    batch_name: str
    coach_id: UUID
    training_day: str
    start_time: time
    end_time: time
    maximum_strength: int
    is_active: bool
    description: Optional[str] = None


# ─── Attendance ────────────────────────────────────────────────────────────

class AttendanceRecord(BaseModel):
    student_id: UUID
    status: str
    remarks: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in ("Present", "Absent"):
            raise ValueError("Status must be Present or Absent")
        return v


class AttendanceBulkCreate(BaseModel):
    attendance_date: date
    batch_id: UUID
    records: List[AttendanceRecord]


class AttendanceOut(OrmBase):
    id: UUID
    student_id: UUID
    coach_id: UUID
    attendance_date: date
    attendance_status: str
    remarks: Optional[str] = None


class AttendanceUpdate(BaseModel):
    attendance_status: str
    remarks: Optional[str] = None


# ─── Progress ──────────────────────────────────────────────────────────────

class ProgressCreate(BaseModel):
    student_id: UUID
    assessment_date: date
    riding_level: str
    skills_learned: Optional[str] = None
    strengths: Optional[str] = None
    areas_for_improvement: Optional[str] = None
    next_goals: Optional[str] = None
    coach_remarks: Optional[str] = None
    performance_rating: Optional[int] = None

    @field_validator("performance_rating")
    @classmethod
    def validate_rating(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and not (1 <= v <= 5):
            raise ValueError("Rating must be between 1 and 5")
        return v


class ProgressOut(OrmBase):
    id: UUID
    student_id: UUID
    coach_id: UUID
    assessment_date: date
    riding_level: str
    skills_learned: Optional[str] = None
    strengths: Optional[str] = None
    areas_for_improvement: Optional[str] = None
    next_goals: Optional[str] = None
    coach_remarks: Optional[str] = None
    performance_rating: Optional[int] = None
    created_at: datetime


# ─── Fee Payment ───────────────────────────────────────────────────────────

class FeePaymentCreate(BaseModel):
    student_id: UUID
    payment_date: date
    payment_for_month: date
    amount_paid: Decimal
    payment_mode: str
    transaction_reference: Optional[str] = None
    receipt_number: Optional[str] = None
    remarks: Optional[str] = None

    @field_validator("payment_mode")
    @classmethod
    def validate_mode(cls, v: str) -> str:
        allowed = {"Cash", "UPI", "Card", "Bank Transfer", "Cheque", "Other"}
        if v not in allowed:
            raise ValueError(f"Payment mode must be one of {allowed}")
        return v


class FeePaymentOut(OrmBase):
    id: UUID
    student_id: UUID
    payment_date: date
    payment_for_month: date
    amount_paid: Decimal
    payment_mode: str
    receipt_number: Optional[str] = None
    created_at: datetime


# ─── Horse ─────────────────────────────────────────────────────────────────

class HorseCreate(BaseModel):
    stable_name: str
    registered_name: Optional[str] = None
    gender: Optional[str] = None
    approximate_age_years: Optional[int] = None
    breed: Optional[str] = None
    color: Optional[str] = None
    height_cm: Optional[Decimal] = None
    weight_kg: Optional[Decimal] = None
    temperament: Optional[str] = None
    training_level: Optional[str] = None
    suitable_for_beginners: bool = True
    available_for_lessons: bool = True
    available_for_lease: bool = False
    lease_events: Optional[str] = None
    notes: Optional[str] = None


class HorseOut(OrmBase):
    id: UUID
    stable_name: str
    registered_name: Optional[str] = None
    gender: Optional[str] = None
    approximate_age_years: Optional[int] = None
    breed: Optional[str] = None
    color: Optional[str] = None
    training_level: Optional[str] = None
    suitable_for_beginners: bool
    available_for_lessons: bool
    available_for_lease: bool
    lease_events: Optional[str] = None
    image_path: Optional[str] = None
    is_active: bool


class HorseUpdate(BaseModel):
    stable_name: Optional[str] = None
    registered_name: Optional[str] = None
    gender: Optional[str] = None
    approximate_age_years: Optional[int] = None
    breed: Optional[str] = None
    color: Optional[str] = None
    height_cm: Optional[Decimal] = None
    weight_kg: Optional[Decimal] = None
    temperament: Optional[str] = None
    training_level: Optional[str] = None
    suitable_for_beginners: Optional[bool] = None
    available_for_lessons: Optional[bool] = None
    available_for_lease: Optional[bool] = None
    lease_events: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None


# ─── Facility ──────────────────────────────────────────────────────────────

class FacilityCreate(BaseModel):
    facility_name: str
    short_description: Optional[str] = None
    detailed_description: Optional[str] = None
    display_order: int = 1
    show_on_homepage: bool = False


class FacilityOut(OrmBase):
    id: UUID
    facility_name: str
    short_description: Optional[str] = None
    detailed_description: Optional[str] = None
    image_path: Optional[str] = None
    display_order: int
    show_on_homepage: bool
    is_active: bool


class FacilityUpdate(BaseModel):
    facility_name: Optional[str] = None
    short_description: Optional[str] = None
    detailed_description: Optional[str] = None
    display_order: Optional[int] = None
    show_on_homepage: Optional[bool] = None
    is_active: Optional[bool] = None


# ─── Team Member ───────────────────────────────────────────────────────────

class TeamMemberCreate(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    designation: str
    short_bio: Optional[str] = None
    detailed_bio: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    display_order: int = 1
    show_on_homepage: bool = False


class TeamMemberOut(OrmBase):
    id: UUID
    first_name: str
    last_name: Optional[str] = None
    designation: str
    short_bio: Optional[str] = None
    profile_image_path: Optional[str] = None
    display_order: int
    show_on_homepage: bool
    is_active: bool


class TeamMemberUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    designation: Optional[str] = None
    short_bio: Optional[str] = None
    detailed_bio: Optional[str] = None
    display_order: Optional[int] = None
    show_on_homepage: Optional[bool] = None
    is_active: Optional[bool] = None


# ─── Testimonial ───────────────────────────────────────────────────────────

class TestimonialCreate(BaseModel):
    customer_name: str
    customer_type: str
    rating: int
    testimonial: str
    display_order: int = 1
    show_on_homepage: bool = True
    is_approved: bool = False

    @field_validator("customer_type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in ("Student", "Parent"):
            raise ValueError("customer_type must be Student or Parent")
        return v

    @field_validator("rating")
    @classmethod
    def validate_rating(cls, v: int) -> int:
        if not (1 <= v <= 5):
            raise ValueError("Rating must be between 1 and 5")
        return v


class TestimonialOut(OrmBase):
    id: UUID
    customer_name: str
    customer_type: str
    rating: int
    testimonial: str
    profile_image_path: Optional[str] = None
    display_order: int
    show_on_homepage: bool
    is_approved: bool
    is_active: bool


class TestimonialUpdate(BaseModel):
    customer_name: Optional[str] = None
    testimonial: Optional[str] = None
    rating: Optional[int] = None
    display_order: Optional[int] = None
    show_on_homepage: Optional[bool] = None
    is_approved: Optional[bool] = None
    is_active: Optional[bool] = None


# ─── Location ──────────────────────────────────────────────────────────────

class LocationCreate(BaseModel):
    branch_name: str
    address_line_1: str
    city: str
    state: str
    country: str = "India"
    postal_code: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    display_order: int = 1
    short_description: Optional[str] = None


class LocationOut(OrmBase):
    id: UUID
    branch_name: str
    address_line_1: str
    address_line_2: Optional[str] = None
    city: str
    state: str
    country: str
    postal_code: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    display_order: int
    show_on_website: bool
    is_active: bool
    short_description: Optional[str] = None


class LocationUpdate(BaseModel):
    branch_name: Optional[str] = None
    address_line_1: Optional[str] = None
    address_line_2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    display_order: Optional[int] = None
    show_on_website: Optional[bool] = None
    is_active: Optional[bool] = None
    short_description: Optional[str] = None


# ─── Admin Dashboard ───────────────────────────────────────────────────────

class AdminDashboardOut(BaseModel):
    total_students: int
    active_students: int
    pending_registrations: int
    today_bookings: int
    total_horses: int
    active_coaches: int


# ─── Student Video Link ────────────────────────────────────────────────────

class VideoLinkCreate(BaseModel):
    title: str
    url: str
    display_order: int = 1


class VideoLinkOut(OrmBase):
    id: UUID
    student_id: UUID
    title: str
    url: str
    display_order: int
    is_active: bool
