# Active Context — Horse Riding Club Management System

## Current Project State
Phases 1–4 implementation complete. Full-stack application built and ready to run.

All planning documents are finalized under `docs/`:
- Project Blueprint (vision, architecture, tech stack, folder structure, FRS, domain model, roadmap)
- Database Design (15 SQL table definitions)
- API Specifications (11 API spec documents)
- Backend Development Standards (15 documents covering architecture through deployment)
- Frontend Development (5 documents covering architecture through screen specs)
- AI Code Generation guide

## Implementation Roadmap (Planned Sequence)
1. **Phase 1** — Project Foundation (repo setup, Docker, env config)
2. **Phase 2** — Database (PostgreSQL schema from 15 SQL files)
3. **Phase 3** — Backend Foundation (FastAPI app, SQLAlchemy models, middleware, logging)
4. **Phase 4** — Public Website APIs + Frontend screens
5. **Phase 5** — Trial Booking (backend + frontend)
6. **Phase 6** — Student Registration (backend + frontend)
7. **Phase 7** — Dashboards (Student, Coach, Admin)
8. **Phase 8** — Attendance & Progress
9. **Phase 9** — Content Management (Facilities, Horses, Team, Testimonials, Locations)
10. **Phase 10** — System Configuration
11. **Phase 11** — Testing
12. **Phase 12** — Deployment

## Per-Module Implementation Order
For each module: Database → SQLAlchemy Models → Pydantic Schemas → Repository → Service → API Router → Frontend Screens → Integration Tests

## Database Tables Defined (docs/01_Database_Design/)
1. configuration
2. administrators
3. coaches
4. batches
5. facilities
6. horses
7. team_members
8. testimonials
9. club_locations
10. registrations
11. students
12. trial_bookings
13. fee_payments
14. attendance
15. student_progress

## Key Decisions Already Made
- Frontend: React + Vite (web), TypeScript, CSS Modules — NOT React Native for v1.0 web
- No authentication system in v1.0 — mobile number lookup only
- Soft deletes everywhere — no physical deletion of business records
- All config in DB, never hardcoded
- Progress records are append-only (never overwrite historical evaluations)
