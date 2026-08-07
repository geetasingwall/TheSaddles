# Horse Riding Club Management System

# Backend Project Structure

Version: 1.0

---

# 1. Purpose

This document defines the standard folder and file structure for the backend application.

The objective is to ensure:

* Clear separation of responsibilities
* Easy navigation
* Maintainable codebase
* Consistent development practices
* Easy onboarding for future developers

All generated backend code must follow this structure.

---

# 2. Root Project Structure

```
Horse-Riding-Club-System/

│
├── backend/
│
├── frontend/
│
├── database/
│
├── documentation/
│
├── deployment/
│
└── README.md
```

---

# 3. Backend Structure

```
backend/

│
├── app/
│
├── tests/
│
├── alembic/
│
├── requirements.txt
│
├── .env
│
├── .env.example
│
└── main.py
```

---

# 4. Application Folder

```
backend/app/

│
├── api/
├── services/
├── repositories/
├── models/
├── schemas/
├── database/
├── core/
├── middleware/
├── utils/
├── uploads/
├── static/
└── configuration/
```

---

# 5. API Layer Structure

```
app/api/

│
├── router.py
│
└── endpoints/

    │
    ├── admin.py
    ├── coaches.py
    ├── students.py
    ├── registrations.py
    ├── trial_bookings.py
    ├── attendance.py
    ├── fees.py
    ├── progress.py
    ├── horses.py
    ├── facilities.py
    ├── testimonials.py
    └── locations.py
```

Responsibilities:

* Define API endpoints
* Request handling
* Response formatting
* Dependency injection

No database queries allowed.

---

# 6. Service Layer Structure

```
app/services/

│
├── admin_service.py
├── coach_service.py
├── student_service.py
├── registration_service.py
├── trial_booking_service.py
├── attendance_service.py
├── fee_service.py
├── progress_service.py
├── horse_service.py
├── facility_service.py
├── testimonial_service.py
└── location_service.py
```

Responsibilities:

* Business logic
* Workflow execution
* Validation rules
* Transaction management

---

# 7. Repository Layer Structure

```
app/repositories/

│
├── admin_repository.py
├── coach_repository.py
├── student_repository.py
├── registration_repository.py
├── trial_booking_repository.py
├── attendance_repository.py
├── fee_repository.py
├── progress_repository.py
├── horse_repository.py
├── facility_repository.py
├── testimonial_repository.py
└── location_repository.py
```

Responsibilities:

* Database communication
* CRUD operations
* Query execution

---

# 8. Database Models Structure

```
app/models/

│
├── base.py
│
├── administrator.py
├── coach.py
├── student.py
├── registration.py
├── trial_booking.py
├── attendance.py
├── fee_payment.py
├── student_progress.py
├── batch.py
├── horse.py
├── facility.py
├── team_member.py
├── testimonial.py
└── club_location.py
```

Responsibilities:

* SQLAlchemy ORM models
* Relationships
* Database mappings

---

# 9. Pydantic Schema Structure

```
app/schemas/

│
├── common.py
│
├── admin_schema.py
├── coach_schema.py
├── student_schema.py
├── registration_schema.py
├── trial_booking_schema.py
├── attendance_schema.py
├── fee_schema.py
├── progress_schema.py
├── horse_schema.py
├── facility_schema.py
├── testimonial_schema.py
└── location_schema.py
```

Responsibilities:

* API request validation
* API response models
* Data serialization

---

# 10. Database Configuration

```
app/database/

│
├── connection.py
├── session.py
└── initialization.py
```

Responsibilities:

* PostgreSQL connection
* SQLAlchemy session management
* Database initialization

---

# 11. Core Configuration

```
app/core/

│
├── config.py
├── security.py
├── constants.py
└── exceptions.py
```

Responsibilities:

* Application settings
* Constants
* Common exceptions
* Shared utilities

---

# 12. Middleware

```
app/middleware/

│
├── logging.py
├── error_handler.py
└── request_tracker.py
```

Responsibilities:

* Request logging
* Exception handling
* Request monitoring

---

# 13. Utility Functions

```
app/utils/

│
├── phone_validator.py
├── date_utils.py
├── file_handler.py
└── response_handler.py
```

Responsibilities:

* Common reusable functions
* File management
* Response formatting

---

# 14. Upload Structure

```
app/uploads/

│
├── horses/
├── team/
├── facilities/
└── testimonials/
```

Only file paths are stored in PostgreSQL.

---

# 15. Static Content

```
app/static/

│
├── images/
├── documents/
└── website/
```

Used for publicly accessible content.

---

# 16. Alembic Structure

```
alembic/

│
├── versions/
│
├── env.py
│
├── script.py.mako
│
└── alembic.ini
```

Responsibilities:

* Database migrations
* Schema version management

---

# 17. Testing Structure

```
tests/

│
├── unit/
│
├── integration/
│
├── api/
│
└── fixtures/
```

---

# 18. Environment Files

```
.env.example
```

Contains template configuration:

```
DATABASE_URL=

APP_ENV=

DEBUG=

UPLOAD_PATH=

ALLOWED_ORIGINS=
```

Actual values exist only in:

```
.env
```

---

# 19. Main Application Entry

File:

```
main.py
```

Responsibilities:

* Create FastAPI application
* Register routers
* Configure middleware
* Start application

No business logic allowed.

---

# 20. Final Backend Structure

```
backend/

├── app/
│
│   ├── api/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── schemas/
│   ├── database/
│   ├── core/
│   ├── middleware/
│   ├── utils/
│   └── uploads/
│
├── tests/
│
├── alembic/
│
├── requirements.txt
│
├── .env
│
└── main.py
```

---

# Conclusion

This structure provides a clean foundation for implementing the backend.

All future backend files, APIs, models, services, repositories, and tests must follow this structure.
