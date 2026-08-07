# Horse Riding Club Management System

# API Standards Specification

Version: 1.0

---

# 1. Purpose

This document defines the API standards for the Horse Riding Club Management System.

The objective is to ensure all APIs are:

* Consistent
* Predictable
* Easy to consume
* Easy to maintain
* Suitable for React Native, iOS, Android, and Web clients

All backend APIs must follow these standards.

---

# 2. API Technology

The backend APIs will use:

* FastAPI
* REST Architecture
* JSON Communication
* HTTP Standards

Base URL:

```
/api/v1
```

Example:

```
GET /api/v1/students/profile
```

---

# 3. API Versioning

All APIs must include versioning.

Current version:

```
v1
```

Example:

```
/api/v1/trial-bookings
```

Future versions:

```
/api/v2/trial-bookings
```

Old versions should continue working until migration is complete.

---

# 4. HTTP Methods

## GET

Used for retrieving data.

Examples:

```
GET /api/v1/students/{mobile_number}
```

---

## POST

Used for creating new records.

Examples:

```
POST /api/v1/trial-bookings
```

---

## PUT

Used for complete updates.

Example:

```
PUT /api/v1/students/{id}
```

---

## PATCH

Used for partial updates.

Example:

```
PATCH /api/v1/registrations/{id}/approve
```

---

## DELETE

Used for removing records where applicable.

Example:

```
DELETE /api/v1/testimonials/{id}
```

---

# 5. Resource Naming

Resources must use plural names.

Correct:

```
/students
/coaches
/horses
/trial-bookings
```

Incorrect:

```
/student
/coach
/horse
```

---

# 6. URL Naming Convention

Use lowercase with hyphens.

Correct:

```
/trial-bookings
/student-progress
/fee-payments
```

Incorrect:

```
/trialBookings
/StudentProgress
```

---

# 7. Standard API Response Format

Every API response must follow this structure.

## Successful Response

Example:

```json
{
    "success": true,
    "message": "Student details retrieved successfully.",
    "data": {}
}
```

---

## Error Response

Example:

```json
{
    "success": false,
    "message": "Student not found.",
    "error_code": "STUDENT_NOT_FOUND"
}
```

---

# 8. HTTP Status Codes

The backend must use standard HTTP status codes.

## Success

| Code | Meaning            |
| ---- | ------------------ |
| 200  | Request successful |
| 201  | Resource created   |
| 204  | No content         |

---

## Client Errors

| Code | Meaning          |
| ---- | ---------------- |
| 400  | Bad request      |
| 401  | Unauthorized     |
| 403  | Forbidden        |
| 404  | Not found        |
| 409  | Conflict         |
| 422  | Validation error |

---

## Server Errors

| Code | Meaning               |
| ---- | --------------------- |
| 500  | Internal server error |
| 503  | Service unavailable   |

---

# 9. Pagination Standard

All list APIs must support pagination.

Example:

```
GET /api/v1/students?page=1&size=20
```

Response:

```json
{
    "success": true,
    "data": [],
    "pagination":
    {
        "page":1,
        "size":20,
        "total":150
    }
}
```

---

# 10. Filtering Standard

Filters should use query parameters.

Example:

```
GET /api/v1/attendance?date=2026-07-20
```

Example:

```
GET /api/v1/bookings?status=Booked
```

---

# 11. Sorting Standard

Sorting format:

```
sort_by=<field>&order=<asc|desc>
```

Example:

```
GET /api/v1/students?sort_by=name&order=asc
```

---

# 12. Mobile Number Based Identification

The system does not use username/password authentication.

The mobile number is the primary user lookup mechanism.

Example:

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
        "user_type":"STUDENT",
        "redirect":"student-dashboard"
    }
}
```

---

# 13. User Type Resolution

The backend checks the mobile number in this order:

```
Mobile Number

       |

       ▼

Administrators

       |

       ▼

Coaches

       |

       ▼

Approved Students

       |

       ▼

Unknown User
```

---

# 14. File Upload APIs

File upload APIs must use:

```
multipart/form-data
```

Example:

```
POST /api/v1/horses/{id}/image
```

Allowed file types:

```
jpg
jpeg
png
webp
```

Maximum size:

Configured through application settings.

---

# 15. Date and Time Format

All APIs must use ISO format.

Date:

```
YYYY-MM-DD
```

Example:

```
2026-07-20
```

Time:

```
HH:mm:ss
```

Example:

```
06:00:00
```

Date Time:

```
YYYY-MM-DDTHH:mm:ss
```

---

# 16. Validation Rules

Validation happens at two levels:

## API Level

Using Pydantic.

Examples:

* Required fields
* Data type
* Format

---

## Business Level

Using Service Layer.

Examples:

* Trial slot availability
* Student approval
* Fee validation

---

# 17. API Security Rules

Even without traditional authentication:

The backend must:

* Validate every request
* Validate mobile number ownership rules
* Restrict admin operations
* Restrict coach operations
* Prevent unauthorized data access

---

# 18. Admin APIs

Examples:

```
GET    /api/v1/admin/bookings

POST   /api/v1/admin/students/approve

GET    /api/v1/admin/reports
```

---

# 19. Coach APIs

Examples:

```
GET  /api/v1/coach/students

POST /api/v1/attendance

POST /api/v1/student-progress
```

---

# 20. Student APIs

Examples:

```
GET /api/v1/student/dashboard

GET /api/v1/student/attendance

GET /api/v1/student/payments

GET /api/v1/student/progress
```

---

# 21. Trial Booking APIs

Examples:

```
GET  /api/v1/trial-bookings/slots

POST /api/v1/trial-bookings

GET  /api/v1/trial-bookings/{id}
```

---

# 22. API Documentation

FastAPI automatically generates:

Swagger:

```
/docs
```

OpenAPI JSON:

```
/openapi.json
```

---

# 23. Logging Requirements

Every API request should log:

* Timestamp
* Endpoint
* HTTP method
* Response status
* Execution time

Never log:

* Phone numbers
* Personal information
* Uploaded documents

---

# 24. Final API Design Principle

All APIs should be:

* Simple
* Consistent
* Self-explanatory
* Mobile friendly
* Future compatible

The frontend applications (React Native Android, iOS, and Web) must consume the same APIs without platform-specific changes.

---

# Conclusion

This API standard becomes the contract between the FastAPI backend and all client applications.

All future API generation must follow this specification.
