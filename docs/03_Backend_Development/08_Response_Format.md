# Horse Riding Club Management System

# API Response Format Specification

Version: 1.0

---

# 1. Purpose

This document defines the standard API response formats used by the backend application.

The objective is to ensure:

* Consistent frontend integration
* Predictable API behavior
* Easy error handling
* Simplified mobile and web development

All APIs must follow these response standards.

---

# 2. Standard Response Structure

Every API response follows:

```json
{
    "success": true,
    "message": "",
    "data": {},
    "metadata": {}
}
```

---

# 3. Response Fields

## success

Type:

```text
Boolean
```

Purpose:

Indicates whether the request was successful.

Values:

```text
true
false
```

---

## message

Type:

```text
String
```

Purpose:

Human-readable response message.

Examples:

```text
Student details retrieved successfully.

Trial booking created successfully.
```

---

## data

Type:

```text
Object / Array
```

Purpose:

Contains the actual response information.

---

## metadata

Type:

```text
Object
```

Purpose:

Contains additional information.

Examples:

* Pagination
* Counts
* Status information

---

# 4. Successful Response Example

Example:

```json
{
    "success": true,
    "message": "Student dashboard loaded successfully.",
    "data":
    {
        "student_id":"UUID",
        "name":"John",
        "attendance_percentage":85,
        "fee_status":"Paid"
    },
    "metadata":{}
}
```

---

# 5. Error Response Structure

All errors follow:

```json
{
    "success": false,
    "message":"",
    "error_code":"",
    "data":null,
    "metadata":{}
}
```

---

# 6. Error Response Example

Example:

```json
{
    "success": false,
    "message":"Trial slot is unavailable.",
    "error_code":"SLOT_FULL",
    "data":null,
    "metadata":{}
}
```

---

# 7. Validation Error Response

Example:

```json
{
    "success":false,
    "message":"Validation failed.",
    "error_code":"VALIDATION_ERROR",
    "data":
    {
        "fields":
        [
            {
                "field":"mobile_number",
                "message":"Invalid mobile number"
            }
        ]
    }
}
```

---

# 8. List Response Format

All list APIs should return arrays inside data.

Example:

```json
{
    "success":true,
    "message":"Students retrieved successfully.",
    "data":
    [
        {
            "id":"UUID",
            "name":"John"
        },
        {
            "id":"UUID",
            "name":"David"
        }
    ],
    "metadata":
    {
        "pagination":
        {
            "page":1,
            "size":20,
            "total":100
        }
    }
}
```

---

# 9. Single Object Response

Example:

```json
{
    "success":true,
    "message":"Horse details retrieved successfully.",
    "data":
    {
        "id":"UUID",
        "name":"McQueen",
        "age":10
    }
}
```

---

# 10. Create Response

When a new record is created:

HTTP Status:

```text
201 Created
```

Example:

```json
{
    "success":true,
    "message":"Registration submitted successfully.",
    "data":
    {
        "registration_id":"UUID"
    }
}
```

---

# 11. Update Response

Example:

```json
{
    "success":true,
    "message":"Student information updated successfully.",
    "data":
    {
        "student_id":"UUID"
    }
}
```

---

# 12. Delete Response

Example:

```json
{
    "success":true,
    "message":"Record removed successfully.",
    "data":null
}
```

---

# 13. Pagination Standard

All large collections must support:

Request:

```
?page=1&size=20
```

Response:

```json
{
    "metadata":
    {
        "pagination":
        {
            "page":1,
            "size":20,
            "total":250,
            "pages":13
        }
    }
}
```

---

# 14. Sorting Metadata

If sorting is applied:

```json
{
    "metadata":
    {
        "sort":
        {
            "field":"name",
            "order":"asc"
        }
    }
}
```

---

# 15. Dashboard Response Standard

Dashboard APIs should return grouped information.

Example:

```json
{
    "success":true,
    "message":"Dashboard loaded.",
    "data":
    {
        "profile":{},
        "attendance":{},
        "fees":{},
        "progress":{},
        "events":[]
    }
}
```

---

# 16. Trial Booking Response

Example:

```json
{
    "success":true,
    "message":"Trial booking confirmed.",
    "data":
    {
        "booking_id":"UUID",
        "date":"2026-07-26",
        "time":"06:00-06:30",
        "slots_booked":2,
        "amount_paid":800
    }
}
```

---

# 17. Login Response

Example:

```json
{
    "success":true,
    "message":"Login successful.",
    "data":
    {
        "user_type":"STUDENT",
        "dashboard":"STUDENT_DASHBOARD",
        "token":"JWT_TOKEN"
    }
}
```

---

# 18. Empty Response

When no data exists:

```json
{
    "success":true,
    "message":"No attendance records found.",
    "data":[],
    "metadata":{}
}
```

---

# 19. Date and Time Response Rules

All dates:

```text
YYYY-MM-DD
```

Example:

```text
2026-07-20
```

All timestamps:

```text
ISO 8601
```

Example:

```text
2026-07-20T10:30:00
```

---

# 20. Mobile Client Considerations

Responses must:

* Avoid unnecessary fields.
* Avoid deeply nested structures.
* Return only required information.
* Remain consistent across platforms.

The same API response must support:

* Android
* iOS
* Web

---

# 21. Security Rules

Responses must never contain:

* Passwords
* Internal configuration
* Database connection details
* Sensitive uploaded document paths

---

# 22. Backend Response Helper

All APIs should use a common response utility.

Example:

```python
create_success_response()

create_error_response()
```

This avoids duplicate response formatting code.

---

# 23. Final Response Flow

```text
Database Result

        ↓

Repository

        ↓

Service

        ↓

Response Schema

        ↓

Standard JSON Response

        ↓

Frontend
```

---

# Conclusion

This response standard ensures all client applications consume predictable and consistent APIs.

All future backend endpoints must follow this response format.
