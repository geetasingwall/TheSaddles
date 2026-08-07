# Horse Riding Club Management System

# SQLAlchemy Model Generation Specification

Version: 1.0

---

# 1. Purpose

This document defines the standards for generating SQLAlchemy ORM models for the backend application.

The objective is to ensure:

* One-to-one mapping between PostgreSQL tables and ORM models.
* Consistent model structure.
* Correct relationships.
* Maintainable database access.
* Compatibility with Alembic migrations.

All generated SQLAlchemy models must follow this specification.

---

# 2. Technology Standard

ORM:

```text
SQLAlchemy 2.x
```

Language:

```text
Python 3.13+
```

Database:

```text
PostgreSQL 16+
```

Style:

```text
Declarative ORM
```

---

# 3. Model Location

All models must exist under:

```text
backend/app/models/
```

Example:

```text
models/

├── base.py
├── student.py
├── coach.py
├── horse.py
└── trial_booking.py
```

---

# 4. Base Model Definition

All models inherit from a common Base.

Location:

```text
app/models/base.py
```

Example:

```python
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
```

---

# 5. Model Naming Convention

Database table:

```text
snake_case plural
```

Example:

```text
students
```

Python class:

```text
Singular PascalCase
```

Example:

```python
class Student(Base):
```

---

# 6. Table Declaration

Every model must explicitly define:

```python
__tablename__
```

Example:

```python
class Student(Base):

    __tablename__ = "students"
```

---

# 7. Primary Key Standard

All tables use UUID primary keys.

Example:

```python
from sqlalchemy.dialects.postgresql import UUID


id = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4
)
```

Rules:

* UUID generated automatically.
* UUID never entered manually.
* UUID never exposed directly to users.

---

# 8. Column Definition Standard

SQLAlchemy 2.x typing must be used.

Example:

```python
name: Mapped[str] = mapped_column(
    String(100),
    nullable=False
)
```

Avoid old style:

```python
Column(String)
```

---

# 9. Timestamp Columns

Every model should include:

```python
created_at

updated_at
```

Example:

```python
created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    server_default=func.now()
)
```

---

# 10. Audit Columns

Operational models include:

```python
created_by

updated_by
```

Example:

```python
created_by: Mapped[str | None]
```

---

# 11. Foreign Key Standards

Foreign keys must reference UUID primary keys.

Example:

```python
student_id: Mapped[UUID] = mapped_column(
    ForeignKey("students.id"),
    nullable=False
)
```

---

# 12. Relationship Standards

Relationships must be explicitly defined.

Example:

Student:

```python
attendance = relationship(
    "Attendance",
    back_populates="student"
)
```

Attendance:

```python
student = relationship(
    "Student",
    back_populates="attendance"
)
```

---

# 13. Cascade Rules

Cascade behaviour must be carefully defined.

Default:

```text
No automatic delete cascade
```

Reason:

Important business records should not disappear accidentally.

---

# 14. Enum Standards

Database enums should use Python enums.

Example:

```python
from enum import Enum


class BookingStatus(str, Enum):

    BOOKED = "Booked"

    ATTENDED = "Attended"

    CANCELLED = "Cancelled"

    NO_SHOW = "No Show"
```

---

# 15. Boolean Fields

Boolean fields must have explicit defaults.

Example:

```python
is_active: Mapped[bool] = mapped_column(
    default=True
)
```

---

# 16. Nullable Fields

Mandatory business fields:

```python
nullable=False
```

Optional information:

```python
nullable=True
```

Example:

Mandatory:

```python
name
mobile_number
```

Optional:

```python
remarks
profile_image
```

---

# 17. Unique Constraints

Unique database rules must be reflected.

Example:

Mobile number:

```python
mobile_number = mapped_column(
    unique=True
)
```

---

# 18. Index Definitions

Indexes defined in PostgreSQL must be represented.

Example:

```python
__table_args__ = (
    Index(
        "idx_student_mobile",
        "mobile_number"
    ),
)
```

---

# 19. Model File Structure

Each table gets one model file.

Example:

```text
models/

student.py

class Student


attendance.py

class Attendance
```

Do not combine multiple models in one file.

---

# 20. Model Responsibilities

Models contain:

Allowed:

* Columns
* Relationships
* Constraints
* Table metadata

Not allowed:

* API logic
* Validation logic
* Business workflows
* External service calls

---

# 21. Database Schema Mapping

The SQL files are the source of truth.

Generation flow:

```text
PostgreSQL Schema

        ↓

SQLAlchemy Models

        ↓

Alembic Migration

        ↓

Database
```

---

# 22. Model Generation Order

Models should be generated in dependency order.

Recommended sequence:

```text
1. Configuration

2. Administrators

3. Coaches

4. Batches

5. Facilities

6. Horses

7. Team Members

8. Testimonials

9. Club Locations

10. Registrations

11. Students

12. Trial Bookings

13. Fee Payments

14. Attendance

15. Student Progress
```

---

# 23. Testing Requirements

Every generated model must verify:

* Table mapping
* Relationships
* Foreign keys
* Constraints
* Migration generation

---

# 24. Example Model

Example:

```python
class Student(Base):

    __tablename__ = "students"


    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )


    mobile_number: Mapped[str] = mapped_column(
        String(15),
        unique=True,
        nullable=False
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )
```

---

# 25. Final Model Generation Rule

The generated SQLAlchemy models must:

* Match the frozen PostgreSQL schema exactly.
* Not introduce new columns.
* Not remove existing columns.
* Not contain business logic.
* Be ready for Alembic migration generation.

---

# Conclusion

This specification ensures that SQLAlchemy models remain consistent with the PostgreSQL schema and provide a stable foundation for repositories, services, and APIs.
