# Horse Riding Club Management System

# Service Layer Generation Specification

Version: 1.0

---

# 1. Purpose

This document defines the standards for creating the service layer in the backend application.

The service layer is responsible for implementing business workflows and rules.

The objective is to ensure:

* Clear separation of responsibilities
* Reusable business logic
* Maintainable workflows
* Easy testing
* Consistent application behavior

---

# 2. Backend Architecture Flow

The complete backend flow:

```text id="x8f5v3"
Frontend Application

(Android / iOS / Web)

        ↓

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

---

# 3. Service Layer Responsibility

The service layer handles:

* Business rules
* Workflow execution
* Data validation beyond schema validation
* Transaction coordination
* Calling multiple repositories
* Preparing business responses

---

# 4. Service Layer Does NOT Handle

The service layer should not contain:

* API request handling
* HTTP status codes
* JSON formatting
* Database queries directly
* UI logic

---

# 5. Service Location

All services must exist under:

```text id="6r4q7m"
backend/app/services/
```

Example:

```text id="q1yyi9"
services/

├── student_service.py

├── booking_service.py

├── attendance_service.py

├── fee_service.py

└── registration_service.py
```

---

# 6. Service Naming Convention

Domain:

```text id="q0g4cd"
Student
```

Service:

```python id="5sjp6m"
StudentService
```

File:

```text id="n1i9t4"
student_service.py
```

---

# 7. Service Class Structure

Example:

```python id="u2u7m7"
class StudentService:


    def __init__(
        self,
        repository
    ):
        self.repository = repository
```

---

# 8. Service Method Naming

Methods should represent business actions.

Examples:

Correct:

```python id="20v6d5"
approve_registration()

mark_attendance()

book_trial_slot()

record_payment()
```

Incorrect:

```python id="d7pj2v"
insert_data()

update_record()

save()
```

---

# 9. Transaction Ownership

Transactions belong to the service layer.

Example:

Student approval workflow:

```text id="k57gqv"
Approve Registration

        ↓

Create Student

        ↓

Create Profile

        ↓

Update Registration Status

        ↓

Commit Transaction
```

---

# 10. Student Service

Responsibilities:

* Student creation
* Student profile retrieval
* Student dashboard preparation
* Student status management

Example methods:

```text id="kw8x3j"
create_student()

get_student_dashboard()

update_student_profile()

deactivate_student()
```

---

# 11. Registration Service

Responsibilities:

* Receive registrations
* Validate registration status
* Approve/reject registration
* Create student record after approval

Example:

```python id="l9knxj"
approve_registration(
    registration_id
)
```

Workflow:

```text id="0f7k3r"
Registration

        ↓

Admin Approval

        ↓

Student Creation

        ↓

Dashboard Access Enabled
```

---

# 12. Trial Booking Service

Responsibilities:

* Check slot availability
* Validate booking capacity
* Calculate payable amount
* Create booking

Example:

```python id="m7un90"
create_trial_booking()
```

Workflow:

```text id="74pf9m"
Select Date

      ↓

Check Configuration

      ↓

Check Existing Bookings

      ↓

Validate Capacity

      ↓

Create Booking

      ↓

Return Summary
```

---

# 13. Trial Slot Rules

Business rules:

Sunday morning:

```text id="q1e6ka"
6:00 - 6:30

6:40 - 7:10

7:20 - 7:50
```

Each slot:

```text id="q8m6xk"
Maximum Capacity = 2 People
```

Additional days must be controlled through configuration.

---

# 14. Fee Service

Responsibilities:

* Record payments
* Calculate pending fees
* Generate fee summaries

Example methods:

```text id="y1u6pk"
record_payment()

get_fee_status()

generate_receipt()
```

---

# 15. Attendance Service

Responsibilities:

* Coach attendance marking
* Attendance summary calculation
* Dashboard updates

Example:

```python id="y5jj3r"
mark_attendance()
```

Workflow:

```text id="9y3jbb"
Coach

 ↓

Marks Present/Absent

 ↓

Save Attendance

 ↓

Student Dashboard Updated
```

---

# 16. Progress Service

Responsibilities:

* Maintain student riding progress
* Record assessments
* Prepare progress reports

Example:

```text id="j5z8pq"
add_progress_entry()

get_progress_history()
```

---

# 17. Horse Service

Responsibilities:

* Horse information
* Training details
* Availability information

Example:

```text id="3k0w4f"
create_horse()

update_horse_details()

get_available_horses()
```

---

# 18. Facility Service

Responsibilities:

* Manage club facilities
* Provide public facility information

Example:

```text id="i3b4un"
get_facilities()

update_facility()
```

---

# 19. Configuration Service

Responsibilities:

* Read configurable values
* Update system configuration

Examples:

```text id="1z8r7d"
Trial fee

Slot capacity

Club timings

Contact details
```

---

# 20. Service Exception Handling

Services raise business exceptions.

Example:

```python id="s8d1xw"
if slots_available < requested_slots:

    raise SlotUnavailableException()
```

---

# 21. Service Dependency Rules

Services can call:

Allowed:

```text id="p9r6du"
Repository

Configuration Service

Other Domain Services
```

Not allowed:

```text id="1f7u7y"
FastAPI Router

Database Session Directly
```

---

# 22. Service Response Rules

Services return:

Allowed:

```text id="b4b0t7"
Domain Objects

DTO Objects

Processed Data
```

Not allowed:

```text id="b0d9cb"
HTTP Response

JSONResponse
```

---

# 23. Testing Requirements

Each service must test:

* Successful workflows
* Business rule failures
* Repository failures
* Transaction rollback
* Edge cases

---

# 24. Service Generation Order

Recommended order:

```text id="f0n4bw"
Configuration Service

        ↓

Registration Service

        ↓

Student Service

        ↓

Trial Booking Service

        ↓

Attendance Service

        ↓

Fee Service

        ↓

Progress Service

        ↓

Other Services
```

---

# 25. Final Service Layer Rule

The service layer is the brain of the application.

All business decisions must exist here.

The architecture must remain:

```text id="7nq1pv"
API

 ↓

Service

 ↓

Repository

 ↓

Database
```

---

# Conclusion

This specification ensures that the Horse Riding Club Management System maintains clean business logic separation and remains easy to extend with future features such as competitions, horse leasing, advanced training programs, and memberships.
