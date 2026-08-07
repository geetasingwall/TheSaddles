# Horse Riding Club Management System

# API Router Generation Specification

Version: 1.0

---

# 1. Purpose

This document defines the standards for generating FastAPI API routers.

The objective is to ensure:

* Consistent API implementation
* Clean separation of responsibilities
* Predictable frontend integration
* Maintainable endpoint structure

All backend APIs must follow this specification.

---

# 2. API Architecture Flow

The API request flow:

```text id="8v5n1x"
Mobile / Web Application

        ↓

FastAPI Router

        ↓

Service Layer

        ↓

Repository Layer

        ↓

PostgreSQL Database
```

---

# 3. Router Responsibilities

API routers are responsible for:

* Receiving HTTP requests
* Validating request schemas
* Calling services
* Returning API responses
* Applying authentication checks

---

# 4. Router Responsibilities NOT Allowed

Routers must NOT contain:

* Business rules
* Database queries
* SQLAlchemy operations
* Complex calculations
* Workflow logic

---

# 5. Router Location

All routers must exist under:

```text id="x6n4nm"
backend/app/api/
```

Example:

```text id="u9j5n0"
api/

├── auth_router.py

├── student_router.py

├── booking_router.py

├── attendance_router.py

├── admin_router.py

└── coach_router.py
```

---

# 6. Router Naming Convention

Domain:

```text id="q0j4l6"
Student
```

Router:

```text id="8c4k2f"
student_router.py
```

API Prefix:

```text id="d0w0n6"
/api/v1/students
```

---

# 7. Router Structure Example

Example:

```python id="e3m8b1"
router = APIRouter(
    prefix="/students",
    tags=["Students"]
)
```

---

# 8. API Versioning

All APIs must use:

```text id="ydl3q5"
/api/v1
```

Example:

```text id="7d1h9s"
/api/v1/students
```

---

# 9. Endpoint Naming Rules

Use resource-based URLs.

Correct:

```text id="c9p8p6"
GET /students/{id}

POST /students

GET /students/dashboard
```

Incorrect:

```text id="1m4h9a"
GET /getStudents

POST /createStudent
```

---

# 10. HTTP Method Usage

## GET

Used for retrieving data.

Examples:

```text id="4hjh5a"
GET /students/profile

GET /trial-bookings/slots
```

---

## POST

Used for creating actions.

Examples:

```text id="0f4w4q"
POST /trial-bookings

POST /registrations
```

---

## PUT

Used for complete updates.

Example:

```text id="d0l2v3"
PUT /students/{id}
```

---

## PATCH

Used for partial updates.

Example:

```text id="f4a6bs"
PATCH /registrations/{id}/approve
```

---

# 11. Request Schema Usage

Every POST, PUT, PATCH request must use Pydantic schemas.

Example:

```python id="x9u1qf"
async def create_booking(
    request: TrialBookingCreate
):
```

---

# 12. Response Schema Usage

Every endpoint must define response models.

Example:

```python id="h7q1a9"
response_model =
TrialBookingResponse
```

---

# 13. Dependency Injection

Routers receive:

* Services
* Current session
* Configuration

Example:

```python id="k2p9c3"
service = Depends(
    get_student_service
)
```

---

# 14. Standard Response Usage

Routers must return standard API responses.

Example:

```json id="t3y9am"
{
    "success":true,
    "message":"Booking created successfully",
    "data":{}
}
```

---

# 15. Authentication Handling

The system uses mobile-number based identification.

Protected APIs require:

* Valid session token
* Identified user type

Example:

```text id="0b5t9n"
Student Dashboard

Requires:

Student session
```

---

# 16. User Type Validation

Before accessing protected APIs:

Backend checks:

```text id="b4n3yx"
Mobile Number

        ↓

User Identification

        ↓

User Type Validation
```

---

# 17. Public APIs

No login required:

Examples:

```text id="p0z5ef"
GET /facilities

GET /horses

GET /team

POST /trial-bookings

POST /registrations
```

---

# 18. Student APIs

Examples:

```text id="k8x2a7"
GET /students/dashboard

GET /students/attendance

GET /students/progress

GET /students/fees
```

---

# 19. Coach APIs

Examples:

```text id="q3m9q1"
GET /coach/students

POST /coach/attendance

POST /coach/progress
```

---

# 20. Administrator APIs

Examples:

```text id="2j3g7a"
GET /admin/bookings

GET /admin/registrations

PATCH /admin/registrations/{id}/approve

GET /admin/reports
```

---

# 21. Trial Booking APIs

Required endpoints:

```text id="0m9g0r"
GET

/trial-bookings/available-slots


POST

/trial-bookings


GET

/trial-bookings/{id}
```

---

# 22. Registration APIs

Required endpoints:

```text id="rq4v8z"
POST

/registrations


GET

/registrations/status
```

---

# 23. Attendance APIs

Required endpoints:

```text id="9c4f8u"
POST

/attendance


GET

/students/{id}/attendance
```

---

# 24. Location APIs

Required endpoints:

```text id="r9x4s8"
GET /locations
```

Response should include:

* Location name
* Address
* Latitude
* Longitude
* Map URL

---

# 25. Error Handling

Routers should allow global exception handlers to manage errors.

Example:

Service:

```text id="k8z7nw"
SlotUnavailableException
```

Router response:

```json id="a2m8v4"
{
    "success":false,
    "error_code":"SLOT_FULL"
}
```

---

# 26. API Documentation

FastAPI automatically generates:

Swagger:

```text id="g7v4s0"
/docs
```

OpenAPI:

```text id="c1q8fz"
/openapi.json
```

---

# 27. Testing Requirements

Every endpoint must test:

* Valid request
* Invalid request
* Missing fields
* Unauthorized access
* Business rule failure
* Successful response format

---

# 28. Router Generation Order

Recommended sequence:

```text id="k4x7s5"
Authentication Router

↓

Configuration Router

↓

Registration Router

↓

Student Router

↓

Trial Booking Router

↓

Attendance Router

↓

Fee Router

↓

Progress Router

↓

Admin Router

↓

Coach Router
```

---

# 29. Final API Router Rule

Routers should remain thin.

The correct pattern:

```text id="j6h4w9"
Router

(HTTP Handling)

        ↓

Service

(Business Logic)

        ↓

Repository

(Database)
```

---

# Conclusion

This specification ensures that FastAPI endpoints remain clean, consistent, and easy to consume across Android, iOS, and Web applications.

All future API development must follow this router generation standard.
