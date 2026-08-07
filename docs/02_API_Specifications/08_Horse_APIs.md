# Horse Riding Club System

# Horse APIs Specification

Version: 1.0

---

# 1. Purpose

This document defines the API contract for managing horse information in the Horse Riding Club System.

The Horse Management module maintains information about horses used for:

* Training sessions
* Student allocation
* Club management
* Public website display

---

# 2. Horse Management Concept

The system maintains a complete profile for every horse.

Information includes:

```text
Horse Identity

+

Physical Information

+

Training Information

+

Availability Status
```

---

# 3. Horse Entity Information

A horse record contains:

```text
Horse ID

Name

Age

Breed

Gender

Color

Height

Experience Level

Status

Description

Image
```

---

# 4. Horse Status Values

Allowed values:

```text
Available

Training

Rest

Medical

Retired
```

---

# 5. Get Horse List API

## Endpoint

```text
GET

/api/v1/horses
```

---

# 6. Response

Example:

```json
{
    "success": true,
    "data": [
        {
            "horse_id": "uuid",
            "name": "Good Guy",
            "age": 15,
            "breed": "Thoroughbred",
            "status": "Available"
        }
    ]
}
```

---

# 7. Get Horse Details API

## Endpoint

```text
GET

/api/v1/horses/{horse_id}
```

---

# 8. Response

Example:

```json
{
    "success": true,
    "data": {
        "horse_id": "uuid",
        "name": "Good Guy",
        "age": 15,
        "breed": "Thoroughbred",
        "gender": "Male",
        "status": "Available",
        "description": "Experienced riding horse"
    }
}
```

---

# 9. Create Horse API

Only administrators can create horse records.

## Endpoint

```text
POST

/api/v1/admin/horses
```

---

# 10. Request Payload

Example:

```json
{
    "name": "McQueen",
    "age": 10,
    "breed": "Indian Warmblood",
    "gender": "Male",
    "status": "Available"
}
```

---

# 11. Update Horse API

## Endpoint

```text
PATCH

/api/v1/admin/horses/{horse_id}
```

---

# 12. Updateable Fields

Administrator can update:

```text
Name

Age

Breed

Status

Description

Image
```

---

# 13. Change Horse Status API

## Endpoint

```text
PATCH

/api/v1/admin/horses/{horse_id}/status
```

---

# 14. Request

Example:

```json
{
    "status": "Medical",
    "remarks": "Veterinary check required"
}
```

---

# 15. Horse Availability API

This API provides horses available for riding sessions.

## Endpoint

```text
GET

/api/v1/horses/available
```

---

# 16. Response

Example:

```json
{
    "success": true,
    "data": [
        {
            "horse_id": "uuid",
            "name": "Evandor",
            "status": "Available"
        }
    ]
}
```

---

# 17. Horse Assignment Concept

Future sessions may assign horses based on:

```text
Student Level

+

Horse Experience

+

Training Requirement
```

---

# 18. Horse Assignment API

## Endpoint

```text
POST

/api/v1/admin/horses/assign
```

---

# 19. Request

Example:

```json
{
    "horse_id": "uuid",
    "student_id": "uuid",
    "date": "2026-07-20"
}
```

---

# 20. Assignment Validation

Backend validates:

* Horse exists
* Horse is available
* Student exists
* Horse is not already assigned
* Training suitability

---

# 21. Public Horse Gallery API

For website/app display.

## Endpoint

```text
GET

/api/v1/public/horses
```

---

# 22. Public Response

Example:

```json
{
    "success": true,
    "data": [
        {
            "name": "Good Guy",
            "image": "/assets/horses/good-guy.jpg",
            "description": "Friendly beginner horse"
        }
    ]
}
```

---

# 23. Access Control

## Public Users

Allowed:

```text
View Horse Gallery
View Basic Information
```

---

## Students

Allowed:

```text
View Assigned Horse Information
```

---

## Coaches

Allowed:

```text
View Horse Availability

View Training Suitability
```

---

## Admin

Allowed:

```text
Create Horse

Update Horse

Change Status

Manage Assignment
```

---

# 24. Database Dependency

Horse APIs interact with:

```text
horses

student_progress

training_sessions

configuration
```

---

# 25. Future Enhancements

The API design supports:

* Horse health records
* Feeding schedules
* Medical history
* Maintenance tracking
* Performance analysis
* Competition records

---

# Conclusion

The Horse APIs provide centralized management of club horses while supporting both operational use and public presentation.
