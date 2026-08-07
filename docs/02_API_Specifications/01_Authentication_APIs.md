# Horse Riding Club System

# Authentication APIs Specification

Version: 1.0

---

# 1. Purpose

This document defines the authentication API contract for the Horse Riding Club System.

The authentication mechanism is based on **mobile number identification**.

The system does not use traditional role-based user registration.

The system identifies the user type based on configured mobile numbers.

---

# 2. Authentication Concept

The application supports three types of users:

```text
Mobile Number Entered

        ↓

System Identification

        ↓

User Type Determination

        ↓

Dashboard Access
```

User categories:

```text
1. Administrator

2. Coach

3. Registered Student/User
```

---

# 3. User Identification Rules

## Administrator

Admin mobile numbers are maintained in configuration.

Example:

```text
ADMIN_PHONE_NUMBER_1

ADMIN_PHONE_NUMBER_2
```

If the entered mobile number matches an administrator number:

```text
User Type = ADMIN
```

---

## Coach

Coach mobile numbers are maintained in configuration.

Example:

```text
COACH_PHONE_NUMBER_1

COACH_PHONE_NUMBER_2
```

If the entered mobile number matches a coach number:

```text
User Type = COACH
```

---

## Student/User

All other valid mobile numbers are checked against registered students.

If found:

```text
User Type = STUDENT
```

---

# 4. Authentication Flow

```text
User Opens Application

        ↓

Enter Mobile Number

        ↓

Submit Login Request

        ↓

Backend Validates Number

        ↓

Identify User Type

        ↓

Create Session

        ↓

Redirect To Dashboard
```

---

# 5. Login API

## Endpoint

```text
POST

/api/v1/auth/login
```

---

# 6. Request Payload

```json
{
    "mobile_number": "9876543210"
}
```

---

# 7. Request Parameters

| Field         | Type   | Required | Description        |
| ------------- | ------ | -------- | ------------------ |
| mobile_number | String | Yes      | User mobile number |

---

# 8. Validation Rules

Mobile number validation:

* Must contain valid digits
* Must match configured country format
* Cannot be empty

Example:

```text
Invalid:

abc123


Valid:

9876543210
```

---

# 9. Successful Login Response

Example:

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user_type": "STUDENT",
        "mobile_number": "9876543210",
        "user_id": "uuid-value",
        "name": "Student Name"
    }
}
```

---

# 10. User Type Response Values

Allowed values:

```text
ADMIN

COACH

STUDENT
```

---

# 11. Administrator Login Response

Example:

```json
{
    "success": true,
    "data": {
        "user_type": "ADMIN",
        "dashboard": "/admin"
    }
}
```

Admin access:

```text
Admin Dashboard
```

---

# 12. Coach Login Response

Example:

```json
{
    "success": true,
    "data": {
        "user_type": "COACH",
        "dashboard": "/coach"
    }
}
```

Coach access:

```text
Coach Dashboard
```

---

# 13. Student Login Response

Example:

```json
{
    "success": true,
    "data": {
        "user_type": "STUDENT",
        "dashboard": "/student"
    }
}
```

Student access:

```text
Student Dashboard
```

---

# 14. Unregistered User Response

If the mobile number does not belong to:

* Admin
* Coach
* Student

Response:

```json
{
    "success": false,
    "message": "Mobile number not registered",
    "action": "REGISTER"
}
```

User options:

```text
Register

or

Book Trial Ride
```

---

# 15. Registration Relationship

A user can register through:

```text
Registration Page

        ↓

Admin Approval

        ↓

Student Account Created

        ↓

Login Enabled
```

---

# 16. Session Management

After successful login:

Backend creates a session.

Session contains:

```text
user_id

mobile_number

user_type

created_time

expiry_time
```

---

# 17. Logout API

## Endpoint

```text
POST

/api/v1/auth/logout
```

---

# 18. Logout Response

```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

---

# 19. Current User API

## Endpoint

```text
GET

/api/v1/auth/me
```

Purpose:

Returns currently logged-in user information.

---

# 20. Response

Example:

```json
{
    "success": true,
    "data": {
        "mobile_number": "9876543210",
        "user_type": "STUDENT",
        "name": "Student Name"
    }
}
```

---

# 21. Security Rules

The backend must:

* Never expose configured admin numbers
* Never expose coach numbers
* Validate sessions on protected APIs
* Prevent unauthorized dashboard access

---

# 22. Protected API Access

Authentication required:

```text
Student Dashboard

Coach Dashboard

Admin Dashboard

Attendance APIs
```

---

# 23. Public APIs

Authentication not required:

```text
Landing Page

Facilities

Horses

Team

Testimonials

Contact

Trial Booking
```

---

# 24. Future Enhancement

The design should allow adding:

* OTP verification
* WhatsApp verification
* Email login
* Multi-device sessions

without changing existing APIs.

---

# Conclusion

This authentication design keeps the system simple for users while allowing controlled access for administrators, coaches, and registered students.
