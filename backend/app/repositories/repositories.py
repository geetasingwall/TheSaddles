from __future__ import annotations
from datetime import date, datetime
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.models.models import (
    Configuration, Administrator, Coach, Batch,
    Facility, Horse, TeamMember, Testimonial, ClubLocation,
    TrialBooking, Registration, Student, FeePayment,
    Attendance, StudentProgress, StudentVideoLink, StudentPhoto,
)


# ─── Configuration ─────────────────────────────────────────────────────────

class ConfigurationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Configuration]:
        return self.db.query(Configuration).filter(Configuration.is_active == True).order_by(Configuration.category, Configuration.display_order).all()

    def get_by_category(self, category: str) -> list[Configuration]:
        return self.db.query(Configuration).filter(Configuration.category == category, Configuration.is_active == True).all()

    def get_by_key(self, category: str, key: str) -> Optional[Configuration]:
        return self.db.query(Configuration).filter(Configuration.category == category, Configuration.config_key == key).first()

    def update(self, config: Configuration, data: dict) -> Configuration:
        for k, v in data.items():
            if v is not None:
                setattr(config, k, v)
        config.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(config)
        return config


# ─── Administrator ─────────────────────────────────────────────────────────

class AdministratorRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_mobile(self, mobile: str) -> Optional[Administrator]:
        return self.db.query(Administrator).filter(Administrator.mobile_number == mobile, Administrator.is_active == True).first()

    def get_all(self) -> list[Administrator]:
        return self.db.query(Administrator).filter(Administrator.is_active == True).all()

    def get_by_id(self, admin_id: UUID) -> Optional[Administrator]:
        return self.db.query(Administrator).filter(Administrator.id == admin_id).first()


# ─── Coach ─────────────────────────────────────────────────────────────────

class CoachRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_mobile(self, mobile: str) -> Optional[Coach]:
        return self.db.query(Coach).filter(Coach.mobile_number == mobile, Coach.is_active == True).first()

    def get_all(self, active_only: bool = True) -> list[Coach]:
        q = self.db.query(Coach)
        if active_only:
            q = q.filter(Coach.is_active == True)
        return q.all()

    def get_by_id(self, coach_id: UUID) -> Optional[Coach]:
        return self.db.query(Coach).filter(Coach.id == coach_id).first()

    def create(self, data: dict) -> Coach:
        coach = Coach(**data)
        self.db.add(coach)
        self.db.commit()
        self.db.refresh(coach)
        return coach

    def update(self, coach: Coach, data: dict) -> Coach:
        for k, v in data.items():
            if v is not None:
                setattr(coach, k, v)
        coach.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(coach)
        return coach

    def count_active(self) -> int:
        return self.db.query(func.count(Coach.id)).filter(Coach.is_active == True).scalar() or 0


# ─── Batch ─────────────────────────────────────────────────────────────────

class BatchRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, active_only: bool = True) -> list[Batch]:
        q = self.db.query(Batch)
        if active_only:
            q = q.filter(Batch.is_active == True)
        return q.all()

    def get_by_id(self, batch_id: UUID) -> Optional[Batch]:
        return self.db.query(Batch).filter(Batch.id == batch_id).first()

    def get_by_coach(self, coach_id: UUID) -> list[Batch]:
        return self.db.query(Batch).filter(Batch.coach_id == coach_id, Batch.is_active == True).all()

    def create(self, data: dict) -> Batch:
        batch = Batch(**data)
        self.db.add(batch)
        self.db.commit()
        self.db.refresh(batch)
        return batch


# ─── Trial Booking ─────────────────────────────────────────────────────────

class TrialBookingRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, skip: int = 0, limit: int = 100) -> list[TrialBooking]:
        return self.db.query(TrialBooking).order_by(TrialBooking.booking_date.desc()).offset(skip).limit(limit).all()

    def get_by_id(self, booking_id: UUID) -> Optional[TrialBooking]:
        return self.db.query(TrialBooking).filter(TrialBooking.id == booking_id).first()

    def get_by_reference(self, ref: str) -> Optional[TrialBooking]:
        return self.db.query(TrialBooking).filter(TrialBooking.booking_reference == ref).first()

    def count_booked_for_slot(self, booking_date: date, start_time, end_time) -> int:
        result = self.db.query(func.sum(TrialBooking.number_of_participants)).filter(
            TrialBooking.booking_date == booking_date,
            TrialBooking.start_time == start_time,
            TrialBooking.end_time == end_time,
            TrialBooking.booking_status.in_(["Booked", "Completed"]),
        ).scalar()
        return result or 0

    def count_today(self) -> int:
        return self.db.query(func.count(TrialBooking.id)).filter(TrialBooking.booking_date == date.today()).scalar() or 0

    def count_total(self) -> int:
        return self.db.query(func.count(TrialBooking.id)).filter(TrialBooking.booking_status != "Cancelled").scalar() or 0

    def get_past_booked(self, before_datetime: datetime) -> list:
        from sqlalchemy import cast, Date as SADate, Time as SATime
        return self.db.query(TrialBooking).filter(
            TrialBooking.booking_status == "Booked",
            TrialBooking.booking_date < before_datetime.date(),
        ).all()

    def create(self, data: dict) -> TrialBooking:
        booking = TrialBooking(**data)
        self.db.add(booking)
        self.db.commit()
        self.db.refresh(booking)
        return booking

    def update_status(self, booking: TrialBooking, status: str) -> TrialBooking:
        booking.booking_status = status
        booking.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(booking)
        return booking


# ─── Registration ──────────────────────────────────────────────────────────

class RegistrationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, status: Optional[str] = None) -> list[Registration]:
        q = self.db.query(Registration)
        if status:
            q = q.filter(Registration.registration_status == status)
        return q.order_by(Registration.created_at.desc()).all()

    def get_by_id(self, reg_id: UUID) -> Optional[Registration]:
        return self.db.query(Registration).filter(Registration.id == reg_id).first()

    def get_by_mobile(self, mobile: str) -> Optional[Registration]:
        return self.db.query(Registration).filter(Registration.mobile_number == mobile).first()

    def count_pending(self) -> int:
        return self.db.query(func.count(Registration.id)).filter(Registration.registration_status == "Pending").scalar() or 0

    def create(self, data: dict) -> Registration:
        reg = Registration(**data)
        self.db.add(reg)
        self.db.commit()
        self.db.refresh(reg)
        return reg

    def update(self, reg: Registration, data: dict) -> Registration:
        for k, v in data.items():
            setattr(reg, k, v)
        reg.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(reg)
        return reg


# ─── Student ───────────────────────────────────────────────────────────────

class StudentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, active_only: bool = True) -> list[Student]:
        q = self.db.query(Student)
        if active_only:
            q = q.filter(Student.is_active == True)
        return q.all()

    def get_by_id(self, student_id: UUID) -> Optional[Student]:
        return self.db.query(Student).filter(Student.id == student_id).first()

    def get_by_registration(self, reg_id: UUID) -> Optional[Student]:
        return self.db.query(Student).filter(Student.registration_id == reg_id).first()

    def get_by_mobile(self, mobile: str) -> Optional[Student]:
        return (
            self.db.query(Student)
            .join(Registration, Student.registration_id == Registration.id)
            .filter(Registration.mobile_number == mobile, Student.is_active == True)
            .first()
        )

    def get_by_batch(self, batch_id: UUID) -> list[Student]:
        return self.db.query(Student).filter(Student.batch_id == batch_id, Student.is_active == True).all()

    def count_total(self) -> int:
        return self.db.query(func.count(Student.id)).scalar() or 0

    def count_active(self) -> int:
        return self.db.query(func.count(Student.id)).filter(Student.is_active == True, Student.membership_status == "Active").scalar() or 0

    def next_student_number(self) -> str:
        count = self.db.query(func.count(Student.id)).scalar() or 0
        return f"STU{str(count + 1).zfill(5)}"

    def create(self, data: dict) -> Student:
        student = Student(**data)
        self.db.add(student)
        self.db.commit()
        self.db.refresh(student)
        return student

    def update(self, student: Student, data: dict) -> Student:
        for k, v in data.items():
            setattr(student, k, v)
        student.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(student)
        return student


# ─── Attendance ────────────────────────────────────────────────────────────

class AttendanceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_student(self, student_id: UUID) -> list[Attendance]:
        return self.db.query(Attendance).filter(Attendance.student_id == student_id).order_by(Attendance.attendance_date.desc()).all()

    def get_by_id(self, att_id: UUID) -> Optional[Attendance]:
        return self.db.query(Attendance).filter(Attendance.id == att_id).first()

    def get_by_student_date(self, student_id: UUID, att_date: date) -> Optional[Attendance]:
        return self.db.query(Attendance).filter(Attendance.student_id == student_id, Attendance.attendance_date == att_date).first()

    def get_by_coach_date(self, coach_id: UUID, att_date: date) -> list[Attendance]:
        return self.db.query(Attendance).filter(Attendance.coach_id == coach_id, Attendance.attendance_date == att_date).all()

    def get_by_batch(self, batch_id: UUID, since: Optional[date] = None) -> list[Attendance]:
        from app.models.models import Student
        q = (
            self.db.query(Attendance)
            .join(Student, Attendance.student_id == Student.id)
            .filter(Student.batch_id == batch_id)
        )
        if since:
            q = q.filter(Attendance.attendance_date >= since)
        return q.order_by(Attendance.attendance_date.desc()).all()

    def get_all_with_students(self, since: Optional[date] = None) -> list[Attendance]:
        q = self.db.query(Attendance)
        if since:
            q = q.filter(Attendance.attendance_date >= since)
        return q.order_by(Attendance.attendance_date.desc()).all()

    def create(self, data: dict) -> Attendance:
        att = Attendance(**data)
        self.db.add(att)
        self.db.commit()
        self.db.refresh(att)
        return att

    def update(self, att: Attendance, data: dict) -> Attendance:
        for k, v in data.items():
            setattr(att, k, v)
        att.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(att)
        return att

    def count_by_student(self, student_id: UUID) -> dict:
        total = self.db.query(func.count(Attendance.id)).filter(Attendance.student_id == student_id).scalar() or 0
        present = self.db.query(func.count(Attendance.id)).filter(Attendance.student_id == student_id, Attendance.attendance_status == "Present").scalar() or 0
        return {"total": total, "present": present, "absent": total - present}


# ─── Progress ──────────────────────────────────────────────────────────────

class ProgressRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_student(self, student_id: UUID) -> list[StudentProgress]:
        return self.db.query(StudentProgress).filter(StudentProgress.student_id == student_id).order_by(StudentProgress.assessment_date.desc()).all()

    def get_by_id(self, prog_id: UUID) -> Optional[StudentProgress]:
        return self.db.query(StudentProgress).filter(StudentProgress.id == prog_id).first()

    def create(self, data: dict) -> StudentProgress:
        prog = StudentProgress(**data)
        self.db.add(prog)
        self.db.commit()
        self.db.refresh(prog)
        return prog


# ─── Fee Payment ───────────────────────────────────────────────────────────

class FeePaymentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_student(self, student_id: UUID) -> list[FeePayment]:
        return self.db.query(FeePayment).filter(FeePayment.student_id == student_id).order_by(FeePayment.payment_date.desc()).all()

    def create(self, data: dict) -> FeePayment:
        payment = FeePayment(**data)
        self.db.add(payment)
        self.db.commit()
        self.db.refresh(payment)
        return payment

    def total_paid(self, student_id: UUID) -> float:
        result = self.db.query(func.sum(FeePayment.amount_paid)).filter(FeePayment.student_id == student_id).scalar()
        return float(result or 0)


# ─── Horse ─────────────────────────────────────────────────────────────────

class HorseRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, active_only: bool = True) -> list[Horse]:
        q = self.db.query(Horse)
        if active_only:
            q = q.filter(Horse.is_active == True)
        return q.order_by(Horse.created_at.desc()).all()

    def get_by_id(self, horse_id: UUID) -> Optional[Horse]:
        return self.db.query(Horse).filter(Horse.id == horse_id).first()

    def count_total(self) -> int:
        return self.db.query(func.count(Horse.id)).filter(Horse.is_active == True).scalar() or 0

    def create(self, data: dict) -> Horse:
        horse = Horse(**data)
        self.db.add(horse)
        self.db.commit()
        self.db.refresh(horse)
        return horse

    def update(self, horse: Horse, data: dict) -> Horse:
        for k, v in data.items():
            setattr(horse, k, v)
        horse.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(horse)
        return horse


# ─── Facility ──────────────────────────────────────────────────────────────

class FacilityRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, active_only: bool = True) -> list[Facility]:
        q = self.db.query(Facility)
        if active_only:
            q = q.filter(Facility.is_active == True)
        return q.order_by(Facility.display_order).all()

    def get_by_id(self, facility_id: UUID) -> Optional[Facility]:
        return self.db.query(Facility).filter(Facility.id == facility_id).first()

    def create(self, data: dict) -> Facility:
        facility = Facility(**data)
        self.db.add(facility)
        self.db.commit()
        self.db.refresh(facility)
        return facility

    def update(self, facility: Facility, data: dict) -> Facility:
        for k, v in data.items():
            if v is not None:
                setattr(facility, k, v)
        facility.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(facility)
        return facility


# ─── Team Member ───────────────────────────────────────────────────────────

class TeamMemberRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, active_only: bool = True) -> list[TeamMember]:
        q = self.db.query(TeamMember)
        if active_only:
            q = q.filter(TeamMember.is_active == True)
        return q.order_by(TeamMember.display_order).all()

    def get_by_id(self, member_id: UUID) -> Optional[TeamMember]:
        return self.db.query(TeamMember).filter(TeamMember.id == member_id).first()

    def create(self, data: dict) -> TeamMember:
        member = TeamMember(**data)
        self.db.add(member)
        self.db.commit()
        self.db.refresh(member)
        return member

    def update(self, member: TeamMember, data: dict) -> TeamMember:
        for k, v in data.items():
            if v is not None:
                setattr(member, k, v)
        member.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(member)
        return member


# ─── Testimonial ───────────────────────────────────────────────────────────

class TestimonialRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, active_only: bool = True, approved_only: bool = False) -> list[Testimonial]:
        q = self.db.query(Testimonial)
        if active_only:
            q = q.filter(Testimonial.is_active == True)
        if approved_only:
            q = q.filter(Testimonial.is_approved == True)
        return q.order_by(Testimonial.display_order).all()

    def get_by_id(self, test_id: UUID) -> Optional[Testimonial]:
        return self.db.query(Testimonial).filter(Testimonial.id == test_id).first()

    def create(self, data: dict) -> Testimonial:
        t = Testimonial(**data)
        self.db.add(t)
        self.db.commit()
        self.db.refresh(t)
        return t

    def update(self, t: Testimonial, data: dict) -> Testimonial:
        for k, v in data.items():
            if v is not None:
                setattr(t, k, v)
        t.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(t)
        return t


# ─── Student Video Link ───────────────────────────────────────────────────

class VideoLinkRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_student(self, student_id: UUID) -> list[StudentVideoLink]:
        return self.db.query(StudentVideoLink).filter(
            StudentVideoLink.student_id == student_id,
            StudentVideoLink.is_active == True
        ).order_by(StudentVideoLink.display_order).all()

    def get_by_id(self, link_id: UUID) -> Optional[StudentVideoLink]:
        return self.db.query(StudentVideoLink).filter(StudentVideoLink.id == link_id).first()

    def create(self, data: dict) -> StudentVideoLink:
        link = StudentVideoLink(**data)
        self.db.add(link)
        self.db.commit()
        self.db.refresh(link)
        return link

    def delete(self, link: StudentVideoLink) -> None:
        link.is_active = False
        link.updated_at = datetime.utcnow()
        self.db.commit()


class StudentPhotoRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_active(self) -> list[StudentPhoto]:
        return self.db.query(StudentPhoto).filter(StudentPhoto.is_active == True).order_by(StudentPhoto.created_at.desc()).all()

    def get_by_student(self, student_id: UUID) -> list[StudentPhoto]:
        return self.db.query(StudentPhoto).filter(
            StudentPhoto.student_id == student_id, StudentPhoto.is_active == True
        ).order_by(StudentPhoto.created_at.desc()).all()

    def get_by_id(self, photo_id: UUID) -> Optional[StudentPhoto]:
        return self.db.query(StudentPhoto).filter(StudentPhoto.id == photo_id).first()

    def create(self, data: dict) -> StudentPhoto:
        photo = StudentPhoto(**data)
        self.db.add(photo)
        self.db.commit()
        self.db.refresh(photo)
        return photo

    def delete(self, photo: StudentPhoto) -> None:
        photo.is_active = False
        photo.updated_at = datetime.utcnow()
        self.db.commit()


# ─── Location ──────────────────────────────────────────────────────────────

class LocationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, active_only: bool = True) -> list[ClubLocation]:
        q = self.db.query(ClubLocation)
        if active_only:
            q = q.filter(ClubLocation.is_active == True)
        return q.order_by(ClubLocation.display_order).all()

    def get_by_id(self, loc_id: UUID) -> Optional[ClubLocation]:
        return self.db.query(ClubLocation).filter(ClubLocation.id == loc_id).first()

    def create(self, data: dict) -> ClubLocation:
        loc = ClubLocation(**data)
        self.db.add(loc)
        self.db.commit()
        self.db.refresh(loc)
        return loc

    def update(self, loc: ClubLocation, data: dict) -> ClubLocation:
        for k, v in data.items():
            setattr(loc, k, v)
        loc.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(loc)
        return loc
