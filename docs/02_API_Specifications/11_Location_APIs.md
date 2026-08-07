# Horse Riding Club System

# Location APIs Specification

Version: 1.0

---

# 1. Purpose

This document defines the API contract for managing club locations.

The Location module supports:

* Single or multiple riding locations
* Club address display
* Location information
* Contact details
* Map integration support

---

# 2. Location Concept

The system is designed to support future expansion to multiple branches.

Current implementation may support:

```text
Primary Club Location
```

Future support:

```text
Multiple Riding Centers

        +

Multiple Arenas

        +

Multiple Branches
```

---

# 3. Location Entity Information

A location contains:

```text
Location ID

Location Name

Address

City

State

Country

Postal Code

Latitude

Longitude

Contact Number

Email

Operating Hours

Status
```

---

# 4. Location Status Values

Allowed values:

```text
Active

Inactive
```

---

# 5. Get Public Locations API

Used by website and mobile application.

## Endpoint

```text
GET

/api/v1/public/locations
```

---

# 6. Response

Example:

```json
{
    "success": true,
    "data": [
        {
            "location_id": "uuid",
            "name": "The Saddles Club",
            "address": "Club Address",
            "city": "Noida",
            "contact_number": "9876543210",
            "status": "Active"
        }
    ]
}
```

---

# 7. Get Location Details API

## Endpoint

```text
GET

/api/v1/public/locations/{location_id}
```

---

# 8. Response

Example:

```json
{
    "success": true,
    "data": {
        "location_id": "uuid",
        "name": "The Saddles Club",
        "address": "Complete Address",
        "latitude": 28.5,
        "longitude": 77.3,
        "operating_hours": {
            "morning": "06:00 AM - 08:00 AM",
            "evening": "05:00 PM - 07:00 PM"
        }
    }
}
```

---

# 9. Create Location API

Only administrators can create locations.

## Endpoint

```text
POST

/api/v1/admin/locations
```

---

# 10. Request Payload

Example:

```json
{
    "name": "The Saddles Club",
    "address": "Club Address",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "country": "India",
    "postal_code": "201301",
    "contact_number": "9876543210"
}
```

---

# 11. Update Location API

## Endpoint

```text
PATCH

/api/v1/admin/locations/{location_id}
```

---

# 12. Updateable Fields

Administrator can update:

```text
Name

Address

Contact Number

Email

Operating Hours

Map Coordinates

Status
```

---

# 13. Location Status Update API

## Endpoint

```text
PATCH

/api/v1/admin/locations/{location_id}/status
```

---

# 14. Request

Example:

```json
{
    "status": "Inactive"
}
```

---

# 15. Operating Hours API

The system supports configurable operating hours.

## Endpoint

```text
GET

/api/v1/locations/{location_id}/hours
```

---

# 16. Operating Hours Response

Example:

```json
{
    "success": true,
    "data": {
        "monday": {
            "morning": "05:45 AM - 08:00 AM",
            "evening": "05:00 PM - 07:00 PM"
        },
        "sunday": {
            "morning": "06:00 AM - 08:00 AM"
        }
    }
}
```

---

# 17. Location-Based Booking Support

Future booking flow:

```text
User Selects Location

        ↓

Available Slots Loaded

        ↓

Booking Created
```

---

# 18. Access Control

## Public Users

Allowed:

```text
View Locations

View Address

View Contact Information

View Operating Hours
```

---

## Students

Allowed:

```text
View Training Location

View Schedule Location
```

---

## Coaches

Allowed:

```text
View Assigned Location

View Operating Hours
```

---

## Administrators

Allowed:

```text
Create Location

Update Location

Manage Status
```

---

# 19. Validation Rules

Backend validates:

* Location name is mandatory
* Address cannot be empty
* Duplicate active locations should be prevented
* Coordinates must be valid

---

# 20. Database Dependency

Location APIs interact with:

```text
club_locations

configuration

trial_bookings

batches
```

---

# 21. Future Enhancements

The API design supports:

* Multiple branches
* Location-wise trainers
* Location-wise horse allocation
* Location-wise pricing
* Geo-based search

---

# Conclusion

The Location APIs provide a scalable foundation for managing current and future club locations while keeping the system ready for expansion.
