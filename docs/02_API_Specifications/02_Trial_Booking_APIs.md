# Horse Riding Club System

# Trial Booking APIs Specification

Version: 1.0

---

# 1. Purpose

This document defines the API contract for the Trial Ride Booking functionality.

The Trial Booking module allows a new user to:

* View available trial ride slots
* Select a suitable date and time
* Book one or more trial seats
* Receive booking confirmation

The module is designed to support future addition of more trial days and timings through configuration.

---

# 2. Trial Booking Flow

```text
User Opens Trial Booking

        ↓

Select Date

        ↓

Fetch Available Slots

        ↓

Select Time Slot

        ↓

Enter User Details

        ↓

Calculate Amount

        ↓

Confirm Booking

        ↓

Generate Booking Summary
```

---

# 3. Trial Booking Rules

## Current Trial Schedule

### Sunday Morning Slots

```text
06:00 AM - 06:30 AM

06:40 AM - 07:10 AM

07:20 AM - 07:50 AM
```

---

### Future Weekday Slots

Configurable evening slots:

```text
05:30 PM - 06:00 PM

06:10 PM - 06:40 PM
```

---

# 4. Slot Capacity Rules

Each trial slot can accommodate:

```text
Maximum Capacity = 2 People
```

Example:

```text
Slot:

Sunday
06:00 AM - 06:30 AM


Capacity:

2


Booked:

1


Available:

1
```

---

# 5. Get Available Trial Dates API

## Endpoint

```text
GET

/api/v1/trial-bookings/dates
```

---

# 6. Response

Example:

```json
{
    "success": true,
    "data": [
        {
            "date": "2026-07-26",
            "day": "Sunday",
            "available": true
        }
    ]
}
```

---

# 7. Get Available Time Slots API

## Endpoint

```text
GET

/api/v1/trial-bookings/slots
```

---

# 8. Request Parameters

| Parameter | Type | Required | Description         |
| --------- | ---- | -------- | ------------------- |
| date      | Date | Yes      | Selected trial date |

Example:

```text
/trial-bookings/slots?date=2026-07-26
```

---

# 9. Slot Response

Example:

```json
{
    "success": true,
    "data": [
        {
            "slot_id": "uuid",
            "start_time": "06:00",
            "end_time": "06:30",
            "capacity": 2,
            "booked": 1,
            "available_slots": 1
        }
    ]
}
```

---

# 10. Create Trial Booking API

## Endpoint

```text
POST

/api/v1/trial-bookings
```

---

# 11. Request Payload

```json
{
    "name": "Rahul Sharma",
    "mobile_number": "9876543210",
    "place": "Noida",
    "date": "2026-07-26",
    "slot_id": "uuid",
    "number_of_slots": 2
}
```

---

# 12. Mandatory Fields

| Field            | Required |
| ---------------- | -------- |
| Name             | Yes      |
| Mobile Number    | Yes      |
| Place            | Yes      |
| Date             | Yes      |
| Slot             | Yes      |
| Number of People | Yes      |

---

# 13. Place Values

Allowed values:

```text
Noida

New Delhi
```

---

# 14. Number of Slots Validation

Rules:

```text
Minimum:

1 Person


Maximum:

Available Capacity
```

Example:

```text
Slot Capacity = 2

Already Booked = 1

Available = 1


User cannot book 2 seats
```

---

# 15. Trial Fee Calculation

Trial fee is configurable.

Default:

```text
₹400 per person
```

Calculation:

```text
Total Amount

=

Number Of People

×

Configured Trial Fee
```

Example:

```text
2 × 400

=

₹800
```

---

# 16. Successful Booking Response

Example:

```json
{
    "success": true,
    "message": "Trial booking confirmed",
    "data": {
        "booking_id": "uuid",
        "name": "Rahul Sharma",
        "date": "2026-07-26",
        "slot": "06:00 AM - 06:30 AM",
        "persons": 2,
        "amount": 800
    }
}
```

---

# 17. Booking Status

Initial booking status:

```text
Booked
```

Possible future statuses:

```text
Booked

Confirmed

Completed

Cancelled

No Show
```

---

# 18. Booking Summary API

## Endpoint

```text
GET

/api/v1/trial-bookings/{booking_id}
```

---

# 19. Response

Example:

```json
{
    "success": true,
    "data": {
        "booking_id": "uuid",
        "date": "2026-07-26",
        "time": "06:00 AM - 06:30 AM",
        "persons": 2,
        "amount": 800,
        "status": "Booked"
    }
}
```

---

# 20. Admin Booking View API

Administrators can view all trial bookings.

## Endpoint

```text
GET

/api/v1/admin/trial-bookings
```

---

# 21. Admin Booking Information

Response should include:

* Booking ID
* Name
* Mobile Number
* Place
* Date
* Time Slot
* Number of People
* Amount
* Booking Status
* Attendance Status

---

# 22. Booking Cancellation API

## Endpoint

```text
PATCH

/api/v1/trial-bookings/{booking_id}/cancel
```

---

# 23. Cancellation Response

```json
{
    "success": true,
    "message": "Booking cancelled"
}
```

---

# 24. Error Responses

## Slot Full

```json
{
    "success": false,
    "error_code": "SLOT_FULL",
    "message": "Selected slot is no longer available"
}
```

---

## Invalid Date

```json
{
    "success": false,
    "error_code": "INVALID_DATE",
    "message": "Trial booking is not available on this date"
}
```

---

# 25. Database Dependency

This API interacts with:

```text
trial_bookings

configuration

students (after enrollment)
```

---

# 26. Future Enhancements

The API design should allow:

* Online payment integration
* SMS confirmation
* WhatsApp notification
* Multiple riding locations
* Different trial prices

without changing existing API contracts.

---

# Conclusion

The Trial Booking API provides a simple booking experience while keeping the system configurable for future club expansion.
