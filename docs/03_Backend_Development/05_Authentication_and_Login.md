# Horse Riding Club Management System

# Authentication and Login Specification

Version: 1.0

---

# 1. Purpose

This document defines the authentication and user identification mechanism for the Horse Riding Club Management System.

The system intentionally avoids:

* Username/password authentication
* Email/password login
* Complex role management

The system uses a simple mobile-number based identification approach.

The objective is to provide a frictionless experience for:

* Students
* Coaches
* Administrators

---

# 2. Authentication Philosophy

The target users include:

* Horse riding students
* Parents
* Coaches
* Club administrators

The application should be simple enough that users do not need to remember:

* Usernames
* Passwords
* Account IDs

The primary identification method is:

```
Mobile Number
```

---

# 3. User Identification Flow

The login process:

```
User Opens Application

        ↓

Enter Mobile Number

        ↓

Backend Searches Number

        ↓

Identify User Type

        ↓

Open Appropriate Dashboard
```

---

# 4. User Type Resolution

The backend identifies the user in the following order:

```
Mobile Number

      ↓

Administrators Table

      ↓

Coaches Table

      ↓

Students Table

      ↓

Unknown User
```

---

# 5. Administrator Identification

Administrators are identified using the mobile number stored in:

```
administrators.mobile_number
```

If a match is found:

Response:

```json
{
    "success": true,
    "user_type": "ADMIN",
    "dashboard": "ADMIN_DASHBOARD"
}
```

The user is redirected to the Administrator Dashboard.

---

# 6. Coach Identification

Coaches are identified using:

```
coaches.mobile_number
```

If a match is found:

Response:

```json
{
    "success": true,
    "user_type": "COACH",
    "dashboard": "COACH_DASHBOARD"
}
```

The user is redirected to the Coach Dashboard.

---

# 7. Student Identification

Students are identified using:

```
students
        |
        |
registrations
        |
        |
mobile_number
```

Only approved students can access the student dashboard.

The flow:

```
Mobile Number

        ↓

Find Registration

        ↓

Check Approval Status

        ↓

Find Student Record

        ↓

Open Dashboard
```

Response:

```json
{
    "success": true,
    "user_type": "STUDENT",
    "dashboard": "STUDENT_DASHBOARD"
}
```

---

# 8. Unknown User Flow

If the mobile number does not exist:

Response:

```json
{
    "success": false,
    "user_type": "UNKNOWN",
    "message": "Mobile number not registered."
}
```

The application should provide options:

* Register with the club
* Book a trial ride
* Contact the club

---

# 9. Fixed Number Configuration

Administrator and coach numbers remain fixed within their respective database tables.

No dynamic role assignment is required.

Example:

```
Administrator

9999999999


Coach

8888888888
```

The application does not allow users to select their own user type.

---

# 10. Session Management

After successful identification, the backend creates a user session.

The session contains:

```
User ID

User Type

Session Token

Created Time

Expiry Time
```

---

# 11. Token Handling

The backend should use token-based sessions.

Recommended:

```
JWT Token
```

The token should contain:

```json
{
    "user_id":"UUID",
    "user_type":"STUDENT",
    "expiry":"timestamp"
}
```

---

# 12. Token Security Rules

Tokens must:

* Have expiry time
* Be validated on every protected API
* Never contain sensitive information
* Never contain passwords

---

# 13. Dashboard Access Rules

## Public User

Can access:

* Landing page
* Facilities
* Horses
* Team
* Testimonials
* Locations
* Trial Booking
* Registration

---

## Student

Can access:

* Attendance
* Fee History
* Progress
* Events
* Profile

---

## Coach

Can access:

* Assigned students
* Attendance marking
* Progress updates

---

## Administrator

Can access:

* Trial bookings
* Registrations
* Student approvals
* Fees
* Reports
* Configuration

---

# 14. No Role Table

The system will not maintain:

```
roles

permissions

user_roles
```

The user's access type is determined from:

```
Mobile Number
        +
Existing Database Record
```

---

# 15. Mobile Number Validation

All mobile numbers must be validated before lookup.

Validation rules:

* Country code handling should be configurable.
* Only valid numeric formats should be accepted.
* Duplicate active users should not share the same mobile number.

---

# 16. Login API

Endpoint:

```
POST /api/v1/user/login
```

Request:

```json
{
    "mobile_number":"9876543210"
}
```

Response:

```json
{
    "success":true,
    "data":
    {
        "user_id":"UUID",
        "user_type":"STUDENT",
        "dashboard":"STUDENT_DASHBOARD",
        "token":"JWT_TOKEN"
    }
}
```

---

# 17. Logout API

Endpoint:

```
POST /api/v1/user/logout
```

Purpose:

* Invalidate session
* Remove active token

---

# 18. Password Recovery

Not applicable.

The system does not use passwords.

---

# 19. Future Enhancement Possibilities

The architecture should allow adding:

* OTP verification
* WhatsApp verification
* Biometric login
* Device-based authentication

without changing the core database design.

---

# 20. Security Considerations

Although the login mechanism is simple, the backend must ensure:

* Protected APIs require valid tokens.
* Users cannot access another user's data.
* Students cannot access admin functions.
* Coaches cannot modify unauthorized records.

---

# Conclusion

The Horse Riding Club Management System uses a simple mobile-number based identification system instead of traditional authentication.

This approach provides:

* Easy access for non-technical users.
* Minimal user friction.
* Clear dashboard routing.
* Future compatibility with OTP and advanced authentication methods.

All backend authentication-related implementations must follow this specification.
