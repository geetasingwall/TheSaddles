from __future__ import annotations
import hashlib
import json
from datetime import date, datetime, time, timedelta
from typing import Any, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.repositories.repositories import (
    ConfigurationRepository, AdministratorRepository, CoachRepository,
    BatchRepository, TrialBookingRepository, RegistrationRepository,
    StudentRepository, AttendanceRepository, ProgressRepository,
    FeePaymentRepository, HorseRepository, FacilityRepository,
    TeamMemberRepository, TestimonialRepository, LocationRepository,
)
from app.schemas.schemas import (
    LoginRequest, TrialBookingCreate, RegistrationCreate,
    RegistrationApprove, RegistrationReject, AttendanceBulkCreate,
    ProgressCreate, FeePaymentCreate, CoachCreate, CoachUpdate,
    HorseCreate, HorseUpdate, FacilityCreate, FacilityUpdate,
    TeamMemberCreate, TeamMemberUpdate, TestimonialCreate, TestimonialUpdate,
    LocationCreate, LocationUpdate, ConfigurationUpdate, BatchCreate,
    StudentStatusUpdate,
)


# ─── Auth Service ──────────────────────────────────────────────────────────

class AuthService:
    def __init__(self, db: Session):
        self.admin_repo = AdministratorRepository(db)
        self.coach_repo = CoachRepository(db)
        self.student_repo = StudentRepository(db)
        self.reg_repo = RegistrationRepository(db)

    def login(self, mobile: str) -> dict:
        admin = self.admin_repo.get_by_mobile(mobile)
        if admin:
            return {"user_type": "ADMIN", "user_id": str(admin.id), "name": admin.full_name, "mobile_number": mobile, "dashboard": "/admin"}

        coach = self.coach_repo.get_by_mobile(mobile)
        if coach:
            return {"user_type": "COACH", "user_id": str(coach.id), "name": coach.full_name, "mobile_number": mobile, "dashboard": "/coach"}

        student = self.student_repo.get_by_mobile(mobile)
        if student:
            reg = student.registration
            return {"user_type": "STUDENT", "user_id": str(student.id), "name": reg.full_name if reg else "", "mobile_number": mobile, "dashboard": "/student"}

        reg = self.reg_repo.get_by_mobile(mobile)
        if reg and reg.registration_status == "Pending":
            return {"user_type": "PENDING", "user_id": str(reg.id), "name": reg.full_name, "mobile_number": mobile, "dashboard": "/pending"}

        return {"user_type": "UNKNOWN", "mobile_number": mobile, "dashboard": "/register"}


# ─── Configuration Service ─────────────────────────────────────────────────

class ConfigurationService:
    def __init__(self, db: Session):
        self.repo = ConfigurationRepository(db)

    def get_all(self):
        return self.repo.get_all()

    def get_by_category(self, category: str):
        return self.repo.get_by_category(category)

    def get_value(self, category: str, key: str) -> Any:
        config = self.repo.get_by_key(category, key)
        if not config:
            return None
        for field in ("string_value", "integer_value", "decimal_value", "boolean_value", "json_value"):
            val = getattr(config, field)
            if val is not None:
                return val
        return None

    def update(self, category: str, key: str, data: ConfigurationUpdate) -> Any:
        config = self.repo.get_by_key(category, key)
        if not config:
            raise ValueError(f"Configuration {category}/{key} not found")
        return self.repo.update(config, data.model_dump(exclude_none=True))


# ─── Trial Booking Service ─────────────────────────────────────────────────

class TrialBookingService:
    def __init__(self, db: Session):
        self.repo = TrialBookingRepository(db)
        self.config_repo = ConfigurationRepository(db)

    def _get_trial_fee(self) -> int:
        config = self.config_repo.get_by_key("TRIAL", "TRIAL_FEE")
        return config.integer_value if config and config.integer_value else 400

    def _get_slots(self) -> list[dict]:
        config = self.config_repo.get_by_key("TRIAL", "TRIAL_TIME_SLOTS")
        if not config:
            return []
        raw = config.json_value or config.string_value
        if not raw:
            return []
        if isinstance(raw, str):
            raw = json.loads(raw)
        return raw

    def get_available_dates(self, weeks_ahead: int = 8) -> list[dict]:
        slots = self._get_slots()
        trial_days = {s["day"] for s in slots}
        today = date.today()
        result = []
        for i in range(weeks_ahead * 7):
            d = today + timedelta(days=i)
            day_name = d.strftime("%A")
            if day_name in trial_days:
                result.append({"date": d.isoformat(), "day": day_name, "available": True})
        return result

    def get_slots_for_date(self, booking_date: date) -> list[dict]:
        slots = self._get_slots()
        day_name = booking_date.strftime("%A")
        result = []
        for idx, slot in enumerate(slots):
            if slot["day"] != day_name:
                continue
            start = datetime.strptime(slot["start"], "%H:%M").time()
            end = datetime.strptime(slot["end"], "%H:%M").time()
            capacity = slot.get("capacity", 2)
            booked = self.repo.count_booked_for_slot(booking_date, start, end)
            available = max(0, capacity - booked)
            result.append({
                "slot_id": f"{booking_date.isoformat()}_{slot['start']}_{slot['end']}",
                "day": day_name,
                "start_time": slot["start"],
                "end_time": slot["end"],
                "capacity": capacity,
                "booked": booked,
                "available_slots": available,
            })
        return result

    def create_booking(self, data: TrialBookingCreate) -> Any:
        fee = self._get_trial_fee()
        slots = self.get_slots_for_date(data.booking_date)
        slot = next((s for s in slots if s["start_time"] == data.start_time and s["end_time"] == data.end_time), None)
        if not slot:
            raise ValueError("Invalid time slot for selected date")
        if slot["available_slots"] < data.number_of_participants:
            raise ValueError("SLOT_FULL: Not enough capacity in selected slot")

        start_t = datetime.strptime(data.start_time, "%H:%M").time()
        end_t = datetime.strptime(data.end_time, "%H:%M").time()
        ref = f"TRB{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{data.mobile_number[-4:]}"
        total = fee * data.number_of_participants

        return self.repo.create({
            "booking_reference": ref,
            "booking_date": data.booking_date,
            "start_time": start_t,
            "end_time": end_t,
            "number_of_participants": data.number_of_participants,
            "amount_per_person": fee,
            "total_amount": total,
            "full_name": data.full_name,
            "mobile_number": data.mobile_number,
            "place": data.place,
            "booking_status": "Booked",
        })

    def get_all(self):
        # Auto-mark past Booked bookings as No Show
        now = datetime.utcnow()
        past_booked = self.repo.get_past_booked(now)
        for b in past_booked:
            self.repo.update_status(b, "No Show")
        return self.repo.get_all()

    def get_by_id(self, booking_id: UUID):
        booking = self.repo.get_by_id(booking_id)
        if not booking:
            raise ValueError("Booking not found")
        return booking

    def complete(self, booking_id: UUID) -> Any:
        booking = self.get_by_id(booking_id)
        if booking.booking_status != "Booked":
            raise ValueError(f"Cannot complete a booking with status '{booking.booking_status}'")
        return self.repo.update_status(booking, "Completed")

    def cancel(self, booking_id: UUID):
        booking = self.get_by_id(booking_id)
        if booking.booking_status == "Cancelled":
            raise ValueError("Booking already cancelled")
        return self.repo.update_status(booking, "Cancelled")


# ─── Registration Service ──────────────────────────────────────────────────

class RegistrationService:
    def __init__(self, db: Session):
        self.repo = RegistrationRepository(db)
        self.student_repo = StudentRepository(db)
        self.admin_repo = AdministratorRepository(db)

    def create(self, data: RegistrationCreate) -> Any:
        existing = self.repo.get_by_mobile(data.mobile_number)
        if existing:
            raise ValueError("Mobile number already registered")
        existing_student = self.student_repo.get_by_mobile(data.mobile_number)
        if existing_student:
            raise ValueError("Mobile number already has an active student account")
        dump = data.model_dump()
        # Convert empty strings to None to satisfy DB check constraints
        for k, v in dump.items():
            if v == "":
                dump[k] = None
        return self.repo.create(dump)

    def get_status(self, mobile: str) -> dict:
        reg = self.repo.get_by_mobile(mobile)
        if not reg:
            raise ValueError("Registration not found")
        return {"mobile_number": mobile, "status": reg.registration_status, "registration_id": str(reg.id)}

    def get_all(self, status: Optional[str] = None):
        return self.repo.get_all(status)

    def get_by_id(self, reg_id: UUID):
        reg = self.repo.get_by_id(reg_id)
        if not reg:
            raise ValueError("Registration not found")
        return reg

    def approve(self, reg_id: UUID, admin_id: UUID, data: RegistrationApprove) -> Any:
        reg = self.get_by_id(reg_id)
        if reg.registration_status != "Pending":
            raise ValueError("Only pending registrations can be approved")
        student_number = self.student_repo.next_student_number()
        student = self.student_repo.create({
            "registration_id": reg.id,
            "student_number": student_number,
            "joining_date": date.today(),
            "batch_id": data.batch_id,
            "monthly_fee": data.monthly_fee,
            "notes": data.notes,
        })
        self.repo.update(reg, {
            "registration_status": "Approved",
            "approved_by": admin_id,
            "approved_at": datetime.utcnow(),
            "student_id": student.id,
        })
        return student

    def reject(self, reg_id: UUID, admin_id: UUID, data: RegistrationReject) -> Any:
        reg = self.get_by_id(reg_id)
        if reg.registration_status != "Pending":
            raise ValueError("Only pending registrations can be rejected")
        return self.repo.update(reg, {
            "registration_status": "Rejected",
            "approved_by": admin_id,
            "approved_at": datetime.utcnow(),
            "rejection_reason": data.rejection_reason,
        })


# ─── Student Service ───────────────────────────────────────────────────────

class StudentService:
    def __init__(self, db: Session):
        self.repo = StudentRepository(db)
        self.att_repo = AttendanceRepository(db)
        self.prog_repo = ProgressRepository(db)
        self.fee_repo = FeePaymentRepository(db)

    def get_dashboard(self, student_id: UUID) -> dict:
        student = self.repo.get_by_id(student_id)
        if not student:
            raise ValueError("Student not found")
        att_summary = self.att_repo.count_by_student(student_id)
        total_paid = self.fee_repo.total_paid(student_id)
        progress = self.prog_repo.get_by_student(student_id)
        current_level = progress[0].riding_level if progress else "Beginner"
        reg = student.registration
        return {
            "student": {
                "id": str(student.id),
                "student_number": student.student_number,
                "name": reg.full_name if reg else "",
                "mobile_number": reg.mobile_number if reg else "",
                "status": student.membership_status,
                "joining_date": student.joining_date.isoformat(),
            },
            "attendance": {
                "total_classes": att_summary["total"],
                "present": att_summary["present"],
                "absent": att_summary["absent"],
                "percentage": round(att_summary["present"] / att_summary["total"] * 100, 1) if att_summary["total"] > 0 else 0,
            },
            "fees": {
                "monthly_fee": float(student.monthly_fee or 0),
                "total_paid": total_paid,
            },
            "progress": {"current_level": current_level},
        }

    def get_profile(self, student_id: UUID) -> dict:
        student = self.repo.get_by_id(student_id)
        if not student:
            raise ValueError("Student not found")
        reg = student.registration
        return {
            "id": str(student.id),
            "student_number": student.student_number,
            "joining_date": student.joining_date.isoformat(),
            "membership_status": student.membership_status,
            "monthly_fee": float(student.monthly_fee or 0),
            "first_name": reg.first_name if reg else "",
            "last_name": reg.last_name if reg else None,
            "mobile_number": reg.mobile_number if reg else "",
            "email": reg.email if reg else None,
            "city": reg.city if reg else None,
        }

    def get_attendance(self, student_id: UUID) -> dict:
        records = self.att_repo.get_by_student(student_id)
        summary = self.att_repo.count_by_student(student_id)
        return {
            "summary": {
                **summary,
                "percentage": round(summary["present"] / summary["total"] * 100, 1) if summary["total"] > 0 else 0,
            },
            "records": [{"date": r.attendance_date.isoformat(), "status": r.attendance_status, "remarks": r.remarks} for r in records],
        }

    def get_fees(self, student_id: UUID) -> dict:
        student = self.repo.get_by_id(student_id)
        if not student:
            raise ValueError("Student not found")
        payments = self.fee_repo.get_by_student(student_id)
        total_paid = self.fee_repo.total_paid(student_id)
        return {
            "monthly_fee": float(student.monthly_fee or 0),
            "total_paid": total_paid,
            "payment_history": [
                {"date": p.payment_date.isoformat(), "amount": float(p.amount_paid), "mode": p.payment_mode, "month": p.payment_for_month.isoformat()}
                for p in payments
            ],
        }

    def get_progress(self, student_id: UUID) -> list:
        records = self.prog_repo.get_by_student(student_id)
        return [
            {
                "id": str(r.id),
                "date": r.assessment_date.isoformat(),
                "riding_level": r.riding_level,
                "coach_remarks": r.coach_remarks,
                "performance_rating": r.performance_rating,
                "skills_learned": r.skills_learned,
            }
            for r in records
        ]

    def get_all(self):
        return self.repo.get_all()

    def get_by_id(self, student_id: UUID):
        student = self.repo.get_by_id(student_id)
        if not student:
            raise ValueError("Student not found")
        return student

    def update_status(self, student_id: UUID, data: StudentStatusUpdate):
        student = self.get_by_id(student_id)
        return self.repo.update(student, {"membership_status": data.membership_status})


# ─── Coach Service ─────────────────────────────────────────────────────────

class CoachService:
    def __init__(self, db: Session):
        self.repo = CoachRepository(db)
        self.batch_repo = BatchRepository(db)
        self.student_repo = StudentRepository(db)
        self.att_repo = AttendanceRepository(db)
        self.prog_repo = ProgressRepository(db)

    def get_dashboard(self, coach_id: UUID) -> dict:
        coach = self.repo.get_by_id(coach_id)
        if not coach:
            raise ValueError("Coach not found")
        batches = self.batch_repo.get_by_coach(coach_id)
        student_count = sum(len(self.student_repo.get_by_batch(b.id)) for b in batches)
        return {
            "coach_name": coach.full_name,
            "assigned_students": student_count,
            "today_classes": len(batches),
            "batches": [{"id": str(b.id), "name": b.batch_name, "day": b.training_day} for b in batches],
        }

    def get_students(self, coach_id: UUID) -> list:
        batches = self.batch_repo.get_by_coach(coach_id)
        result = []
        for batch in batches:
            students = self.student_repo.get_by_batch(batch.id)
            for s in students:
                reg = s.registration
                att = self.att_repo.count_by_student(s.id)
                result.append({
                    "student_id": str(s.id),
                    "name": reg.full_name if reg else "",
                    "mobile_number": reg.mobile_number if reg else "",
                    "batch": batch.batch_name,
                    "batch_id": str(batch.id),
                    "student_number": s.student_number,
                    "total_classes": att["total"],
                    "present": att["present"],
                    "absent": att["absent"],
                })
        return result

    def mark_attendance(self, coach_id: UUID, data: AttendanceBulkCreate) -> dict:
        if data.attendance_date > date.today():
            raise ValueError("Cannot mark attendance for a future date")
        saved = 0
        for record in data.records:
            existing = self.att_repo.get_by_student_date(record.student_id, data.attendance_date)
            if existing:
                self.att_repo.update(existing, {"attendance_status": record.status, "remarks": record.remarks, "updated_by": str(coach_id)})
            else:
                self.att_repo.create({
                    "student_id": record.student_id,
                    "coach_id": coach_id,
                    "attendance_date": data.attendance_date,
                    "attendance_status": record.status,
                    "remarks": record.remarks,
                    "created_by": str(coach_id),
                })
            saved += 1
        present = sum(1 for r in data.records if r.status == "Present")
        return {"date": data.attendance_date.isoformat(), "total_students": saved, "present": present, "absent": saved - present}

    def add_progress(self, coach_id: UUID, data: ProgressCreate) -> Any:
        return self.prog_repo.create({
            "student_id": data.student_id,
            "coach_id": coach_id,
            "assessment_date": data.assessment_date,
            "riding_level": data.riding_level,
            "skills_learned": data.skills_learned,
            "strengths": data.strengths,
            "areas_for_improvement": data.areas_for_improvement,
            "next_goals": data.next_goals,
            "coach_remarks": data.coach_remarks,
            "performance_rating": data.performance_rating,
            "created_by": str(coach_id),
        })

    def get_student_progress(self, student_id: UUID) -> list:
        return self.prog_repo.get_by_student(student_id)

    def create(self, data: CoachCreate) -> Any:
        existing = self.repo.get_by_mobile(data.mobile_number)
        if existing:
            raise ValueError("Mobile number already registered as coach")
        return self.repo.create(data.model_dump())

    def get_all(self):
        return self.repo.get_all()

    def update(self, coach_id: UUID, data: CoachUpdate) -> Any:
        coach = self.repo.get_by_id(coach_id)
        if not coach:
            raise ValueError("Coach not found")
        return self.repo.update(coach, data.model_dump(exclude_none=True))


# ─── Admin Service ─────────────────────────────────────────────────────────

class AdminService:
    def __init__(self, db: Session):
        self.student_repo = StudentRepository(db)
        self.reg_repo = RegistrationRepository(db)
        self.booking_repo = TrialBookingRepository(db)
        self.horse_repo = HorseRepository(db)
        self.coach_repo = CoachRepository(db)
        self.att_repo = AttendanceRepository(db)

    def get_dashboard(self) -> dict:
        return {
            "total_students": self.student_repo.count_total(),
            "active_students": self.student_repo.count_active(),
            "pending_registrations": self.reg_repo.count_pending(),
            "total_bookings": self.booking_repo.count_total(),
            "today_bookings": self.booking_repo.count_today(),
            "total_horses": self.horse_repo.count_total(),
            "active_coaches": self.coach_repo.count_active(),
        }


# ─── Content Services ──────────────────────────────────────────────────────

class HorseService:
    def __init__(self, db: Session):
        self.repo = HorseRepository(db)

    def get_all(self, active_only: bool = True):
        return self.repo.get_all(active_only)

    def get_by_id(self, horse_id: UUID):
        horse = self.repo.get_by_id(horse_id)
        if not horse:
            raise ValueError("Horse not found")
        return horse

    def create(self, data: HorseCreate) -> Any:
        return self.repo.create(data.model_dump())

    def update(self, horse_id: UUID, data: HorseUpdate) -> Any:
        horse = self.get_by_id(horse_id)
        return self.repo.update(horse, data.model_dump(exclude_unset=True))


class FacilityService:
    def __init__(self, db: Session):
        self.repo = FacilityRepository(db)

    def get_all(self, active_only: bool = True):
        return self.repo.get_all(active_only)

    def get_by_id(self, facility_id: UUID):
        f = self.repo.get_by_id(facility_id)
        if not f:
            raise ValueError("Facility not found")
        return f

    def create(self, data: FacilityCreate) -> Any:
        return self.repo.create(data.model_dump())

    def update(self, facility_id: UUID, data: FacilityUpdate) -> Any:
        f = self.get_by_id(facility_id)
        return self.repo.update(f, data.model_dump(exclude_none=True))


class TeamMemberService:
    def __init__(self, db: Session):
        self.repo = TeamMemberRepository(db)

    def get_all(self, active_only: bool = True):
        return self.repo.get_all(active_only)

    def get_by_id(self, member_id: UUID):
        m = self.repo.get_by_id(member_id)
        if not m:
            raise ValueError("Team member not found")
        return m

    def create(self, data: TeamMemberCreate) -> Any:
        return self.repo.create(data.model_dump())

    def update(self, member_id: UUID, data: TeamMemberUpdate) -> Any:
        m = self.get_by_id(member_id)
        return self.repo.update(m, data.model_dump(exclude_none=True))


class TestimonialService:
    def __init__(self, db: Session):
        self.repo = TestimonialRepository(db)

    def get_public(self):
        return self.repo.get_all(active_only=True, approved_only=True)

    def get_all(self):
        return self.repo.get_all(active_only=False)

    def get_by_id(self, test_id: UUID):
        t = self.repo.get_by_id(test_id)
        if not t:
            raise ValueError("Testimonial not found")
        return t

    def create(self, data: TestimonialCreate) -> Any:
        return self.repo.create(data.model_dump())

    def update(self, test_id: UUID, data: TestimonialUpdate) -> Any:
        t = self.get_by_id(test_id)
        return self.repo.update(t, data.model_dump(exclude_none=True))

    def approve(self, test_id: UUID) -> Any:
        t = self.get_by_id(test_id)
        return self.repo.update(t, {"is_approved": True})

    def reject(self, test_id: UUID) -> Any:
        t = self.get_by_id(test_id)
        return self.repo.update(t, {"is_approved": False, "is_active": False})


class LocationService:
    def __init__(self, db: Session):
        self.repo = LocationRepository(db)

    def get_all(self, active_only: bool = True):
        return self.repo.get_all(active_only)

    def get_by_id(self, loc_id: UUID):
        loc = self.repo.get_by_id(loc_id)
        if not loc:
            raise ValueError("Location not found")
        return loc

    def create(self, data: LocationCreate) -> Any:
        return self.repo.create(data.model_dump())

    def update(self, loc_id: UUID, data: LocationUpdate) -> Any:
        loc = self.get_by_id(loc_id)
        return self.repo.update(loc, data.model_dump(exclude_unset=True))


class FeePaymentService:
    def __init__(self, db: Session):
        self.repo = FeePaymentRepository(db)
        self.student_repo = StudentRepository(db)

    def create(self, data: FeePaymentCreate) -> Any:
        student = self.student_repo.get_by_id(data.student_id)
        if not student:
            raise ValueError("Student not found")
        return self.repo.create(data.model_dump())

    def get_by_student(self, student_id: UUID):
        return self.repo.get_by_student(student_id)


class BatchService:
    def __init__(self, db: Session):
        self.repo = BatchRepository(db)

    def get_all(self):
        return self.repo.get_all()

    def get_by_id(self, batch_id: UUID):
        b = self.repo.get_by_id(batch_id)
        if not b:
            raise ValueError("Batch not found")
        return b

    def create(self, data: BatchCreate) -> Any:
        return self.repo.create(data.model_dump())
