# Horse Riding Club Management System

# Pydantic Schema Generation Specification

Version: 1.0

---

# 1. Purpose

This document defines the standards for generating Pydantic schemas for the backend application.

The objective is to ensure:

* Consistent API request validation
* Consistent API response structures
* Separation between database models and API contracts
* Type safety
* Easy frontend integration

All FastAPI APIs must use Pydantic schemas.

---

# 2. Technology Standard

Validation Framework:

```text
Pydantic V2
```

Language:

```text
Python 3.13+
```

Framework:

```text
FastAPI
```

---

# 3. Schema Location

All schemas must exist under:

```text
backend/app/schemas/
```

Example:

```text
schemas/

├── student_schema.py
├── coach_schema.py
├── trial_booking_schema.py
└── fee_schema.py
```

---

# 4. Separation Rule

Database models and API schemas are different objects.

Flow:

```text
PostgreSQL

↓

SQLAlchemy Model

↓

Pydantic Schema

↓

JSON Response
```

Never expose SQLAlchemy models directly through APIs.

---

# 5. Schema Types

Each module should have three categories of schemas:

```text
Create Schema

Update Schema

Response Schema
```

---

# 6. Create Schema

Used when creating new records.

Example:

```python
class StudentCreate(BaseModel):

    name: str

    mobile_number: str

    joining_date: date
```

Contains:

* Required input fields
* User provided data

Does not contain:

* ID
* created_at
* updated_at

---

# 7. Update Schema

Used for partial or complete updates.

Example:

```python
class StudentUpdate(BaseModel):

    name: str | None

    mobile_number: str | None
```

All fields are optional.

---

# 8. Response Schema

Used for API responses.

Example:

```python
class StudentResponse(BaseModel):

    id: UUID

    name: str

    mobile_number: str

    model_config = {
        "from_attributes": True
    }
```

---

# 9. Schema Naming Convention

Database table:

```text
students
```

SQLAlchemy Model:

```python
Student
```

Schemas:

```python
StudentCreate

StudentUpdate

StudentResponse
```

---

# 10. Common Schema

Location:

```text
schemas/common.py
```

Contains:

* Pagination
* Standard responses
* Common identifiers

Example:

```python
class Pagination(BaseModel):

    page: int

    size: int

    total: int
```

---

# 11. UUID Handling

UUIDs are returned in responses.

Example:

```json
{
    "id":"550e8400-e29b"
}
```

Users never provide UUIDs during normal operations.

---

# 12. Mobile Number Validation

Mobile numbers require validation.

Example:

```python
mobile_number: str
```

Validation:

* Numeric only
* Configurable length
* Country code support

---

# 13. Date Validation

All dates use:

```text
YYYY-MM-DD
```

Example:

```python
joining_date: date
```

Invalid:

```text
20-07-2026
```

---

# 14. Enum Validation

Business states should use enums.

Example:

```python
class BookingStatus(str, Enum):

    BOOKED="Booked"

    ATTENDED="Attended"

    CANCELLED="Cancelled"

    NO_SHOW="No Show"
```

---

# 15. Nested Response Rules

Nested objects should only be returned when required.

Example:

Student Dashboard:

```json
{
    "student":
    {
        "name":"John"
    },

    "attendance":
    [],

    "payments":
    []
}
```

Avoid returning unnecessary complete objects.

---

# 16. File Upload Schemas

File upload metadata:

Example:

```python
class ImageResponse(BaseModel):

    file_path:str

    uploaded_at:datetime
```

The schema should not expose server filesystem details.

---

# 17. Dashboard Schemas

Dashboard APIs should use dedicated schemas.

Example:

```python
class StudentDashboardResponse(BaseModel):

    profile: StudentResponse

    attendance: AttendanceSummary

    fees: FeeSummary

    progress: ProgressSummary
```

Do not reuse database models directly.

---

# 18. Trial Booking Schemas

Example:

## Request

```python
class TrialBookingCreate(BaseModel):

    date: date

    time_slot: str

    name: str

    mobile_number: str

    location: str

    number_of_slots: int
```

---

## Response

```python
class TrialBookingResponse(BaseModel):

    booking_id: UUID

    date: date

    time_slot: str

    amount_paid: float
```

---

# 19. Validation Responsibility

Pydantic handles:

* Data format
* Required fields
* Type checking

Services handle:

* Business rules
* Slot availability
* Approval rules

Example:

Pydantic:

```text
number_of_slots must be integer
```

Service:

```text
Only 2 people allowed per slot
```

---

# 20. Schema File Organization

Each domain has its own schema file.

Example:

```text
schemas/

student_schema.py

contains:

StudentCreate

StudentUpdate

StudentResponse


fee_schema.py

contains:

FeePaymentCreate

FeePaymentResponse
```

---

# 21. Response Conversion

SQLAlchemy objects are converted using:

```python
model_config = {
    "from_attributes": True
}
```

---

# 22. Error Validation Response

Validation errors follow the standard API response format.

Example:

```json
{
    "success":false,
    "error_code":"VALIDATION_ERROR",
    "message":"Invalid data provided."
}
```

---

# 23. Testing Requirements

Each schema must test:

* Required fields
* Invalid values
* Optional fields
* Serialization
* Response conversion

---

# 24. Generation Order

Schemas should be generated after models.

Recommended order:

```text
SQL Schema

↓

SQLAlchemy Models

↓

Pydantic Schemas

↓

Repositories

↓

Services

↓

APIs
```

---

# 25. Final Schema Generation Rules

Generated Pydantic schemas must:

* Match API requirements.
* Never expose internal database details.
* Validate user input.
* Provide predictable JSON output.
* Support React Native, iOS, and Web clients.

---

# Conclusion

This specification ensures all API contracts remain consistent, validated, and independent from the database implementation.

All future FastAPI request and response schemas must follow these standards.
