# Horse Riding Club Management System

# Database Access Standards

Version: 1.0

---

# 1. Purpose

This document defines the standards for database access within the backend application.

The objective is to ensure:

* Consistent database communication
* Proper transaction management
* Clean separation between business logic and persistence
* Maintainable SQLAlchemy implementation
* Safe and efficient PostgreSQL usage

All database-related code must follow these rules.

---

# 2. Database Technology

The system uses:

Database:

```
PostgreSQL 16+
```

ORM:

```
SQLAlchemy 2.x
```

Migration:

```
Alembic
```

Database Driver:

```
asyncpg
```

---

# 3. Database Architecture

The database communication flow is:

```
FastAPI Endpoint

        ↓

Service Layer

        ↓

Repository Layer

        ↓

SQLAlchemy Session

        ↓

PostgreSQL
```

No component should bypass this flow.

---

# 4. Database Layer Responsibilities

## SQLAlchemy Models

Responsible for:

* Table mapping
* Column definitions
* Relationships
* Constraints

Not responsible for:

* Business rules
* Validation logic
* API formatting

---

## Repository Layer

Responsible for:

* Query execution
* CRUD operations
* Database filtering
* Pagination
* Sorting

Not responsible for:

* Business decisions
* User permissions
* Workflow processing

---

## Service Layer

Responsible for:

* Calling repositories
* Applying business rules
* Managing workflows

---

# 5. SQLAlchemy Model Standards

Every model must:

* Inherit from the common Base class.
* Match the PostgreSQL schema.
* Define relationships explicitly.
* Use type annotations.
* Avoid business logic.

Example:

```python
class Student(Base):

    __tablename__ = "students"

    id: Mapped[UUID]

    registration_id: Mapped[UUID]

    joining_date: Mapped[date]
```

---

# 6. Primary Key Standard

All tables use UUID primary keys.

Example:

```python
id = Column(
    UUID,
    primary_key=True,
    default=uuid.uuid4
)
```

UUIDs:

* Are internal identifiers.
* Are never displayed to users.
* Are not entered manually.

---

# 7. Mobile Number Standard

Mobile number is the business identifier.

Used for:

* Login lookup
* Student search
* Dashboard access

Example:

```
9876543210
```

Database design:

```
id
 |
 UUID

mobile_number
 |
 Unique
```

---

# 8. Database Session Management

Each API request receives one database session.

Flow:

```
Request Start

      ↓

Create Session

      ↓

Execute Operations

      ↓

Commit / Rollback

      ↓

Close Session
```

Sessions must never remain open after request completion.

---

# 9. Async Database Usage

The backend should use asynchronous database operations.

Example:

```python
async with session:

    result = await session.execute(query)
```

Benefits:

* Better API concurrency
* Improved performance
* Suitable for mobile applications

---

# 10. Repository Rules

Repositories must contain only database operations.

Allowed:

```python
get_student_by_mobile()

create_booking()

update_payment()
```

Not allowed:

```python
approve_student()

calculate_fee()

send_notification()
```

Those belong to services.

---

# 11. CRUD Naming Standards

Repository methods should follow consistent names.

## Create

```
create_<entity>()
```

Example:

```
create_trial_booking()
```

---

## Read

```
get_<entity>()
```

Example:

```
get_student()
```

---

## Search

```
find_<entity>()
```

Example:

```
find_student_by_mobile()
```

---

## Update

```
update_<entity>()
```

Example:

```
update_registration_status()
```

---

## Delete

```
delete_<entity>()
```

---

# 12. Query Standards

Queries should:

* Select only required data.
* Use indexes.
* Avoid unnecessary joins.
* Use pagination for large lists.

Avoid:

```sql
SELECT *
```

Prefer:

```sql
SELECT required_columns
```

---

# 13. Relationship Loading

Relationships should not automatically load large datasets.

Avoid unnecessary:

```
lazy="joined"
```

for large collections.

Prefer explicit loading.

Example:

```
Student

    |

    Attendance History
```

Load attendance only when required.

---

# 14. Transaction Standards

Transactions belong to the service layer.

Example:

```
Approve Registration

    ↓

Create Student

    ↓

Update Registration

    ↓

Commit
```

All operations succeed together or fail together.

---

# 15. Rollback Handling

Any failure during a transaction must rollback.

Example:

```python
try:

    await service_operation()

    await session.commit()


except Exception:

    await session.rollback()

    raise
```

---

# 16. Migration Rules

All database changes must happen through Alembic.

Never manually modify production tables.

Flow:

```
Modify SQLAlchemy Model

        ↓

Generate Migration

        ↓

Review Migration

        ↓

Apply Migration
```

---

# 17. Database Naming Standards

Tables:

```
snake_case plural
```

Examples:

```
students

trial_bookings

fee_payments
```

---

Columns:

```
snake_case
```

Examples:

```
mobile_number

created_at
```

---

# 18. Timestamp Standards

Every table must contain:

```sql
created_at

updated_at
```

Format:

```
TIMESTAMPTZ
```

---

# 19. Audit Fields

Every operational table should contain:

```
created_by

updated_by
```

These fields help track administrative changes.

---

# 20. Soft Delete Standard

Do not physically delete important records.

Use:

```sql
is_active BOOLEAN
```

Examples:

* Students
* Coaches
* Horses
* Testimonials

---

# 21. Database Error Handling

Database errors must be:

* Logged internally.
* Converted into meaningful API responses.
* Never exposed directly to users.

Example:

Database:

```
unique constraint violation
```

API:

```json
{
 "success":false,
 "message":"Mobile number already registered."
}
```

---

# 22. Performance Guidelines

The backend should:

* Use indexes defined in schema.
* Avoid N+1 queries.
* Use pagination.
* Avoid loading unnecessary relationships.
* Cache static configuration where appropriate.

---

# 23. Backup Considerations

Production database backups should include:

* Daily incremental backups
* Periodic full backups

Backup process is handled separately during deployment planning.

---

# 24. Final Database Access Rule

The mandatory architecture is:

```
API

 ↓

Service

 ↓

Repository

 ↓

SQLAlchemy

 ↓

PostgreSQL
```

No direct database access is allowed outside the repository layer.

---

# Conclusion

Following these database access standards ensures the backend remains maintainable, scalable, and consistent as new features are added.
