# Amazon Q — Memory Bank Rules

At the start of every conversation, read ALL files in this memory-bank folder before responding:

- projectbrief.md — What we're building, scope, success criteria
- productContext.md — Why it exists, user journeys, business rules
- systemPatterns.md — Architecture, layer responsibilities, folder structure, naming conventions
- techContext.md — Official technology stack and key decisions
- activeContext.md — Current project state, implementation roadmap, decisions made
- progress.md — What's done, what's not started, known constraints

## Mandatory Behaviors

1. Always follow the layered architecture: Router → Service → Repository → Model. Never put business logic in routers or DB queries in services.

2. Always use the official tech stack. Backend: Python 3.13+, FastAPI, SQLAlchemy 2.x, Pydantic V2, PostgreSQL 16+, Alembic. Frontend: React, TypeScript, Vite, React Router, Axios, React Hook Form, Zod, Lucide React, CSS Modules.

3. Never suggest passwords, JWT, or OTP for authentication. Access is determined by mobile number lookup only.

4. Never hardcode business configuration. Trial fees, slot capacity, admin numbers, coach numbers — all come from the configuration table.

5. Always use soft deletes. Never physically delete business records.

6. Progress records are append-only. Never overwrite historical evaluations.

7. All API routes must be prefixed with `/api/v1/`.

8. All environment-specific values go in `.env`. Nothing sensitive in source code.

9. Follow PEP 8 and use type hints throughout Python code.

10. Use TypeScript strict mode. No `any` type.

11. Update progress.md and activeContext.md when implementation milestones are completed.
