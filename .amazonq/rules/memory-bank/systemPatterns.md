# System Patterns — Horse Riding Club Management System

## Architecture Overview

```
React (Web) / React Native (Mobile)
        ↓  HTTPS / REST
    FastAPI Routers
        ↓
    Service Layer  ← all business logic lives here
        ↓
  Repository Layer ← all DB queries live here
        ↓
  SQLAlchemy Models
        ↓
    PostgreSQL
```

**Iron rule:** Business logic never in routers. DB queries never in services. No exceptions.

## Backend Layer Responsibilities

| Layer | Does | Never Does |
|-------|------|-----------|
| Router (api/) | Receive request, validate with Pydantic, call service, return response | Business logic |
| Service (services/) | Business rules, decisions, workflows | DB queries |
| Repository (repositories/) | CRUD, SQL queries, transactions | Business rules |
| Model (models/) | SQLAlchemy table mapping, relationships | Any logic |

## Backend Folder Structure
```
backend/app/
  api/           # FastAPI routers, one file per module
  services/      # Business logic
  repositories/  # DB access
  models/        # SQLAlchemy models
  schemas/       # Pydantic request/response models
  database/      # Connection, session, base model
  core/          # Settings, constants, error handlers, DI
  middleware/    # Logging, exception, request timing
  utils/         # Date formatting, phone utils, file helpers
  configuration/ # Trial timings, upload paths, env settings
  uploads/       # horses/, team/, testimonials/, facilities/
```

## Frontend Stack & Structure
- Framework: React (web) with TypeScript, built with Vite
- Routing: React Router
- HTTP: Axios (only through `src/api/` — never call Axios directly in components)
- Forms: React Hook Form + Zod validation
- Icons: Lucide React
- Styling: CSS Modules

```
frontend/src/
  api/           # All Axios calls, one file per domain
  components/    # Reusable UI: Buttons, Cards, Forms, Inputs, Dialogs, Tables, Navigation
  screens/       # Feature screens: Landing, TrialBooking, Registration, StudentDashboard, CoachDashboard, AdminDashboard, Attendance, Horses, Facilities, Testimonials, Contact
  services/      # Frontend business logic / API wrappers
  store/         # Global state (logged-in user, auth status, theme, notifications)
  hooks/         # Custom React hooks
  layouts/       # Page layout wrappers
  types/         # TypeScript interfaces
  utils/         # Helpers
```

## Database Design Patterns
- Every table has a system-generated unique ID (never changes)
- Soft delete preferred: records have `active`/`inactive`/`archived` status, not physical deletion
- Audit fields on all tables (created_at, updated_at, created_by)
- All business config in the `configuration` table — never hardcoded
- Migrations managed by Alembic

## API Standards
- Base path: `/api/v1/`
- JSON request/response
- Stateless
- Standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Standard response envelope:
  ```json
  { "success": true/false, "message": "...", "data": {...} }
  ```

## File Upload Pattern
- Files stored on server under `uploads/horses/`, `uploads/team/`, etc.
- Database stores only the relative file path
- Storage layer abstracted for future cloud migration

## Configuration Pattern
- All business settings (trial fee, slot capacity, admin numbers, coach numbers, contact info) stored in DB `configuration` table
- Changes take effect immediately — no restart needed
- Application reads config at runtime, not at startup

## Naming Conventions
- Python: `snake_case` files, PEP 8, type hints everywhere
- TypeScript: `PascalCase` components, `camelCase` functions/variables, strict typing, no `any`
- DB files: `snake_case` (e.g., `trial_booking_service.py`, `student_repository.py`)
