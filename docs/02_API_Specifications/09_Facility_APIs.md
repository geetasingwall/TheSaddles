# Horse Riding Club System

# Facility APIs Specification

Version: 1.0

---

# 1. Purpose

This document defines the API contract for managing and displaying club facilities.

The Facility module maintains information about infrastructure available at the Horse Riding Club.

Examples:

* Riding arena
* Stables
* Training areas
* Equipment areas
* Other club facilities

---

# 2. Facility Management Concept

Facilities are maintained as configurable entities.

The system supports:

```text
Facility Information

        +

Description

        +

Images

        +

Availability Status
```

---

# 3. Facility Entity Information

A facility contains:

```text
Facility ID

Name

Type

Description

Location

Capacity

Images

Status

Display Order
```

---

# 4. Facility Status Values

Allowed values:

```text
Active

Inactive

Maintenance
```

---

# 5. Get Facility List API

## Endpoint

```text
GET

/api/v1/facilities
```

---

# 6. Response

Example:

```json
{
    "success": true,
    "data": [
        {
            "facility_id": "uuid",
            "name": "Main Riding Arena",
            "type": "Arena",
            "status": "Active"
        }
    ]
}
```

---

# 7. Get Facility Details API

## Endpoint

```text
GET

/api/v1/facilities/{facility_id}
```

---

# 8. Response

Example:

```json
{
    "success": true,
    "data": {
        "facility_id": "uuid",
        "name": "Main Riding Arena",
        "type": "Arena",
        "description": "Professional riding area suitable for training",
        "capacity": 10,
        "status": "Active"
    }
}
```

---

# 9. Create Facility API

Only administrators can create facilities.

## Endpoint

```text
POST

/api/v1/admin/facilities
```

---

# 10. Request Payload

Example:

```json
{
    "name": "Indoor Arena",
    "type": "Arena",
    "description": "Covered riding area",
    "capacity": 8
}
```

---

# 11. Update Facility API

## Endpoint

```text
PATCH

/api/v1/admin/facilities/{facility_id}
```

---

# 12. Updateable Fields

Administrator can update:

```text
Name

Type

Description

Capacity

Images

Status

Display Order
```

---

# 13. Change Facility Status API

## Endpoint

```text
PATCH

/api/v1/admin/facilities/{facility_id}/status
```

---

# 14. Request

Example:

```json
{
    "status": "Maintenance",
    "remarks": "Arena maintenance work"
}
```

---

# 15. Public Facility Gallery API

Used for website and mobile application.

## Endpoint

```text
GET

/api/v1/public/facilities
```

---

# 16. Public Response

Example:

```json
{
    "success": true,
    "data": [
        {
            "name": "Outdoor Riding Arena",
            "description": "Large open riding area",
            "image": "/assets/facilities/arena.jpg"
        }
    ]
}
```

---

# 17. Facility Categories

Supported categories:

```text
Arena

Stable

Training Area

Equipment

Office

Other
```

---

# 18. Access Control

## Public Users

Allowed:

```text
View Facilities

View Images

View Descriptions
```

---

## Students

Allowed:

```text
View Facility Information

View Training Locations
```

---

## Coaches

Allowed:

```text
View Available Facilities

Plan Training Usage
```

---

## Administrators

Allowed:

```text
Create Facility

Update Facility

Change Status

Manage Images
```

---

# 19. Validation Rules

Backend must validate:

* Facility name is mandatory
* Duplicate facility names should be prevented
* Capacity cannot be negative
* Status must be valid

---

# 20. Database Dependency

Facility APIs interact with:

```text
facilities

configuration

media/assets
```

---

# 21. Future Enhancements

The API design supports:

* Facility booking
* Arena scheduling
* Maintenance calendar
* Equipment inventory
* Resource allocation

---

# Conclusion

The Facility APIs provide a simple management layer for club infrastructure while allowing public users and members to view available facilities.
