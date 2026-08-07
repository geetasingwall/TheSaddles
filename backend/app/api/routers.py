from __future__ import annotations
from typing import Optional
from uuid import UUID
import os, shutil
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.core.responses import success_response, error_response
from app.schemas.schemas import (
    LoginRequest, TrialBookingCreate, RegistrationCreate,
    RegistrationApprove, RegistrationReject, AttendanceBulkCreate,
    ProgressCreate, FeePaymentCreate, CoachCreate, CoachUpdate,
    HorseCreate, HorseUpdate, FacilityCreate, FacilityUpdate,
    TeamMemberCreate, TeamMemberUpdate, TestimonialCreate, TestimonialUpdate,
    LocationCreate, LocationUpdate, ConfigurationUpdate, BatchCreate, BatchUpdate,
    StudentStatusUpdate, AttendanceUpdate,
)
from app.services.services import (
    AuthService, ConfigurationService, TrialBookingService,
    RegistrationService, StudentService, CoachService, AdminService,
    HorseService, FacilityService, TeamMemberService, TestimonialService,
    LocationService, FeePaymentService, BatchService,
)

# ─── Auth ──────────────────────────────────────────────────────────────────

auth_router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


@auth_router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    try:
        result = AuthService(db).login(payload.mobile_number)
        return success_response(data=result, message="Login processed")
    except Exception as e:
        return error_response(str(e))


@auth_router.post("/logout")
def logout():
    return success_response(message="Logged out successfully")


@auth_router.get("/me")
def me():
    return success_response(data={}, message="Session info")


# ─── Public ────────────────────────────────────────────────────────────────

public_router = APIRouter(prefix="/api/v1/public", tags=["Public"])


@public_router.get("/horses")
def public_horses(db: Session = Depends(get_db)):
    horses = HorseService(db).get_all(active_only=True)
    return success_response(data=[{"id": str(h.id), "stable_name": h.stable_name, "breed": h.breed, "gender": h.gender, "color": h.color, "image_path": h.image_path, "training_level": h.training_level, "suitable_for_beginners": h.suitable_for_beginners, "available_for_lease": h.available_for_lease, "lease_events": h.lease_events} for h in horses])


@public_router.get("/facilities")
def public_facilities(db: Session = Depends(get_db)):
    facilities = FacilityService(db).get_all(active_only=True)
    return success_response(data=[{"id": str(f.id), "facility_name": f.facility_name, "short_description": f.short_description, "detailed_description": f.detailed_description, "image_path": f.image_path, "display_order": f.display_order, "show_on_homepage": f.show_on_homepage, "is_active": f.is_active} for f in facilities])


@public_router.get("/team")
def public_team(db: Session = Depends(get_db)):
    members = TeamMemberService(db).get_all(active_only=True)
    return success_response(data=[{"id": str(m.id), "name": m.full_name, "designation": m.designation, "bio": m.short_bio, "image_path": m.profile_image_path} for m in members])


@public_router.get("/testimonials")
def public_testimonials(db: Session = Depends(get_db)):
    items = TestimonialService(db).get_public()
    return success_response(data=[{"id": str(t.id), "customer_name": t.customer_name, "testimonial": t.testimonial, "rating": t.rating, "customer_type": t.customer_type} for t in items])


@public_router.post("/testimonials")
def submit_testimonial(payload: TestimonialCreate, db: Session = Depends(get_db)):
    try:
        t = TestimonialService(db).create(payload)
        return success_response(data={"id": str(t.id)}, message="Thank you! Your testimonial has been submitted for review.", status_code=201)
    except Exception as e:
        return error_response(str(e))


@public_router.get("/locations")
def public_locations(db: Session = Depends(get_db)):
    locs = LocationService(db).get_all(active_only=True)
    return success_response(data=[{
        "id": str(l.id),
        "branch_name": l.branch_name,
        "address_line_1": l.address_line_1,
        "city": l.city,
        "state": l.state,
        "contact_number": l.contact_number,
        "latitude": float(l.latitude) if l.latitude else None,
        "longitude": float(l.longitude) if l.longitude else None,
        "short_description": l.short_description,
    } for l in locs])


@public_router.get("/configuration")
def public_config(db: Session = Depends(get_db)):
    svc = ConfigurationService(db)
    return success_response(data={
        "club_name": svc.get_value("WEBSITE", "CLUB_NAME"),
        "trial_fee": svc.get_value("TRIAL", "TRIAL_FEE"),
        "trial_booking_enabled": svc.get_value("TRIAL", "TRIAL_BOOKING_ENABLED"),
        "primary_phone": svc.get_value("CONTACT", "PRIMARY_PHONE"),
        "primary_email": svc.get_value("CONTACT", "PRIMARY_EMAIL"),
        "business_hours": svc.get_value("BUSINESS", "BUSINESS_HOURS"),
        "instagram_url": svc.get_value("SOCIAL", "INSTAGRAM_URL"),
        "facebook_url": svc.get_value("SOCIAL", "FACEBOOK_URL"),
        "twitter_url": svc.get_value("SOCIAL", "TWITTER_URL"),
        "youtube_url": svc.get_value("SOCIAL", "YOUTUBE_URL"),
        "whatsapp_number": svc.get_value("SOCIAL", "WHATSAPP_NUMBER"),
    })


# ─── Trial Bookings ────────────────────────────────────────────────────────

booking_router = APIRouter(prefix="/api/v1/trial-bookings", tags=["Trial Bookings"])


@booking_router.get("/dates")
def get_trial_dates(db: Session = Depends(get_db)):
    dates = TrialBookingService(db).get_available_dates()
    return success_response(data=dates)


@booking_router.get("/slots")
def get_trial_slots(date: str = Query(...), db: Session = Depends(get_db)):
    from datetime import date as date_type
    try:
        d = date_type.fromisoformat(date)
    except ValueError:
        return error_response("Invalid date format. Use YYYY-MM-DD")
    slots = TrialBookingService(db).get_slots_for_date(d)
    return success_response(data=slots)


@booking_router.post("")
def create_booking(payload: TrialBookingCreate, db: Session = Depends(get_db)):
    try:
        booking = TrialBookingService(db).create_booking(payload)
        return success_response(data={"booking_id": str(booking.id), "booking_reference": booking.booking_reference, "total_amount": float(booking.total_amount), "status": booking.booking_status}, message="Trial booking confirmed", status_code=201)
    except ValueError as e:
        msg = str(e)
        if "SLOT_FULL" in msg:
            return error_response("Selected slot is no longer available", error_code="SLOT_FULL")
        return error_response(msg)


@booking_router.get("/{booking_id}")
def get_booking(booking_id: UUID, db: Session = Depends(get_db)):
    try:
        b = TrialBookingService(db).get_by_id(booking_id)
        return success_response(data={"id": str(b.id), "reference": b.booking_reference, "date": b.booking_date.isoformat(), "start_time": str(b.start_time), "end_time": str(b.end_time), "participants": b.number_of_participants, "total_amount": float(b.total_amount), "status": b.booking_status})
    except ValueError as e:
        return error_response(str(e), 404)


@booking_router.patch("/{booking_id}/cancel")
def cancel_booking(booking_id: UUID, db: Session = Depends(get_db)):
    try:
        TrialBookingService(db).cancel(booking_id)
        return success_response(message="Booking cancelled")
    except ValueError as e:
        return error_response(str(e))


# ─── Registrations ─────────────────────────────────────────────────────────

reg_router = APIRouter(prefix="/api/v1/registrations", tags=["Registrations"])


@reg_router.post("")
def create_registration(payload: RegistrationCreate, db: Session = Depends(get_db)):
    try:
        reg = RegistrationService(db).create(payload)
        return success_response(data={"registration_id": str(reg.id), "status": reg.registration_status}, message="Registration submitted successfully", status_code=201)
    except ValueError as e:
        return error_response(str(e))


@reg_router.get("/status")
def check_status(mobile_number: str = Query(...), db: Session = Depends(get_db)):
    try:
        result = RegistrationService(db).get_status(mobile_number)
        return success_response(data=result)
    except ValueError as e:
        return error_response(str(e), 404)


# ─── Students ──────────────────────────────────────────────────────────────

student_router = APIRouter(prefix="/api/v1/students", tags=["Students"])


@student_router.get("/dashboard")
def student_dashboard(student_id: UUID = Query(...), db: Session = Depends(get_db)):
    try:
        return success_response(data=StudentService(db).get_dashboard(student_id))
    except ValueError as e:
        return error_response(str(e), 404)


@student_router.get("/profile")
def student_profile(student_id: UUID = Query(...), db: Session = Depends(get_db)):
    try:
        return success_response(data=StudentService(db).get_profile(student_id))
    except ValueError as e:
        return error_response(str(e), 404)


@student_router.get("/attendance")
def student_attendance(student_id: UUID = Query(...), db: Session = Depends(get_db)):
    try:
        return success_response(data=StudentService(db).get_attendance(student_id))
    except ValueError as e:
        return error_response(str(e), 404)


@student_router.get("/fees")
def student_fees(student_id: UUID = Query(...), db: Session = Depends(get_db)):
    try:
        return success_response(data=StudentService(db).get_fees(student_id))
    except ValueError as e:
        return error_response(str(e), 404)


@student_router.get("/progress")
def student_progress(student_id: UUID = Query(...), db: Session = Depends(get_db)):
    try:
        return success_response(data=StudentService(db).get_progress(student_id))
    except ValueError as e:
        return error_response(str(e), 404)


# ─── Coach ─────────────────────────────────────────────────────────────────

coach_router = APIRouter(prefix="/api/v1/coach", tags=["Coach"])


@coach_router.get("/dashboard")
def coach_dashboard(coach_id: UUID = Query(...), db: Session = Depends(get_db)):
    try:
        return success_response(data=CoachService(db).get_dashboard(coach_id))
    except ValueError as e:
        return error_response(str(e), 404)


@coach_router.get("/students")
def coach_students(coach_id: UUID = Query(...), db: Session = Depends(get_db)):
    try:
        return success_response(data=CoachService(db).get_students(coach_id))
    except ValueError as e:
        return error_response(str(e), 404)


@coach_router.post("/attendance")
def mark_attendance(payload: AttendanceBulkCreate, coach_id: UUID = Query(...), db: Session = Depends(get_db)):
    try:
        result = CoachService(db).mark_attendance(coach_id, payload)
        return success_response(data=result, message="Attendance saved successfully")
    except ValueError as e:
        return error_response(str(e))


@coach_router.post("/progress")
def add_progress(payload: ProgressCreate, coach_id: UUID = Query(...), db: Session = Depends(get_db)):
    try:
        prog = CoachService(db).add_progress(coach_id, payload)
        return success_response(data={"id": str(prog.id)}, message="Progress updated successfully", status_code=201)
    except ValueError as e:
        return error_response(str(e))


@coach_router.get("/attendance")
def coach_attendance(coach_id: UUID = Query(...), db: Session = Depends(get_db)):
    from app.repositories.repositories import AttendanceRepository, BatchRepository, StudentRepository, ConfigurationRepository
    from collections import defaultdict
    from datetime import date, timedelta
    months = (ConfigurationRepository(db).get_by_key("ATTENDANCE", "DASHBOARD_MONTHS") or None)
    months_val = months.integer_value if months and months.integer_value else 2
    since = date.today().replace(day=1)
    for _ in range(months_val - 1):
        since = (since - timedelta(days=1)).replace(day=1)
    batch_repo = BatchRepository(db)
    student_repo = StudentRepository(db)
    att_repo = AttendanceRepository(db)
    batches = batch_repo.get_by_coach(coach_id)
    records = []
    for batch in batches:
        records.extend(att_repo.get_by_batch(batch.id, since=since))
    by_date: dict = defaultdict(list)
    for r in records:
        student = student_repo.get_by_id(r.student_id)
        if not student:
            continue
        reg = student.registration
        by_date[r.attendance_date.isoformat()].append({
            "student_id": str(r.student_id),
            "student_number": student.student_number,
            "name": reg.full_name if reg else "",
            "status": r.attendance_status,
            "remarks": r.remarks,
        })
    result = [
        {"date": d, "records": rows}
        for d, rows in sorted(by_date.items(), reverse=True)
    ]
    return success_response(data=result)


@coach_router.get("/trial-bookings")
def coach_trial_bookings(coach_id: UUID = Query(...), db: Session = Depends(get_db)):
    from app.repositories.repositories import CoachRepository
    coach = CoachRepository(db).get_by_id(coach_id)
    if not coach or not coach.assigned_place:
        return success_response(data=[])
    svc = TrialBookingService(db)
    bookings = svc.get_all()
    return success_response(data=[{
        "id": str(b.id),
        "booking_reference": b.booking_reference,
        "full_name": b.full_name,
        "mobile_number": b.mobile_number,
        "booking_date": b.booking_date.isoformat(),
        "start_time": str(b.start_time),
        "end_time": str(b.end_time),
        "place": b.place,
        "number_of_participants": b.number_of_participants,
        "booking_status": b.booking_status,
    } for b in bookings if b.booking_status in ("Booked", "Completed", "No Show") and b.place == coach.assigned_place])


@coach_router.patch("/trial-bookings/{booking_id}/complete")
def complete_trial_booking(booking_id: UUID, db: Session = Depends(get_db)):
    try:
        TrialBookingService(db).complete(booking_id)
        return success_response(message="Trial booking marked as completed")
    except ValueError as e:
        return error_response(str(e))



@coach_router.get("/students/{student_id}/progress")
def student_progress_by_coach(student_id: UUID, db: Session = Depends(get_db)):
    records = CoachService(db).get_student_progress(student_id)
    return success_response(data=[{
        "id": str(r.id),
        "assessment_date": r.assessment_date.isoformat(),
        "riding_level": r.riding_level,
        "performance_rating": r.performance_rating,
        "skills_learned": r.skills_learned,
        "strengths": r.strengths,
        "areas_for_improvement": r.areas_for_improvement,
        "next_goals": r.next_goals,
        "coach_remarks": r.coach_remarks,
    } for r in records])


# ─── Attendance ────────────────────────────────────────────────────────────

attendance_router = APIRouter(prefix="/api/v1/attendance", tags=["Attendance"])


@attendance_router.post("")
def mark_attendance_direct(payload: AttendanceBulkCreate, coach_id: UUID = Query(...), db: Session = Depends(get_db)):
    try:
        result = CoachService(db).mark_attendance(coach_id, payload)
        return success_response(data=result, message="Attendance saved successfully")
    except ValueError as e:
        return error_response(str(e))


# ─── Admin ─────────────────────────────────────────────────────────────────

admin_router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])


@admin_router.get("/dashboard")
def admin_dashboard(db: Session = Depends(get_db)):
    return success_response(data=AdminService(db).get_dashboard())


@admin_router.get("/registrations")
def admin_registrations(status: Optional[str] = Query(None), db: Session = Depends(get_db)):
    regs = RegistrationService(db).get_all(status)
    return success_response(data=[{
        "id": str(r.id),
        "first_name": r.first_name,
        "last_name": r.last_name,
        "mobile_number": r.mobile_number,
        "registration_status": r.registration_status,
        "city": r.city,
        "created_at": r.created_at.isoformat(),
    } for r in regs])


@admin_router.patch("/registrations/{reg_id}/approve")
def approve_registration(reg_id: UUID, payload: RegistrationApprove, admin_id: UUID = Query(...), db: Session = Depends(get_db)):
    try:
        student = RegistrationService(db).approve(reg_id, admin_id, payload)
        return success_response(data={"student_id": str(student.id), "student_number": student.student_number}, message="Registration approved")
    except ValueError as e:
        return error_response(str(e))


@admin_router.patch("/registrations/{reg_id}/reject")
def reject_registration(reg_id: UUID, payload: RegistrationReject, admin_id: UUID = Query(...), db: Session = Depends(get_db)):
    try:
        RegistrationService(db).reject(reg_id, admin_id, payload)
        return success_response(message="Registration rejected")
    except ValueError as e:
        return error_response(str(e))


@admin_router.patch("/students/{student_id}/batch")
def assign_student_batch(student_id: UUID, batch_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    try:
        from app.repositories.repositories import StudentRepository
        repo = StudentRepository(db)
        student = repo.get_by_id(student_id)
        if not student:
            return error_response("Student not found", 404)
        new_batch = UUID(batch_id) if batch_id else None
        repo.update(student, {"batch_id": new_batch})
        return success_response(message="Student batch updated")
    except ValueError as e:
        return error_response(str(e))


@admin_router.get("/students")
def admin_students(db: Session = Depends(get_db)):
    from app.repositories.repositories import BatchRepository, CoachRepository
    students = StudentService(db).get_all()
    batch_repo = BatchRepository(db)
    coach_repo = CoachRepository(db)
    result = []
    for s in students:
        place = None
        if s.batch_id:
            batch = batch_repo.get_by_id(s.batch_id)
            if batch:
                coach = coach_repo.get_by_id(batch.coach_id)
                if coach:
                    place = coach.assigned_place
        result.append({
            "id": str(s.id),
            "student_number": s.student_number,
            "first_name": s.registration.first_name if s.registration else "",
            "last_name": s.registration.last_name if s.registration else None,
            "mobile_number": s.registration.mobile_number if s.registration else "",
            "batch_id": str(s.batch_id) if s.batch_id else None,
            "membership_status": s.membership_status,
            "joining_date": s.joining_date.isoformat(),
            "monthly_fee": float(s.monthly_fee) if s.monthly_fee else None,
            "place": place,
        })
    return success_response(data=result)


@admin_router.get("/students/{student_id}/progress")
def admin_student_progress(student_id: UUID, db: Session = Depends(get_db)):
    records = CoachService(db).get_student_progress(student_id)
    return success_response(data=[{
        "id": str(r.id),
        "assessment_date": r.assessment_date.isoformat(),
        "riding_level": r.riding_level,
        "performance_rating": r.performance_rating,
        "skills_learned": r.skills_learned,
        "strengths": r.strengths,
        "areas_for_improvement": r.areas_for_improvement,
        "next_goals": r.next_goals,
        "coach_remarks": r.coach_remarks,
    } for r in records])


@admin_router.get("/students/{student_id}")
def admin_student_detail(student_id: UUID, db: Session = Depends(get_db)):
    try:
        return success_response(data=StudentService(db).get_profile(student_id))
    except ValueError as e:
        return error_response(str(e), 404)


@admin_router.delete("/students/{student_id}")
def deactivate_student(student_id: UUID, db: Session = Depends(get_db)):
    try:
        from app.repositories.repositories import StudentRepository
        repo = StudentRepository(db)
        student = repo.get_by_id(student_id)
        if not student:
            return error_response("Student not found", 404)
        repo.update(student, {"is_active": False, "membership_status": "Inactive"})
        return success_response(message="Student deactivated")
    except ValueError as e:
        return error_response(str(e))


@admin_router.patch("/students/{student_id}/fee")
def update_student_fee(student_id: UUID, monthly_fee: float = Query(...), db: Session = Depends(get_db)):
    try:
        from app.repositories.repositories import StudentRepository
        from decimal import Decimal
        repo = StudentRepository(db)
        student = repo.get_by_id(student_id)
        if not student:
            return error_response("Student not found", 404)
        repo.update(student, {"monthly_fee": Decimal(str(monthly_fee))})
        return success_response(message="Monthly fee updated")
    except Exception as e:
        return error_response(str(e))


@admin_router.patch("/students/{student_id}/status")
def update_student_status(student_id: UUID, payload: StudentStatusUpdate, db: Session = Depends(get_db)):
    try:
        StudentService(db).update_status(student_id, payload)
        return success_response(message="Student status updated")
    except ValueError as e:
        return error_response(str(e))


@admin_router.get("/coaches")
def admin_coaches(db: Session = Depends(get_db)):
    coaches = CoachService(db).get_all()
    return success_response(data=[{
        "id": str(c.id),
        "first_name": c.first_name,
        "last_name": c.last_name,
        "mobile_number": c.mobile_number,
        "experience_years": c.experience_years,
        "specialization": c.specialization,
        "assigned_place": c.assigned_place,
        "is_active": c.is_active,
    } for c in coaches])


@admin_router.post("/coaches")
def create_coach(payload: CoachCreate, db: Session = Depends(get_db)):
    try:
        coach = CoachService(db).create(payload)
        return success_response(data={"id": str(coach.id)}, message="Coach created", status_code=201)
    except ValueError as e:
        return error_response(str(e))


@admin_router.patch("/coaches/{coach_id}")
def update_coach(coach_id: UUID, payload: CoachUpdate, db: Session = Depends(get_db)):
    try:
        CoachService(db).update(coach_id, payload)
        return success_response(message="Coach updated")
    except ValueError as e:
        return error_response(str(e))


@admin_router.get("/trial-bookings")
def admin_trial_bookings(db: Session = Depends(get_db)):
    from app.repositories.repositories import CoachRepository
    bookings = TrialBookingService(db).get_all()
    coaches = CoachRepository(db).get_all()
    place_to_coach = {c.assigned_place: c.full_name for c in coaches if c.assigned_place and c.is_active}
    return success_response(data=[{
        "id": str(b.id),
        "booking_reference": b.booking_reference,
        "full_name": b.full_name,
        "mobile_number": b.mobile_number,
        "booking_date": b.booking_date.isoformat(),
        "start_time": str(b.start_time),
        "end_time": str(b.end_time),
        "place": b.place,
        "number_of_participants": b.number_of_participants,
        "total_amount": float(b.total_amount),
        "booking_status": b.booking_status,
        "coach_name": place_to_coach.get(b.place),
    } for b in bookings])


@admin_router.get("/horses")
def admin_horses(db: Session = Depends(get_db)):
    horses = HorseService(db).get_all(active_only=False)
    return success_response(data=[{"id": str(h.id), "stable_name": h.stable_name, "breed": h.breed, "color": h.color, "gender": h.gender, "training_level": h.training_level, "suitable_for_beginners": h.suitable_for_beginners, "available_for_lease": h.available_for_lease, "lease_events": h.lease_events, "image_path": h.image_path, "gallery_images": h.gallery_images or [], "is_active": h.is_active} for h in horses])


@admin_router.post("/horses")
def create_horse(payload: HorseCreate, db: Session = Depends(get_db)):
    import logging
    try:
        horse = HorseService(db).create(payload)
        return success_response(data={"id": str(horse.id), "stable_name": horse.stable_name, "is_active": horse.is_active}, message="Horse created", status_code=201)
    except Exception as e:
        logging.getLogger("horse_riding_club").error(f"create_horse error: {e}")
        db.rollback()
        msg = str(e)
        if "unique" in msg.lower() or "duplicate" in msg.lower():
            return error_response("A horse with this stable name already exists")
        return error_response(msg)


@admin_router.patch("/horses/{horse_id}")
def update_horse(horse_id: UUID, payload: HorseUpdate, db: Session = Depends(get_db)):
    try:
        HorseService(db).update(horse_id, payload)
        return success_response(message="Horse updated")
    except ValueError as e:
        return error_response(str(e))


@admin_router.delete("/horses/{horse_id}")
def delete_horse(horse_id: UUID, db: Session = Depends(get_db)):
    try:
        from app.repositories.repositories import HorseRepository
        repo = HorseRepository(db)
        horse = repo.get_by_id(horse_id)
        if not horse:
            return error_response("Horse not found", 404)
        repo.update(horse, {"is_active": False})
        return success_response(message="Horse deleted")
    except Exception as e:
        return error_response(str(e))


@admin_router.post("/horses/{horse_id}/gallery")
def upload_horse_gallery(horse_id: UUID, file: UploadFile = File(...), db: Session = Depends(get_db)):
    from app.core.settings import get_settings
    from app.repositories.repositories import HorseRepository
    settings = get_settings()
    repo = HorseRepository(db)
    horse = repo.get_by_id(horse_id)
    if not horse:
        return error_response("Horse not found", 404)
    gallery = list(horse.gallery_images or [])
    if len(gallery) >= 10:
        return error_response("Maximum 10 gallery photos allowed")
    allowed = {".jpg", ".jpeg", ".png", ".webp"}
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed:
        return error_response("Invalid file type. Use jpg, jpeg, png, or webp.")
    upload_dir = os.path.join(settings.UPLOAD_PATH, "horses", str(horse_id))
    os.makedirs(upload_dir, exist_ok=True)
    filename = f"{len(gallery)}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{ext}"
    filepath = os.path.join(upload_dir, filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)
    rel_path = f"horses/{horse_id}/{filename}"
    gallery.append(rel_path)
    horse.gallery_images = gallery
    horse.updated_at = datetime.utcnow()
    db.commit()
    return success_response(data={"gallery_images": gallery}, message="Photo uploaded")


@admin_router.delete("/horses/{horse_id}/gallery/{index}")
def delete_horse_gallery_photo(horse_id: UUID, index: int, db: Session = Depends(get_db)):
    from app.core.settings import get_settings
    from app.repositories.repositories import HorseRepository
    settings = get_settings()
    repo = HorseRepository(db)
    horse = repo.get_by_id(horse_id)
    if not horse:
        return error_response("Horse not found", 404)
    gallery = list(horse.gallery_images or [])
    if index < 0 or index >= len(gallery):
        return error_response("Invalid photo index", 404)
    rel_path = gallery.pop(index)
    try:
        os.remove(os.path.join(settings.UPLOAD_PATH, rel_path))
    except OSError:
        pass
    horse.gallery_images = gallery
    horse.updated_at = datetime.utcnow()
    db.commit()
    return success_response(data={"gallery_images": gallery}, message="Photo deleted")


@admin_router.post("/horses/{horse_id}/upload")
def upload_horse_image(horse_id: UUID, file: UploadFile = File(...), db: Session = Depends(get_db)):
    from app.core.settings import get_settings
    from app.repositories.repositories import HorseRepository
    settings = get_settings()
    allowed = {".jpg", ".jpeg", ".png", ".webp"}
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed:
        return error_response("Invalid file type. Use jpg, jpeg, png, or webp.")
    folder = os.path.join(settings.UPLOAD_PATH, "horses")
    os.makedirs(folder, exist_ok=True)
    filename = f"{horse_id}{ext}"
    dest = os.path.join(folder, filename)
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)
    rel_path = f"horses/{filename}"
    repo = HorseRepository(db)
    horse = repo.get_by_id(horse_id)
    if not horse:
        return error_response("Horse not found", 404)
    repo.update(horse, {"image_path": rel_path})
    return success_response(data={"image_path": rel_path}, message="Image uploaded")


@admin_router.get("/facilities")
def admin_facilities(db: Session = Depends(get_db)):
    facilities = FacilityService(db).get_all(active_only=False)
    return success_response(data=[{
        "id": str(f.id),
        "facility_name": f.facility_name,
        "short_description": f.short_description,
        "detailed_description": f.detailed_description,
        "image_path": f.image_path,
        "show_on_homepage": f.show_on_homepage,
        "is_active": f.is_active,
    } for f in facilities])


@admin_router.post("/facilities")
def create_facility(payload: FacilityCreate, db: Session = Depends(get_db)):
    try:
        f = FacilityService(db).create(payload)
        return success_response(data={"id": str(f.id)}, message="Facility created", status_code=201)
    except Exception as e:
        return error_response(str(e))


@admin_router.patch("/facilities/{facility_id}")
def update_facility(facility_id: UUID, payload: FacilityUpdate, db: Session = Depends(get_db)):
    try:
        FacilityService(db).update(facility_id, payload)
        return success_response(message="Facility updated")
    except ValueError as e:
        return error_response(str(e))


@admin_router.post("/facilities/{facility_id}/upload")
def upload_facility_image(facility_id: UUID, file: UploadFile = File(...), db: Session = Depends(get_db)):
    from app.core.settings import get_settings
    from app.repositories.repositories import FacilityRepository
    settings = get_settings()
    allowed = {".jpg", ".jpeg", ".png", ".webp"}
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed:
        return error_response("Invalid file type. Use jpg, jpeg, png, or webp.")
    folder = os.path.join(settings.UPLOAD_PATH, "facilities")
    os.makedirs(folder, exist_ok=True)
    filename = f"{facility_id}{ext}"
    dest = os.path.join(folder, filename)
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)
    rel_path = f"facilities/{filename}"
    repo = FacilityRepository(db)
    facility = repo.get_by_id(facility_id)
    if not facility:
        return error_response("Facility not found", 404)
    repo.update(facility, {"image_path": rel_path})
    return success_response(data={"image_path": rel_path}, message="Image uploaded")


@admin_router.get("/team")
def admin_team(db: Session = Depends(get_db)):
    members = TeamMemberService(db).get_all(active_only=False)
    return success_response(data=[{"id": str(m.id), "name": m.full_name, "designation": m.designation, "is_active": m.is_active} for m in members])


@admin_router.post("/team")
def create_team_member(payload: TeamMemberCreate, db: Session = Depends(get_db)):
    try:
        m = TeamMemberService(db).create(payload)
        return success_response(data={"id": str(m.id)}, message="Team member created", status_code=201)
    except Exception as e:
        return error_response(str(e))


@admin_router.patch("/team/{member_id}")
def update_team_member(member_id: UUID, payload: TeamMemberUpdate, db: Session = Depends(get_db)):
    try:
        TeamMemberService(db).update(member_id, payload)
        return success_response(message="Team member updated")
    except ValueError as e:
        return error_response(str(e))


@admin_router.get("/testimonials")
def admin_testimonials(db: Session = Depends(get_db)):
    items = TestimonialService(db).get_all()
    return success_response(data=[{"id": str(t.id), "name": t.customer_name, "rating": t.rating, "is_approved": t.is_approved, "is_active": t.is_active} for t in items])


@admin_router.post("/testimonials")
def create_testimonial(payload: TestimonialCreate, db: Session = Depends(get_db)):
    try:
        t = TestimonialService(db).create(payload)
        return success_response(data={"id": str(t.id)}, message="Testimonial created", status_code=201)
    except Exception as e:
        return error_response(str(e))


@admin_router.patch("/testimonials/{test_id}")
def update_testimonial(test_id: UUID, payload: TestimonialUpdate, db: Session = Depends(get_db)):
    try:
        TestimonialService(db).update(test_id, payload)
        return success_response(message="Testimonial updated")
    except ValueError as e:
        return error_response(str(e))


@admin_router.patch("/testimonials/{test_id}/approve")
def approve_testimonial(test_id: UUID, db: Session = Depends(get_db)):
    try:
        TestimonialService(db).approve(test_id)
        return success_response(message="Testimonial approved")
    except ValueError as e:
        return error_response(str(e))


@admin_router.patch("/testimonials/{test_id}/reject")
def reject_testimonial(test_id: UUID, db: Session = Depends(get_db)):
    try:
        TestimonialService(db).reject(test_id)
        return success_response(message="Testimonial rejected")
    except ValueError as e:
        return error_response(str(e))


@admin_router.get("/locations")
def admin_locations(db: Session = Depends(get_db)):
    locs = LocationService(db).get_all(active_only=False)
    return success_response(data=[{
        "id": str(l.id),
        "branch_name": l.branch_name,
        "address_line_1": l.address_line_1,
        "city": l.city,
        "state": l.state,
        "contact_number": l.contact_number,
        "latitude": float(l.latitude) if l.latitude else None,
        "longitude": float(l.longitude) if l.longitude else None,
        "short_description": getattr(l, 'short_description', None),
        "is_active": l.is_active,
    } for l in locs])


@admin_router.post("/locations")
def create_location(payload: LocationCreate, db: Session = Depends(get_db)):
    try:
        loc = LocationService(db).create(payload)
        return success_response(data={"id": str(loc.id)}, message="Location created", status_code=201)
    except Exception as e:
        return error_response(str(e))


@admin_router.patch("/locations/{loc_id}")
def update_location(loc_id: UUID, payload: LocationUpdate, db: Session = Depends(get_db)):
    try:
        LocationService(db).update(loc_id, payload)
        return success_response(message="Location updated")
    except ValueError as e:
        return error_response(str(e))


@admin_router.get("/configuration")
def admin_config(db: Session = Depends(get_db)):
    configs = ConfigurationService(db).get_all()
    return success_response(data=[{"id": str(c.id), "category": c.category, "key": c.config_key, "string_value": c.string_value, "integer_value": c.integer_value, "boolean_value": c.boolean_value, "json_value": c.json_value, "description": c.description} for c in configs])


@admin_router.patch("/configuration/{category}/{key}")
def update_config(category: str, key: str, payload: ConfigurationUpdate, db: Session = Depends(get_db)):
    try:
        ConfigurationService(db).update(category, key, payload)
        return success_response(message="Configuration updated")
    except ValueError as e:
        return error_response(str(e))


@admin_router.get("/attendance")
def admin_attendance(db: Session = Depends(get_db)):
    from app.repositories.repositories import StudentRepository, AttendanceRepository, BatchRepository, CoachRepository, ConfigurationRepository
    from collections import defaultdict
    from datetime import date, timedelta
    months = (ConfigurationRepository(db).get_by_key("ATTENDANCE", "DASHBOARD_MONTHS") or None)
    months_val = months.integer_value if months and months.integer_value else 2
    since = date.today().replace(day=1)
    for _ in range(months_val - 1):
        since = (since - timedelta(days=1)).replace(day=1)
    records = AttendanceRepository(db).get_all_with_students(since=since)
    student_repo = StudentRepository(db)
    batch_repo = BatchRepository(db)
    coach_repo = CoachRepository(db)
    by_date: dict = defaultdict(list)
    for r in records:
        student = student_repo.get_by_id(r.student_id)
        if not student:
            continue
        reg = student.registration
        coach_name = None
        if student.batch_id:
            batch = batch_repo.get_by_id(student.batch_id)
            if batch:
                coach = coach_repo.get_by_id(batch.coach_id)
                if coach:
                    coach_name = coach.full_name
        by_date[r.attendance_date.isoformat()].append({
            "student_id": str(r.student_id),
            "student_number": student.student_number,
            "name": reg.full_name if reg else "",
            "coach_name": coach_name,
            "status": r.attendance_status,
            "remarks": r.remarks,
        })
    result = [
        {"date": d, "records": rows}
        for d, rows in sorted(by_date.items(), reverse=True)
    ]
    return success_response(data=result)


@admin_router.get("/batches")
def admin_batches(db: Session = Depends(get_db)):
    batches = BatchService(db).get_all()
    return success_response(data=[{
        "id": str(b.id),
        "batch_name": b.batch_name,
        "coach_id": str(b.coach_id),
        "training_day": b.training_day,
        "start_time": str(b.start_time),
        "end_time": str(b.end_time),
        "maximum_strength": b.maximum_strength,
        "is_active": b.is_active,
    } for b in batches])


@admin_router.post("/batches")
def create_batch(payload: BatchCreate, db: Session = Depends(get_db)):
    try:
        b = BatchService(db).create(payload)
        return success_response(data={"id": str(b.id)}, message="Batch created", status_code=201)
    except Exception as e:
        return error_response(str(e))


@admin_router.delete("/coaches/{coach_id}")
def deactivate_coach(coach_id: UUID, db: Session = Depends(get_db)):
    try:
        from app.repositories.repositories import CoachRepository
        repo = CoachRepository(db)
        coach = repo.get_by_id(coach_id)
        if not coach:
            return error_response("Coach not found", 404)
        repo.update(coach, {"is_active": False})
        return success_response(message="Coach deactivated")
    except ValueError as e:
        return error_response(str(e))


@admin_router.patch("/batches/{batch_id}")
def update_batch(batch_id: UUID, payload: BatchUpdate, db: Session = Depends(get_db)):
    try:
        from app.repositories.repositories import BatchRepository
        repo = BatchRepository(db)
        batch = repo.get_by_id(batch_id)
        if not batch:
            return error_response("Batch not found", 404)
        data = {k: v for k, v in payload.model_dump().items() if v is not None}
        for k, v in data.items():
            setattr(batch, k, v)
        db.commit()
        return success_response(message="Batch updated")
    except Exception as e:
        return error_response(str(e))


@admin_router.delete("/batches/{batch_id}")
def delete_batch(batch_id: UUID, db: Session = Depends(get_db)):
    try:
        from app.repositories.repositories import BatchRepository
        repo = BatchRepository(db)
        batch = repo.get_by_id(batch_id)
        if not batch:
            return error_response("Batch not found", 404)
        batch.is_active = False
        db.commit()
        return success_response(message="Batch deactivated")
    except Exception as e:
        return error_response(str(e))


@admin_router.post("/fees")
def record_fee_payment(payload: FeePaymentCreate, db: Session = Depends(get_db)):
    try:
        payment = FeePaymentService(db).create(payload)
        return success_response(data={"id": str(payment.id)}, message="Payment recorded", status_code=201)
    except ValueError as e:
        return error_response(str(e))


@admin_router.get("/fees/{student_id}")
def get_student_fees(student_id: UUID, db: Session = Depends(get_db)):
    payments = FeePaymentService(db).get_by_student(student_id)
    return success_response(data=[{
        "id": str(p.id),
        "date": p.payment_date.isoformat(),
        "month": p.payment_for_month.isoformat(),
        "amount": float(p.amount_paid),
        "mode": p.payment_mode,
    } for p in payments])


# ─── Horses (public) ───────────────────────────────────────────────────────

horse_router = APIRouter(prefix="/api/v1/horses", tags=["Horses"])


@horse_router.get("")
def list_horses(db: Session = Depends(get_db)):
    horses = HorseService(db).get_all()
    return success_response(data=[{"id": str(h.id), "stable_name": h.stable_name, "breed": h.breed, "training_level": h.training_level, "suitable_for_beginners": h.suitable_for_beginners, "available_for_lease": h.available_for_lease, "image_path": h.image_path} for h in horses])


@horse_router.get("/{horse_id}")
def get_horse(horse_id: UUID, db: Session = Depends(get_db)):
    try:
        h = HorseService(db).get_by_id(horse_id)
        return success_response(data={"id": str(h.id), "name": h.stable_name, "registered_name": h.registered_name, "breed": h.breed, "gender": h.gender, "color": h.color, "training_level": h.training_level, "notes": h.notes, "image_path": h.image_path, "gallery_images": h.gallery_images or [], "suitable_for_beginners": h.suitable_for_beginners, "available_for_lease": h.available_for_lease, "lease_events": h.lease_events})
    except ValueError as e:
        return error_response(str(e), 404)


# ─── Facilities (public) ───────────────────────────────────────────────────

facility_router = APIRouter(prefix="/api/v1/facilities", tags=["Facilities"])


@facility_router.get("")
def list_facilities(db: Session = Depends(get_db)):
    facilities = FacilityService(db).get_all()
    return success_response(data=[{"id": str(f.id), "name": f.facility_name, "description": f.short_description, "image_path": f.image_path} for f in facilities])


@facility_router.get("/{facility_id}")
def get_facility(facility_id: UUID, db: Session = Depends(get_db)):
    try:
        f = FacilityService(db).get_by_id(facility_id)
        return success_response(data={"id": str(f.id), "name": f.facility_name, "short_description": f.short_description, "detailed_description": f.detailed_description, "image_path": f.image_path})
    except ValueError as e:
        return error_response(str(e), 404)
