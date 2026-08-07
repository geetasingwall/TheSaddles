# Horse Riding Club System

# Student APIs Specification

Version: 1.0

---

# 1. Purpose

This document defines the API contract for registered students of the Horse Riding Club System.

The Student APIs provide access to:

* Student profile
* Attendance records
* Fee information
* Riding progress
* Upcoming events and activities

A student can access these APIs only after:

```text
Registration

        ↓

Admin Approval

        ↓

Student Account Creation
```

---

# 2. Student Identification

Students are identified using:

```text
Mobile Number
```

The mobile number is the primary login identifier.

The system maintains an internal unique identifier for database relationships.

---

# 3. Student Dashboard Flow

```text
Student Opens Application

        ↓

Enter Mobile Number

        ↓

System Identifies Student

        ↓

Student Dashboard Loaded

        ↓

Display Personal Information
```

---

# 4. Get Student Dashboard API

## Endpoint

```text
GET

/api/v1/students/dashboard
```

---

# 5. Response

Example:

```json
{
    "success": true,
    "data": {
        "student": {
            "name": "Rahul Sharma",
            "mobile_number": "9876543210",
            "status": "Active"
        },
        "attendance": {
            "total_classes": 20,
            "present": 18,
            "absent": 2
        },
        "fees": {
            "total_fee": 20000,
            "paid": 15000,
            "pending": 5000
        },
        "progress": {
            "current_level": "Beginner"
        }
    }
}
```

---

# 6. Student Profile API

## Endpoint

```text
GET

/api/v1/students/profile
```

---

# 7. Profile Response

Example:

```json
{
    "success": true,
    "data": {
        "student_id": "uuid",
        "name": "Rahul Sharma",
        "mobile_number": "9876543210",
        "place": "Noida",
        "joining_date": "2026-01-01",
        "status": "Active"
    }
}
```

---

# 8. Update Student Profile API

## Endpoint

```text
PATCH

/api/v1/students/profile
```

---

# 9. Updatable Information

Student can update:

```text
Address

Emergency Contact

Profile Information
```

Sensitive information changes may require admin approval.

---

# 10. Attendance API

## Endpoint

```text
GET

/api/v1/students/attendance
```

---

# 11. Attendance Response

Example:

```json
{
    "success": true,
    "data": {
        "summary": {
            "total_classes": 30,
            "present": 27,
            "absent": 3
        },
        "records": [
            {
                "date": "2026-07-01",
                "status": "Present"
            }
        ]
    }
}
```

---

# 12. Fee Information API

## Endpoint

```text
GET

/api/v1/students/fees
```

---

# 13. Fee Response

Example:

```json
{
    "success": true,
    "data": {
        "total_fee": 24000,
        "paid_amount": 12000,
        "pending_amount": 12000,
        "payment_history": []
    }
}
```

---

# 14. Progress API

## Endpoint

```text
GET

/api/v1/students/progress
```

---

# 15. Progress Response

Example:

```json
{
    "success": true,
    "data": {
        "current_level": "Intermediate",
        "skills": [
            {
                "name": "Basic Riding",
                "status": "Completed"
            },
            {
                "name": "Canter",
                "status": "In Progress"
            }
        ]
    }
}
```

---

# 16. Events API

The system should allow students to view future events.

Examples:

* Horse shows
* Competitions
* Training camps

---

## Endpoint

```text
GET

/api/v1/students/events
```

---

# 17. Events Response

Example:

```json
{
    "success": true,
    "data": [
        {
            "event_name": "Local Show Jumping Event",
            "date": "2026-10-15",
            "location": "Delhi"
        }
    ]
}
```

---

# 18. Student Status

Allowed values:

```text
Active

Inactive

Suspended

Completed
```

---

# 19. Access Rules

Student can access:

```text
Own Profile

Own Attendance

Own Fees

Own Progress

Own Events
```

Student cannot access:

```text
Other Students Data

Admin Functions

Coach Functions
```

---

# 20. Dashboard Data Relationship

The dashboard combines information from:

```text
students

        +

attendance

        +

fees

        +

student_progress

        +

events
```

---

# 21. Future Enhancements

The API design should support:

* Online fee payment
* Certificates
* Achievement history
* Competition participation
* Riding level badges

---

# Conclusion

The Student APIs provide a simple dashboard experience where enrolled riders can monitor their complete riding journey with the club.
