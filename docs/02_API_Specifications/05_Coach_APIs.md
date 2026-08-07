# Horse Riding Club System

# Coach APIs Specification

Version: 1.0

---

# 1. Purpose

This document defines the API contract for coaches of the Horse Riding Club System.

The Coach APIs allow coaches to manage daily riding activities including:

* Viewing assigned students
* Marking attendance
* Updating student riding progress
* Recording training observations

Coaches are identified through configured mobile numbers.

---

# 2. Coach Identification

Coach access is based on configured mobile numbers.

Flow:

```text
Coach Enters Mobile Number

        ↓

Backend Validates Number

        ↓

Number Matches Coach Configuration

        ↓

Coach Dashboard Access Granted
```

---

# 3. Coach Dashboard Flow

```text
Coach Login

        ↓

Load Assigned Students

        ↓

Select Batch / Student

        ↓

Perform Training Activities
```

---

# 4. Coach Dashboard API

## Endpoint

```text
GET

/api/v1/coach/dashboard
```

---

# 5. Dashboard Response

Example:

```json
{
    "success": true,
    "data": {
        "coach_name": "Coach Name",
        "assigned_students": 25,
        "today_classes": 3
    }
}
```

---

# 6. Get Assigned Students API

## Endpoint

```text
GET

/api/v1/coach/students
```

---

# 7. Response

Example:

```json
{
    "success": true,
    "data": [
        {
            "student_id": "uuid",
            "name": "Rahul Sharma",
            "mobile_number": "9876543210",
            "batch": "Morning Batch",
            "level": "Beginner"
        }
    ]
}
```

---

# 8. Attendance Management

Coaches are responsible for marking student attendance.

Attendance flow:

```text
Coach Selects Batch

        ↓

Select Date

        ↓

Mark Present / Absent

        ↓

Save Attendance

        ↓

Student Dashboard Updated
```

---

# 9. Mark Attendance API

## Endpoint

```text
POST

/api/v1/coach/attendance
```

---

# 10. Request Payload

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

# 11. Attendance Status Values

Allowed values:

```text
Present

Absent
```

Future support:

```text
Late

Excused
```

---

# 12. Attendance Response

Example:

```json
{
    "success": true,
    "message": "Attendance saved successfully"
}
```

---

# 13. View Previous Attendance API

## Endpoint

```text
GET

/api/v1/coach/attendance
```

---

# 14. Query Parameters

| Parameter | Required | Description     |
| --------- | -------- | --------------- |
| date      | No       | Attendance date |
| batch_id  | No       | Specific batch  |

---

# 15. Update Student Progress API

Coaches can update riding progress.

## Endpoint

```text
POST

/api/v1/coach/progress
```

---

# 16. Request Payload

Example:

```json
{
    "student_id": "uuid",
    "skill_name": "Canter",
    "level": "Intermediate",
    "remarks": "Improving balance"
}
```

---

# 17. Progress Information

Examples:

```text
Basic Riding

Horse Handling

Mounting

Balance

Walk

Trot

Canter

Jumping

Dressage
```

---

# 18. Progress Response

Example:

```json
{
    "success": true,
    "message": "Progress updated successfully"
}
```

---

# 19. Student Training History API

## Endpoint

```text
GET

/api/v1/coach/students/{student_id}/progress
```

---

# 20. Response

Example:

```json
{
    "success": true,
    "data": [
        {
            "date": "2026-07-20",
            "skill": "Trot",
            "remarks": "Good improvement"
        }
    ]
}
```

---

# 21. Coach Restrictions

Coach can:

```text
View assigned students

Mark attendance

Update progress

View training history
```

Coach cannot:

```text
Approve registrations

Modify fees

Manage administrators

Change system configuration
```

---

# 22. Relationship With Student Dashboard

Coach actions update:

```text
Attendance

        ↓

Student Dashboard


Progress

        ↓

Student Dashboard
```

---

# 23. Validation Rules

Backend must validate:

* Coach is authorized
* Student exists
* Attendance date is valid
* Progress belongs to selected student
* Duplicate attendance is prevented

---

# 24. Future Enhancements

The API design should support:

* Multiple coaches per batch
* Training plans
* Lesson scheduling
* Performance reports
* Competition preparation tracking

---

# Conclusion

The Coach APIs provide controlled access for instructors while keeping student data secure and ensuring that daily riding activities are properly recorded.
