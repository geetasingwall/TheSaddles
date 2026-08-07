# Horse Riding Club Management System

# Repository Layer Generation Specification

Version: 1.0

---

# 1. Purpose

This document defines the standards for generating the repository layer of the backend application.

The repository layer provides a clean separation between:

* Business logic
* API logic
* Database operations

The objective is to ensure:

* Maintainable database access
* Reusable queries
* Consistent CRUD operations
* Easier testing

---

# 2. Repository Architecture

The backend follows:

```text
FastAPI Router

        ↓

Service Layer

        ↓

Repository Layer

        ↓

SQLAlchemy Models

        ↓

PostgreSQL
```

The repository layer is the only layer allowed to directly communicate with the database.

---

# 3. Repository Location

All repositories must exist under:

```text
backend/app/repositories/
```

Example:

```text
repositories/

├── student_repository.py

├── coach_repository.py

├── horse_repository.py

├── trial_booking_repository.py

└── attendance_repository.py
```

---

# 4. Repository Naming Convention

Database table:

```text
students
```

Model:

```python
Student
```

Repository:

```python
StudentRepository
```

File:

```text
student_repository.py
```

---

# 5. Repository Responsibilities

Repositories are responsible for:

* Creating records
* Reading records
* Updating records
* Deleting records
* Filtering
* Pagination
* Database queries

Repositories are NOT responsible for:

* Business rules
* User permissions
* Notifications
* API formatting

---

# 6. Repository Base Class

A common base repository should be created.

Location:

```text
repositories/base_repository.py
```

Purpose:

Provide common operations.

Example:

```python
class BaseRepository:

    async def get()

    async def create()

    async def update()

    async def delete()
```

---

# 7. Dependency Injection

Repositories receive database sessions through dependency injection.

Example:

```python
class StudentRepository:

    def __init__(
        self,
        session
    ):
        self.session = session
```

---

# 8. CRUD Standards

Every repository should provide standard CRUD methods.

---

# Create

Naming:

```python
create_<entity>()
```

Example:

```python
create_student()
```

Purpose:

Insert new database record.

---

# Read

Naming:

```python
get_<entity>()
```

Example:

```python
get_student()
```

Purpose:

Retrieve by primary identifier.

---

# Search

Naming:

```python
find_<entity>_by_<field>()
```

Example:

```python
find_student_by_mobile()
```

---

# Update

Naming:

```python
update_<entity>()
```

Example:

```python
update_student()
```

---

# Delete

Naming:

```python
delete_<entity>()
```

Example:

```python
delete_student()
```

---

# 9. Student Repository Example

Location:

```text
repositories/student_repository.py
```

Example:

```python
class StudentRepository:


    async def find_by_mobile(
        self,
        mobile_number:str
    ):

        query = select(Student)\
        .where(
            Student.mobile_number ==
            mobile_number
        )

        result = await self.session.execute(query)

        return result.scalar_one_or_none()
```

---

# 10. Query Standards

Repositories should:

* Use SQLAlchemy ORM queries.
* Avoid raw SQL unless required.
* Return model objects.
* Avoid business decisions.

---

# 11. Pagination Support

Large collections must support pagination.

Example:

```python
async def get_students(
    page:int,
    size:int
):
```

Query:

```text
OFFSET

LIMIT
```

---

# 12. Filtering Support

Filters should be implemented in repositories.

Example:

```text
Students

Filter:

- Active students
- Batch
- Joining date
```

---

# 13. Sorting Support

Repositories should support:

```text
sort_field

sort_order
```

Example:

```text
Students sorted by name
```

---

# 14. Relationship Loading

Repositories control relationship loading.

Example:

Student Dashboard:

Required:

```text
Student

+

Attendance Summary

+

Fee Summary
```

Not required:

```text
All historical attendance records
```

Avoid unnecessary database load.

---

# 15. Transaction Handling

Repositories should NOT commit transactions.

Incorrect:

```python
await session.commit()
```

Correct:

```python
await session.add(record)
```

Transaction management belongs to the service layer.

---

# 16. Error Handling

Repositories should raise meaningful exceptions.

Example:

Incorrect:

```python
raise Exception()
```

Correct:

```python
raise StudentNotFoundException()
```

---

# 17. Repository Return Rules

Repositories return:

Allowed:

```text
SQLAlchemy Model

List of Models

None
```

Not allowed:

```text
JSON

API Response

HTTP Response
```

---

# 18. Domain Repository Examples

Required repositories:

```text
AdminRepository

CoachRepository

StudentRepository

RegistrationRepository

TrialBookingRepository

AttendanceRepository

FeeRepository

HorseRepository

FacilityRepository

TestimonialRepository

ConfigurationRepository
```

---

# 19. Trial Booking Repository Specific Rules

Responsibilities:

Allowed:

* Check available slots
* Save booking
* Retrieve bookings

Not allowed:

* Calculate business pricing
* Decide approval rules

Example:

```python
get_available_slots(date)
```

---

# 20. Configuration Repository

The system uses a generic configuration table.

Repository:

```text
ConfigurationRepository
```

Responsibilities:

* Read system settings
* Update configurable values

Examples:

```text
trial_fee

trial_slot_capacity

club_contact_number
```

---

# 21. Testing Requirements

Every repository must test:

* Successful queries
* Empty results
* Database failures
* Constraints
* Pagination
* Filtering

---

# 22. Repository Generation Order

Repositories should be created after:

```text
SQL Schema

↓

SQLAlchemy Models

↓

Pydantic Schemas
```

Then:

```text
Repositories

↓

Services

↓

APIs
```

---

# 23. Repository Quality Rules

Repositories must:

* Have simple methods.
* Avoid duplicated queries.
* Use proper indexing.
* Avoid business logic.
* Be independently testable.

---

# 24. Final Repository Flow

```text
API Request

      ↓

Service

      ↓

Repository Method

      ↓

Database Query

      ↓

SQLAlchemy Model

      ↓

Service Response
```

---

# Conclusion

The repository layer provides a clean and controlled database access boundary.

Following this specification keeps the backend scalable, testable, and easy to maintain as new horse riding club features are added.
