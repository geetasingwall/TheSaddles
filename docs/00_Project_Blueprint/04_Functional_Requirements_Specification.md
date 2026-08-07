# Horse Riding Club Management System

# Functional Requirements Specification (FRS)

**Document:** 04_Functional_Requirements_Specification.md

**Version:** 1.0

---

# 1. Purpose

This document defines all functional requirements for Version 1.0 of the Horse Riding Club Management System.

It serves as the primary business contract between the business requirements and the software implementation.

Every database table, backend API, frontend screen and administrator function must satisfy one or more requirements defined in this document.

---

# 2. Functional Modules

The application is divided into the following functional modules.

| Module ID | Module                  |
| --------- | ----------------------- |
| FRM-01    | Landing Website         |
| FRM-02    | About Club              |
| FRM-03    | Trial Ride Booking      |
| FRM-04    | Student Registration    |
| FRM-05    | Student Dashboard       |
| FRM-06    | Coach Dashboard         |
| FRM-07    | Administrator Dashboard |
| FRM-08    | Attendance Management   |
| FRM-09    | Facilities Management   |
| FRM-10    | Horses Management       |
| FRM-11    | Team Management         |
| FRM-12    | Testimonials            |
| FRM-13    | Contact & Locations     |
| FRM-14    | System Configuration    |

---

# 3. Landing Website

## FR-001

The application shall provide a responsive landing page.

---

## FR-002

The landing page shall display:

* Club Introduction
* Hero Banner
* About Club
* Facilities
* Horses Preview
* Testimonials
* Contact Information
* Trial Ride CTA
* Registration CTA

---

## FR-003

The landing page shall be accessible without login.

---

## FR-004

The landing page shall provide navigation to every public page.

---

# 4. About Club

## FR-005

The system shall provide a dedicated page describing:

* History
* Mission
* Vision
* Infrastructure
* Arena
* Safety Standards
* Achievements

---

## FR-006

Administrators shall be able to update the content without modifying application code.

---

# 5. Trial Ride Booking

## FR-007

Visitors shall be able to book paid trial riding sessions.

---

## FR-008

Only administrator-configured trial days shall be available for booking.

Initial configuration:

* Sunday Morning

Future support:

* Additional weekdays

---

## FR-009

Trial time slots shall be configurable.

Default Morning Slots:

* 6:00 AM – 6:30 AM
* 6:40 AM – 7:10 AM
* 7:20 AM – 7:50 AM

Default Evening Slots:

* 5:30 PM – 6:00 PM
* 6:10 PM – 6:40 PM

---

## FR-010

Each time slot shall support a configurable maximum capacity.

Default:

* Two riders per slot.

---

## FR-011

The booking calendar shall display:

* Available
* Limited Availability
* Fully Booked

---

## FR-012

Visitors shall provide:

* Name
* Mobile Number
* City
* Number of Riders
* Preferred Date
* Preferred Time Slot

---

## FR-013

The system shall validate slot availability before confirming a booking.

---

## FR-014

The booking shall generate a confirmation summary including:

* Booking Reference
* Date
* Time
* Number of Riders
* Total Amount
* Remaining Capacity

---

## FR-015

The trial fee shall be configurable.

Default value:

₹400 per rider.

---

## FR-016

Administrators shall be able to:

* View bookings
* Search bookings
* Cancel bookings
* Update booking status

---

# 6. Student Registration

## FR-017

Visitors shall be able to submit a registration request.

---

## FR-018

The registration form shall collect:

* Name
* Age
* Gender
* Mobile Number
* Email (Optional)
* Address
* Emergency Contact
* Riding Experience
* Preferred Batch
* Remarks

---

## FR-019

Submitted registrations shall initially remain in Pending status.

---

## FR-020

Only administrators may approve or reject registrations.

---

## FR-021

Approved registrations shall automatically enable student dashboard access.

---

# 7. Student Dashboard

## FR-022

Approved students shall access the dashboard using their registered mobile number.

---

## FR-023

The dashboard shall display:

* Attendance Summary
* Fee Status
* Coach Remarks
* Riding Progress
* Upcoming Events
* Announcements

---

## FR-024

Students shall not be able to modify attendance records.

---

## FR-025

Students shall be able to update permitted profile information.

---

# 8. Coach Dashboard

## FR-026

Coach access shall be granted only to configured coach mobile numbers.

---

## FR-027

Coaches shall be able to:

* View assigned students
* Mark attendance
* Update riding progress
* Add coach remarks

---

## FR-028

Coach updates shall immediately reflect in the student dashboard.

---

# 9. Administrator Dashboard

## FR-029

Administrator access shall be granted only to configured administrator mobile numbers.

---

## FR-030

Administrators shall manage:

* Trial Bookings
* Registrations
* Students
* Attendance
* Horses
* Facilities
* Team Members
* Testimonials
* Website Content
* System Configuration

---

## FR-031

Administrators shall configure:

* Trial Days
* Trial Timings
* Trial Fees
* Slot Capacity
* Administrator Numbers
* Coach Numbers
* Club Contact Details

---

## FR-032

Administrators shall be able to search, filter and export operational data.

---

# 10. Attendance Management

## FR-033

Coaches shall record attendance by training batch.

---

## FR-034

Attendance values:

* Present
* Absent

---

## FR-035

Attendance shall immediately update:

* Student Dashboard
* Administrator Dashboard
* Attendance Reports

---

# 11. Facilities

## FR-036

The application shall provide a Facilities page.

Initial facilities include:

* Horse Riding Lessons
* Horse Training
* Full Livery
* Partial Livery
* Horse Lease

---

## FR-037

Facilities shall support:

* Images
* Description
* Gallery
* Display Order

---

## FR-038

Administrators shall manage facilities without application code changes.

---

# 12. Horses

## FR-039

The application shall maintain horse profiles.

Each horse shall include:

* Name
* Breed
* Age
* Gender
* Height
* Description
* Images

---

## FR-040

Horse information shall be manageable through the administrator dashboard.

---

# 13. Team

## FR-041

The application shall display team members.

Each member shall include:

* Name
* Designation
* Biography
* Photograph

---

## FR-042

Administrators shall manage team information.

---

# 14. Testimonials

## FR-043

Visitors shall view testimonials.

---

## FR-044

Testimonials shall support:

* Name
* Review
* Rating
* Photograph (Optional)

---

## FR-045

Administrators shall add, edit and remove testimonials.

---

# 15. Contact & Locations

## FR-046

The Contact page shall display:

* Phone Numbers
* Email
* Working Hours
* Addresses

---

## FR-047

Each club location shall include a "View on Map" action.

Selecting the action shall open the appropriate map application.

---

# 16. System Configuration

## FR-048

The application shall provide centralized system configuration.

Configuration includes:

* Trial Schedule
* Fees
* Slot Capacity
* Administrator Numbers
* Coach Numbers
* Club Contact Details

---

## FR-049

Configuration changes shall take effect without requiring application redeployment.

---

# 17. Number-Based Access

## FR-050

The application shall determine dashboard access using the entered mobile number.

---

## FR-051

Configured administrator numbers shall open the Administrator Dashboard.

---

## FR-052

Configured coach numbers shall open the Coach Dashboard.

---

## FR-053

Approved student numbers shall open the Student Dashboard.

---

## FR-054

Pending registrations shall display a Pending Approval message.

---

## FR-055

Unknown mobile numbers shall be invited to complete registration.

---

# 18. Notifications (Initial Release)

## FR-056

The application shall display important announcements to enrolled students.

Future versions may support:

* SMS
* WhatsApp
* Email
* Push Notifications

---

# 19. Reporting

## FR-057

Administrators shall view reports including:

* Trial Bookings
* Registrations
* Attendance
* Fee Status

---

## FR-058

Reports shall support filtering by date range.

---

# 20. Future Functional Expansion

The application architecture shall support future modules without major redesign.

Examples:

* Online Payments
* Membership Management
* Horse Medical Records
* Stable Management
* Event Registration
* Merchandise Store
* Inventory Management
* AI Assistant
* Multi-Branch Management

---

# 21. Requirement Traceability

Every implementation artifact shall reference one or more functional requirements defined in this document.

Examples:

* Database Tables
* SQL Scripts
* REST APIs
* React Native Screens
* Backend Services
* Test Cases

This ensures complete traceability from business requirements to implementation.

---

# 22. Functional Requirements Freeze

The functional requirements defined in this document represent the approved scope for Version 1.0.

Future enhancements shall be introduced through new versions of this specification while preserving backward compatibility wherever practical.

---

**End of Document**
