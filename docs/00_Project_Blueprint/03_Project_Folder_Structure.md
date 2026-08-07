# Horse Riding Club Management System

## Project Folder Structure

**Version:** 1.0

---

# Purpose

This document defines the official folder structure of the Horse Riding Club Management System.

The objective is to ensure every developer and AI coding tool follows exactly the same project organization throughout the application's lifecycle.

This folder structure is considered **frozen** once approved. New modules should be added without reorganizing the existing structure.

---

# Design Principles

The project structure has been designed with the following goals:

* Clear separation of responsibilities
* Modular architecture
* Easy navigation
* AI-friendly code generation
* Future scalability
* Simplified deployment
* Independent frontend and backend development

---

# Root Directory

```
Horse-Riding-Club-System/

│
├── docs/
├── backend/
├── frontend/
├── database/
├── deployment/
├── scripts/
├── assets/
├── tests/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

# Folder Overview

| Folder     | Purpose                                   |
| ---------- | ----------------------------------------- |
| docs       | Complete project documentation            |
| backend    | Python FastAPI backend                    |
| frontend   | React Native application                  |
| database   | SQL scripts and migrations                |
| deployment | Docker, Nginx and deployment files        |
| scripts    | Utility and automation scripts            |
| assets     | Images, icons, logos and static resources |
| tests      | Test suites                               |

---

# Documentation Structure

```
docs/

├── 00_Project_Blueprint/
├── 01_Database_Design/
├── 02_Backend/
├── 03_Frontend/
├── 04_Admin_Portal/
├── 05_APIs/
├── 06_Testing/
├── 07_Deployment/
└── 08_Project_Sprints/
```

Each section contains standalone Markdown documents that act as implementation contracts.

---

# Backend Structure

```
backend/

├── app/
│   ├── api/
│   ├── core/
│   ├── database/
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── services/
│   ├── middleware/
│   ├── utilities/
│   ├── configuration/
│   └── main.py
│
├── migrations/
├── uploads/
├── logs/
├── requirements.txt
└── Dockerfile
```

---

## app/api

Contains REST API endpoints grouped by feature.

Example:

```
api/

booking.py

registration.py

attendance.py

student.py

coach.py

admin.py

facilities.py

horses.py

team.py
```

---

## app/core

Contains application-wide utilities.

Examples:

* Application settings
* Constants
* Error handlers
* Dependency injection
* Common helpers

---

## app/database

Contains:

* Database connection
* Session management
* Base model
* Migration helpers

---

## app/models

Contains SQLAlchemy models.

One model per file.

Example:

```
student.py

attendance.py

booking.py

horse.py
```

---

## app/schemas

Contains Pydantic request and response models.

Naming convention:

```
student_request.py

student_response.py

booking_request.py

booking_response.py
```

---

## app/repositories

Responsible only for database interaction.

Repositories must not contain business rules.

---

## app/services

Contains business logic.

Examples:

* Booking availability
* Attendance calculation
* Fee calculation
* Dashboard generation
* Registration approval

All business rules belong here.

---

## app/middleware

Contains:

* Logging middleware
* Exception middleware
* Request timing
* Future authentication middleware

---

## app/utilities

General reusable helper functions.

Examples:

* Date formatting
* Phone number utilities
* Validators
* File helpers

---

## app/configuration

Stores configuration management classes.

Examples:

* Trial timings
* Upload paths
* Environment settings
* Application configuration

---

# Frontend Structure

```
frontend/

├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   ├── store/
│   ├── theme/
│   ├── types/
│   ├── utilities/
│   └── App.tsx
│
├── android/
├── ios/
├── web/
├── package.json
└── tsconfig.json
```

---

## src/screens

Organized by feature.

Example:

```
Landing/

Booking/

Registration/

StudentDashboard/

CoachDashboard/

AdminDashboard/

Attendance/

Facilities/

Horses/

Team/

Testimonials/

Contact/
```

Each screen should have its own folder containing:

* Screen
* Styles
* Components (if specific)
* Hooks (if required)

---

## src/components

Reusable UI components.

Examples:

```
Button

Card

Modal

TextField

Dropdown

Header

Footer

Loading

Calendar

Badge

Table
```

These components should be generic and reusable across the application.

---

## src/api

Contains API client definitions.

Example:

```
bookingApi.ts

studentApi.ts

attendanceApi.ts

horseApi.ts
```

---

## src/services

Contains client-side service logic such as:

* API wrappers
* Local caching
* Session management

---

## src/store

Redux Toolkit implementation.

Suggested structure:

```
store/

index.ts

bookingSlice.ts

studentSlice.ts

attendanceSlice.ts

configurationSlice.ts
```

---

## src/theme

Contains:

* Colors
* Typography
* Spacing
* Icons
* Responsive breakpoints

All styling should reference the centralized theme.

---

# Database Structure

```
database/

├── schema/
├── migrations/
├── seed/
├── views/
├── functions/
├── procedures/
└── backups/
```

---

## schema

Contains all production SQL files.

Each table should be defined in a separate SQL file.

---

## migrations

Contains Alembic migration scripts.

---

## seed

Contains reference data.

Examples:

* Cities
* Trial slot templates
* Configuration values

No production user data should be stored here.

---

# Assets Structure

```
assets/

├── logo/
├── horses/
├── facilities/
├── team/
├── testimonials/
├── gallery/
└── icons/
```

---

# Deployment Structure

```
deployment/

├── docker/
├── nginx/
├── production/
├── staging/
└── scripts/
```

---

# Test Structure

```
tests/

├── backend/
├── frontend/
├── integration/
├── api/
└── performance/
```

---

# Naming Conventions

## Folders

* lowercase
* singular where appropriate
* descriptive names

Examples:

```
booking

attendance

student

facility
```

---

## Files

Use descriptive snake_case names.

Examples:

```
trial_booking_service.py

student_repository.py

attendance_schema.py
```

TypeScript files should follow camelCase or PascalCase according to React conventions.

---

# Module Independence

Every major feature should remain independent.

Examples:

* Trial Booking
* Registration
* Attendance
* Student Dashboard
* Horses
* Facilities

Each module should include:

* APIs
* Services
* Database models
* Validation
* UI screens

This allows new modules to be developed with minimal impact on existing functionality.

---

# Future Expansion

The structure supports future additions such as:

* Payment Module
* Stable Management
* Membership Plans
* Horse Health Records
* Inventory Management
* Event Registration
* Merchandise Store
* AI Assistant
* Multi-Branch Support

These modules can be added without restructuring the existing project.

---

# Folder Structure Freeze

The directory structure defined in this document is the official repository layout for Version 1.0.

Future modules should integrate into this structure rather than reorganizing it.

Maintaining a stable folder structure ensures consistent development practices, easier onboarding of contributors, and more predictable AI-assisted code generation.

---

**End of Document**
