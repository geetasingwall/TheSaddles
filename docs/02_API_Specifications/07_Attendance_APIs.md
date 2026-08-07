# Horse Riding Club System

# Attendance APIs Specification

Version: 1.0

---

# 1. Purpose

This document defines the API contract for attendance management in the Horse Riding Club System.

The Attendance module enables:

* Coaches to mark student attendance
* Administrators to monitor attendance
* Students to view their attendance history

---

# 2. Attendance Flow

```text
Scheduled Riding Class

        ↓

Coach Opens Attendance

        ↓

Select Batch / Date

        ↓

Mark Student Attendance

        ↓

Save Attendance

        ↓

Student Dashboard Updated
```

---

# 3. Attendance Data Concept

Attendance is maintained against:

```text
Student

+

Batch

+

Training Date
```

Each student can have only one attendance record per class date.

---

# 4. Attendance Status

Allowed values:

```text
Present

Absent
```

Future supported values:

```text
Late

Excused

Cancelled
```

---

# 5. Mark Attendance API

## Endpoint

```text
POST

/api/v1/attendance
```

---

# 6. Request Payload

Example:

```json
{
    "date": "2026-07-20",
    "batch_id": "uuid",
    "attendance": [
        {
            "student_id": "uuid",
            "status": "Present"
        },
        {
            "student_id": "uuid",
            "status": "Absent"
        }
    ]
}
```

---

# 7. Request Fields

| Field      | Type  | Required | Description             |
| ---------- | ----- | -------- | ----------------------- |
| date       | Date  | Yes      | Attendance date         |
| batch_id   | UUID  | Yes      | Training batch          |
| attendance | Array | Yes      | Student attendance list |

---

# 8. Attendance Validation Rules

Backend must validate:

* Batch exists
* Student belongs to batch
* Date is valid
* Duplicate attendance is prevented
* Coach is authorized for the batch

---

# 9. Successful Attendance Response

Example:

```json
{
    "success": true,
    "message": "Attendance saved successfully",
    "data": {
        "date": "2026-07-20",
        "total_students": 10,
        "present": 8,
        "absent": 2
    }
}
```

---

# 10. Get Batch Attendance API

## Endpoint

```text
GET

/api/v1/attendance/batch/{batch_id}
```

---

# 11. Query Parameters

Optional:

```text
date
```

Example:

```text
/api/v1/attendance/batch/{batch_id}?date=2026-07-20
```

---

# 12. Response

Example:

```json
{
    "success": true,
    "data": {
        "batch": "Morning Batch",
        "date": "2026-07-20",
        "students": [
            {
                "student_id": "uuid",
                "name": "Rahul Sharma",
                "status": "Present"
            }
        ]
    }
}
```

---

# 13. Update Attendance API

## Endpoint

```text
PATCH

/api/v1/attendance/{attendance_id}
```

---

# 14. Update Request

Example:

```json
{
    "status": "Present"
}
```

---

# 15. Student Attendance History API

Students can view their own attendance.

## Endpoint

```text
GET

/api/v1/students/attendance
```

---

# 16. Student Attendance Response

Example:

```json
{
    "success": true,
    "data": {
        "summary": {
            "total_classes": 50,
            "present": 45,
            "absent": 5,
            "percentage": 90
        },
        "records": [
            {
                "date": "2026-07-20",
                "status": "Present"
            }
        ]
    }
}
```

---

# 17. Attendance Percentage Calculation

Formula:

```text
Attendance Percentage

=

(Present Classes / Total Classes)

×

100
```

Example:

```text
45 / 50 × 100

=

90%
```

---

# 18. Admin Attendance Report API

Administrators can view attendance reports.

## Endpoint

```text
GET

/api/v1/admin/attendance/report
```

---

# 19. Report Filters

Supported filters:

```text
Date Range

Batch

Student

Status
```

---

# 20. Attendance Report Response

Example:

```json
{
    "success": true,
    "data": {
        "total_classes": 100,
        "average_attendance": 88,
        "students": []
    }
}
```

---

# 21. Attendance Access Control

## Coach

Allowed:

```text
Mark Attendance

Update Attendance

View Assigned Students
```

---

## Student

Allowed:

```text
View Own Attendance
```

---

## Admin

Allowed:

```text
View All Attendance

Generate Reports

Modify Records
```

---

# 22. Database Dependency

Attendance APIs use:

```text
attendance

students

batches

coaches
```

---

# 23. Audit Requirements

Attendance changes should record:

```text
Updated By

Updated Time

Previous Value

New Value
```

---

# 24. Future Enhancements

The API design supports:

* QR attendance
* Biometric attendance
* RFID cards
* Automatic attendance reminders
* Parent notifications

---

# Conclusion

The Attendance API provides a simple and reliable mechanism to track student participation while maintaining proper access control between coaches, students, and administrators.
