# Product Context — Horse Riding Club Management System

## Why This Exists
Small riding clubs operate manually — phone bookings, paper attendance, spreadsheet fees. This platform replaces all of that with a single digital system that is simple enough for a small club to operate today but architecturally ready for future growth.

## How Access Works (No Traditional Auth)
The system uses mobile-number-based access — no passwords, no OTP (v1.0).

```
Enter Mobile Number → Backend validates →
  Admin number    → Administrator Dashboard
  Coach number    → Coach Dashboard
  Approved student → Student Dashboard
  Pending reg     → "Awaiting Approval" screen
  Unknown number  → Invitation to register
```

## Key User Journeys

### Visitor → Trial Rider
1. Visits landing page
2. Selects available Sunday slot (configurable days/times)
3. Fills name, mobile, city, number of riders
4. Gets booking confirmation with reference number
5. Pays ₹400/rider (default, configurable) at the club

### Visitor → Student
1. Submits registration form (name, age, gender, mobile, batch preference, etc.)
2. Status: Pending
3. Admin reviews and approves
4. Student record auto-created
5. Student logs in with mobile number → Student Dashboard

### Coach Daily Flow
1. Logs in with mobile → Coach Dashboard
2. Views assigned batches
3. Marks attendance (Present/Absent) per student
4. Updates riding progress / adds remarks
5. Changes immediately visible to students and admin

### Admin Daily Flow
1. Logs in → Admin Dashboard
2. Reviews new trial bookings and registrations
3. Approves/rejects registrations
4. Manages horses, facilities, team, testimonials
5. Updates system configuration (fees, slots, contact info)

## Business Rules That Matter
- Slot capacity never exceeded (default: 2 riders/slot)
- Booking amount = riders × trial fee (from config)
- Cancelled bookings immediately release seats
- Attendance: one record per student per session, no duplicates
- Progress records are never deleted — always append new evaluations
- Inactive facilities/horses/team members don't appear publicly
- Config changes take effect immediately, no redeployment needed

## Club Locations
- Noida
- New Delhi
