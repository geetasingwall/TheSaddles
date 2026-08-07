# Horse Riding Club System

# Screen Specifications

Version: 1.0

---

# 1. Purpose

This document defines every screen that will be developed for the Horse Riding Club System.

Each screen includes:

- Purpose
- Primary Users
- Major Components
- APIs Consumed
- Navigation
- Validation Requirements

This serves as the master blueprint for frontend implementation.

---

# 2. Public Screens

---

## 2.1 Landing Page

### Purpose

Introduce the club and encourage visitors to register or book a trial.

### Users

- Public

### Components

- Header
- Hero Banner
- About Section
- Why Choose Us
- Horse Gallery
- Facilities
- Testimonials
- Call To Action
- Contact Section
- Footer

### APIs

- Public Horses
- Public Facilities
- Public Testimonials
- Club Location

### Navigation

- About
- Trial Booking
- Registration
- Login
- Contact

---

## 2.2 About Us

### Purpose

Provide information about the club.

### Components

- Club Story
- Vision
- Mission
- Team
- Gallery

### APIs

None

---

## 2.3 Horse Gallery

### Purpose

Display horses available at the club.

### Components

- Horse Cards
- Images
- Description

### APIs

GET /horses

---

## 2.4 Facilities

### Purpose

Display club facilities.

### Components

- Facility Cards
- Images
- Description

### APIs

GET /facilities

---

## 2.5 Testimonials

### Purpose

Display student testimonials.

### Components

- Testimonial Cards
- Rating
- Images

### APIs

GET /testimonials

---

## 2.6 Contact Us

### Purpose

Provide contact information.

### Components

- Address
- Phone
- Email
- Google Map
- Contact Form

### APIs

GET /locations

---

## 2.7 Trial Booking

### Purpose

Allow visitors to schedule a trial lesson.

### Components

- Booking Form
- Calendar
- Time Slot Selector
- Confirmation

### APIs

- Available Batches
- Trial Booking

---

## 2.8 Registration

### Purpose

Register a new student.

### Components

- Registration Form
- Personal Details
- Parent Details
- Emergency Contact
- Medical Information
- Terms & Conditions

### APIs

POST /registrations

---

## 2.9 Login

### Purpose

Authenticate users.

### Components

- Phone Number
- Password
- Login Button

### APIs

Authentication API

---

# 3. Student Module

---

## 3.1 Student Dashboard

Displays:

- Attendance Summary
- Fee Status
- Progress
- Upcoming Classes
- Notifications

---

## 3.2 My Profile

Displays:

- Personal Information
- Parent Information
- Medical Details

Supports profile update.

---

## 3.3 Attendance

Displays:

- Monthly Attendance
- Total Attendance
- Missed Sessions

---

## 3.4 Fee Payments

Displays:

- Pending Fees
- Paid Fees
- Payment History

Future:

- Online Payment

---

## 3.5 Progress

Displays:

- Skill Level
- Coach Remarks
- Achievements
- Certificates

---

# 4. Coach Module

---

## 4.1 Coach Dashboard

Displays:

- Today's Classes
- Assigned Students
- Attendance Summary

---

## 4.2 Student List

Displays:

- Assigned Students
- Batch
- Contact Information

---

## 4.3 Attendance Management

Allows coach to:

- Mark Attendance
- Update Attendance

---

## 4.4 Progress Management

Allows coach to:

- Add Remarks
- Update Skill Level
- Record Achievements

---

# 5. Administrator Module

---

## 5.1 Dashboard

Displays:

- Student Count
- Trial Bookings
- Revenue
- Attendance
- Horses
- Coaches

---

## 5.2 Registration Management

Allows administrators to:

- Review Registrations
- Approve
- Reject

---

## 5.3 Student Management

Functions:

- View Students
- Edit Student
- Activate
- Deactivate

---

## 5.4 Coach Management

Functions:

- Add Coach
- Edit Coach
- Remove Coach

---

## 5.5 Batch Management

Functions:

- Create Batch
- Assign Coach
- Assign Horse
- Manage Capacity

---

## 5.6 Horse Management

Functions:

- Add Horse
- Edit Horse
- Change Status
- Upload Images

---

## 5.7 Facility Management

Functions:

- Add Facility
- Edit Facility
- Upload Images

---

## 5.8 Team Member Management

Functions:

- Add Team Member
- Update Information
- Upload Images

---

## 5.9 Testimonial Management

Functions:

- Approve
- Reject
- Publish
- Delete

---

## 5.10 Location Management

Functions:

- Add Location
- Update Address
- Update Contact Information

---

## 5.11 Fee Management

Functions:

- Record Payment
- Update Payment
- View Payment History

---

## 5.12 Attendance Management

Functions:

- View Attendance
- Modify Attendance
- Generate Reports

---

## 5.13 Student Progress Management

Functions:

- View Progress
- Update Progress
- Generate Reports

---

## 5.14 Reports

Reports include:

- Student Report
- Attendance Report
- Fee Report
- Trial Booking Report
- Coach Report
- Horse Utilization Report

---

## 5.15 Configuration

Manage:

- Batch Timing
- Fee Structure
- Booking Limits
- Club Settings
- Master Configuration

---

# 6. Shared Components

Every screen should reuse the common component library.

Examples:

- Buttons
- Cards
- Tables
- Forms
- Dialogs
- Navigation
- Loaders
- Toast Messages
- Empty States

---

# 7. Responsive Behaviour

Every screen must support:

- Mobile
- Tablet
- Laptop
- Desktop

No horizontal scrolling should occur.

---

# 8. Security

Protected screens require authentication.

Role-based access must be enforced for:

- Student
- Coach
- Administrator

Unauthorized users must be redirected to the Login screen.

---

# 9. Screen Development Order

The recommended implementation sequence is:

1. Landing Page
2. Login
3. Trial Booking
4. Registration
5. Student Dashboard
6. Coach Dashboard
7. Admin Dashboard
8. Master Data Modules
9. Reports
10. Configuration

---

# Conclusion

This document defines the complete set of screens required for the Horse Riding Club System. Together with the frontend architecture, navigation, theme, and reusable component specifications, it provides a complete blueprint for frontend development while ensuring consistency, scalability, and maintainability.