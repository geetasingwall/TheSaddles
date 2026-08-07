# Horse Riding Club System

# Registration APIs Specification

Version: 1.0

---

# 1. Purpose

This document defines the API contract for the user registration process.

The registration module allows new users to submit their details for joining the horse riding club.

Registration does not immediately create an active student account.

The workflow is:

```text
User Registration

        ↓

Admin Review

        ↓

Admin Approval

        ↓

Student Account Creation

        ↓

User Login Enabled
```

---

# 2. Registration Concept

The system separates:

```text
Registration
```

and

```text
Active Student Account
```

A user becomes an active student only after admin approval.

---

# 3. Registration Flow

```text
User Opens Registration Page

        ↓

Enter Personal Details

        ↓

Submit Registration

        ↓

Registration Status = Pending

        ↓

Admin Reviews

        ↓

Approve / Reject

        ↓

Student Account Created
```

---

# 4. Create Registration API

## Endpoint

```text
POST

/api/v1/registrations
```

---

# 5. Request Payload

Example:

```json
{
    "name": "Rahul Sharma",
    "mobile_number": "9876543210",
    "place": "Noida",
    "age": 18,
    "gender": "Male",
    "experience_level": "Beginner"
}
```

---

# 6. Mandatory Fields

| Field         | Required |
| ------------- | -------- |
| Name          | Yes      |
| Mobile Number | Yes      |
| Place         | Yes      |

---

# 7. Optional Fields

The system may collect:

```text
Age

Gender

Previous Riding Experience

Emergency Contact

Remarks
```

---

# 8. Mobile Number Validation

Rules:

* Mobile number must be valid.
* Same mobile number cannot have multiple active registrations.
* Mobile number cannot conflict with admin/coach numbers.

---

# 9. Successful Registration Response

Example:

```json
{
    "success": true,
    "message": "Registration submitted successfully",
    "data": {
        "registration_id": "uuid",
        "status": "Pending"
    }
}
```

---

# 10. Registration Status

Allowed values:

```text
Pending

Approved

Rejected

Cancelled
```

Initial status:

```text
Pending
```

---

# 11. Check Registration Status API

## Endpoint

```text
GET

/api/v1/registrations/status
```

---

# 12. Request Parameters

Example:

```text
mobile_number
```

Example:

```text
/api/v1/registrations/status?mobile_number=9876543210
```

---

# 13. Response

Example:

```json
{
    "success": true,
    "data": {
        "mobile_number": "9876543210",
        "status": "Pending"
    }
}
```

---

# 14. Admin Registration List API

Administrators can view submitted registrations.

## Endpoint

```text
GET

/api/v1/admin/registrations
```

---

# 15. Admin Registration Details

Response contains:

```text
Registration ID

Name

Mobile Number

Place

Age

Gender

Experience Level

Submission Date

Status
```

---

# 16. Approve Registration API

## Endpoint

```text
PATCH

/api/v1/admin/registrations/{registration_id}/approve
```

---

# 17. Approval Workflow

When admin approves:

```text
Registration Status

        ↓

Approved

        ↓

Create Student Record

        ↓

Enable Mobile Login
```

---

# 18. Approval Response

Example:

```json
{
    "success": true,
    "message": "Registration approved",
    "data": {
        "student_id": "uuid",
        "mobile_number": "9876543210"
    }
}
```

---

# 19. Reject Registration API

## Endpoint

```text
PATCH

/api/v1/admin/registrations/{registration_id}/reject
```

---

# 20. Reject Response

Example:

```json
{
    "success": true,
    "message": "Registration rejected"
}
```

---

# 21. Registration Validation Rules

Backend must validate:

* Duplicate mobile number
* Missing mandatory information
* Invalid place
* Invalid age values
* Existing student account

---

# 22. Relationship With Student Module

After approval:

```text
Registration Table

        ↓

Student Table
```

The student receives:

* Student ID
* Dashboard access
* Attendance tracking
* Fee tracking
* Progress tracking

---

# 23. Admin Access Rules

Only configured administrator mobile numbers can:

* View registrations
* Approve registrations
* Reject registrations

---

# 24. Future Enhancements

The design should support:

* Online membership forms
* Document uploads
* Medical information
* Digital agreements
* Payment collection during registration

---

# Conclusion

The Registration API provides a controlled onboarding process where users can easily request enrollment while administrators maintain control over student activation.
