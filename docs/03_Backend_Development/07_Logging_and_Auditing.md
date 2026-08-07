# Horse Riding Club Management System

# Logging and Auditing Specification

Version: 1.0

---

# 1. Purpose

This document defines the logging and auditing standards for the backend application.

The objective is to ensure:

* Application issues can be diagnosed quickly.
* Important business actions are traceable.
* Administrative activities are recorded.
* Sensitive information remains protected.

---

# 2. Logging Objectives

The backend logging system must support:

* Debugging
* Error investigation
* Performance monitoring
* Security monitoring
* Operational support

---

# 3. Logging Architecture

Logging flow:

```id="4n9j5v"
Application Component

        ↓

Logging Utility

        ↓

Log Handler

        ↓

Log Storage
```

---

# 4. Log Levels

The system uses standard logging levels.

---

# DEBUG

Used for development troubleshooting.

Examples:

* SQL query flow
* Function execution details
* Internal processing steps

Not enabled in production by default.

---

# INFO

Used for normal application events.

Examples:

* Application started
* Booking created
* Student approved

---

# WARNING

Used for unexpected but recoverable situations.

Examples:

* Failed login attempt
* Invalid user input
* Configuration fallback

---

# ERROR

Used for failures.

Examples:

* Database failure
* API failure
* Transaction rollback

---

# CRITICAL

Used for system-level failures.

Examples:

* Database unavailable
* Application cannot start

---

# 5. Logging Format

All logs should follow a consistent format.

Example:

```text id="h5f3s8"
Timestamp

Level

Module

Function

Message

Request ID
```

Example:

```text id="d8g0zx"
2026-07-20 10:15:20

INFO

TrialBookingService

create_booking()

Trial booking created

Request: ABC123
```

---

# 6. Request Logging

Every API request should capture:

* Request ID
* Endpoint
* HTTP Method
* Timestamp
* Response Status
* Execution Time

Example:

```text id="v8f7l3"
GET /api/v1/student/dashboard

Status: 200

Time: 120ms
```

---

# 7. Sensitive Data Protection

The following information must never be logged:

* Mobile numbers
* Payment information
* Personal documents
* Medical information
* Uploaded files

---

# 8. Allowed Identifiers

Allowed:

* Internal UUID
* Request ID
* Entity ID
* Error Code

Example:

Allowed:

```text id="47j7jz"
Student ID:
550e8400-e29b-41d4-a716
```

Not allowed:

```text id="7x0p8w"
Mobile:
9876543210
```

---

# 9. Application Events To Log

The following events must be logged.

---

# User Identification

Events:

* Login attempt
* Successful identification
* Failed identification

Example:

```text id="6h9q4n"
User identified

Type:
STUDENT
```

---

# Trial Booking

Events:

* Slot viewed
* Booking created
* Booking cancelled
* Booking attended

---

# Registration

Events:

* Registration submitted
* Registration approved
* Registration rejected

---

# Student Management

Events:

* Student created
* Student updated
* Student deactivated

---

# Attendance

Events:

* Attendance marked
* Attendance modified

---

# Fees

Events:

* Payment recorded
* Payment updated
* Receipt generated

---

# Progress

Events:

* Assessment created
* Assessment updated

---

# 10. Audit Logging

Audit logging records important data changes.

The purpose is:

"Who changed what and when?"

---

# 11. Audit Fields

Operational tables contain:

```sql id="r4nxw8"
created_at

updated_at

created_by

updated_by
```

---

# 12. Audit Information

Example:

A fee payment is entered:

```text id="f3c1kw"
Created By:

ADMIN

Created At:

2026-07-20 10:30
```

---

# 13. Auditable Entities

The following entities require audit tracking:

* Students
* Registrations
* Trial Bookings
* Fees
* Attendance
* Student Progress
* Horses
* Coaches
* Facilities
* Testimonials

---

# 14. Audit History Table

For Version 1.0:

A separate audit history table is not required.

Reason:

The system already maintains:

* created_at
* updated_at
* created_by
* updated_by

This keeps the system simple.

---

# 15. Future Audit Expansion

If required later:

```text id="7yxk7q"
audit_logs

    id

    entity_name

    entity_id

    action

    old_value

    new_value

    changed_by

    changed_at
```

can be introduced.

---

# 16. Error Logging

All errors must capture:

* Error code
* Exception type
* Module
* Stack trace
* Request ID

Example:

```text id="1fg9g5"
ERROR

TrialBookingService

SLOT_FULL

Request ID:
ABC123
```

---

# 17. Performance Logging

The system should monitor:

* API response time
* Slow database queries
* Failed requests

Recommended threshold:

```id="0bh3w4"
API > 2 seconds
```

should generate a warning.

---

# 18. Database Logging

Database logs should track:

* Connection failures
* Transaction failures
* Migration failures

Do not log:

* Complete SQL statements containing personal information

---

# 19. Production Log Storage

Recommended structure:

```id="uk7l22"
logs/

├── application.log

├── error.log

├── access.log
```

---

# 20. Log Rotation

Production logs must support:

* Daily rotation
* Maximum file size limit
* Old log cleanup

---

# 21. Monitoring Future Expansion

The architecture should allow integration with:

* Cloud monitoring tools
* Error tracking platforms
* Performance monitoring systems

Examples:

* Application Performance Monitoring
* Centralized Log Management

---

# 22. Logging Implementation Rules

Developers must:

* Use centralized logging utility.
* Avoid print statements.
* Use appropriate log levels.
* Include meaningful messages.
* Avoid logging sensitive information.

---

# 23. Final Logging Flow

```text id="f2u4xk"
FastAPI Request

        ↓

Request Logger

        ↓

Service Processing

        ↓

Repository Operation

        ↓

Audit Update

        ↓

Response Logger
```

---

# Conclusion

The logging and auditing design provides sufficient visibility for operating the Horse Riding Club Management System while maintaining simplicity.

The Version 1.0 approach avoids unnecessary complexity while leaving room for advanced auditing and monitoring in future versions.
