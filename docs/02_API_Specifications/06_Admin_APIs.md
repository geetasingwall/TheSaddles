# Horse Riding Club System

# Admin APIs Specification

Version: 1.0

---

# 1. Purpose

This document defines the API contract for the Administrator module.

The Admin APIs provide complete management capabilities for the Horse Riding Club System.

Administrators are responsible for:

* Managing registrations
* Managing students
* Managing coaches
* Managing horses
* Managing facilities
* Managing configurations
* Monitoring club operations

---

# 2. Administrator Identification

Administrators are identified using configured mobile numbers.

Flow:

```text
Admin Enters Mobile Number

        ↓

Backend Validates Number

        ↓

Number Matches Admin Configuration

        ↓

Admin Dashboard Access Granted
```

---

# 3. Admin Dashboard API

## Endpoint

```text
GET

/api/v1/admin/dashboard
```

---

# 4. Dashboard Response

Example:

```json
{
    "success": true,
    "data": {
        "total_students": 150,
        "active_students": 120,
        "pending_registrations": 8,
        "today_bookings": 12,
        "total_horses": 6,
        "active_coaches": 4
    }
}
```

---

# 5. Registration Management APIs

## View Pending Registrations

### Endpoint

```text
GET

/api/v1/admin/registrations
```

---

## Response

```json
{
    "success": true,
    "data": [
        {
            "registration_id": "uuid",
            "name": "Rahul Sharma",
            "mobile_number": "9876543210",
            "place": "Noida",
            "status": "Pending"
        }
    ]
}
```

---

## Approve Registration

### Endpoint

```text
PATCH

/api/v1/admin/registrations/{registration_id}/approve
```

---

## Approval Process

```text
Registration

        ↓

Approve

        ↓

Create Student Record

        ↓

Enable Login
```

---

## Reject Registration

### Endpoint

```text
PATCH

/api/v1/admin/registrations/{registration_id}/reject
```

---

# 6. Student Management APIs

## Get All Students

### Endpoint

```text
GET

/api/v1/admin/students
```

---

## Response

```json
{
    "success": true,
    "data": [
        {
            "student_id": "uuid",
            "name": "Rahul Sharma",
            "mobile_number": "9876543210",
            "status": "Active"
        }
    ]
}
```

---

## Get Student Details

### Endpoint

```text
GET

/api/v1/admin/students/{student_id}
```

---

## Update Student Status

### Endpoint

```text
PATCH

/api/v1/admin/students/{student_id}/status
```

---

# 7. Student Status Values

Allowed values:

```text
Active

Inactive

Suspended

Completed
```

---

# 8. Coach Management APIs

## Create Coach

### Endpoint

```text
POST

/api/v1/admin/coaches
```

---

## Request

```json
{
    "name": "Coach Name",
    "mobile_number": "9876543210"
}
```

---

## Get Coaches

### Endpoint

```text
GET

/api/v1/admin/coaches
```

---

## Update Coach

### Endpoint

```text
PATCH

/api/v1/admin/coaches/{coach_id}
```

---

# 9. Horse Management APIs

Administrators manage:

* Horse information
* Availability
* Status
* Training suitability

---

## Get Horses

### Endpoint

```text
GET

/api/v1/admin/horses
```

---

## Add Horse

### Endpoint

```text
POST

/api/v1/admin/horses
```

---

## Horse Information

```text
Name

Age

Breed

Gender

Status

Remarks
```

---

# 10. Facility Management APIs

Facilities include:

* Riding arena
* Stables
* Training areas
* Other club facilities

---

## Get Facilities

### Endpoint

```text
GET

/api/v1/admin/facilities
```

---

## Create Facility

### Endpoint

```text
POST

/api/v1/admin/facilities
```

---

# 11. Trial Booking Management

Admin can monitor all trial bookings.

## Endpoint

```text
GET

/api/v1/admin/trial-bookings
```

---

## Response Includes:

```text
Booking ID

Customer Name

Mobile Number

Date

Time Slot

Number of People

Amount

Status
```

---

# 12. Attendance Monitoring API

## Endpoint

```text
GET

/api/v1/admin/attendance
```

---

# 13. Configuration Management APIs

Configuration controls dynamic values.

Examples:

```text
Trial Fee

Slot Capacity

Booking Slots

Club Contact Details

Application Settings
```

---

## Get Configuration

### Endpoint

```text
GET

/api/v1/admin/configuration
```

---

## Update Configuration

### Endpoint

```text
PATCH

/api/v1/admin/configuration/{key}
```

---

# 14. Admin Permissions

Administrator can:

```text
Manage Students

Manage Coaches

Manage Horses

Manage Facilities

Approve Registrations

View Reports

Update Configuration
```

---

# 15. Security Rules

Admin APIs must:

* Validate administrator identity
* Prevent unauthorized access
* Log important changes
* Maintain audit history

---

# 16. Audit Requirements

The following actions should be logged:

```text
Registration Approval

Registration Rejection

Student Status Changes

Configuration Updates

Coach Creation

Horse Updates
```

---

# 17. Future Enhancements

The design supports:

* Multiple administrators
* Reports dashboard
* Revenue analytics
* Automated notifications
* Payment management

---

# Conclusion

Admin APIs provide centralized control over all operational aspects of the Horse Riding Club System while maintaining security and traceability.
