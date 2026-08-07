# Horse Riding Club Management System

## Project Vision

**Version:** 1.0

---

# Purpose

This document defines the overall vision, objectives, scope and guiding principles of the Horse Riding Club Management System.

It is the master business document from which the database design, backend APIs, mobile application, web application and administrative portal will be implemented.

The goal is to create a modern, scalable and easy-to-use digital platform that simplifies the daily operations of a horse riding club while providing an excellent experience for visitors, students, coaches and administrators.

---

# Project Name

Horse Riding Club Management System

---

# Vision

To build a modern digital platform that manages every important activity of a horse riding club from a single application.

The platform should enable prospective riders to discover the club, book trial rides, register for membership and track their riding journey while allowing coaches and administrators to efficiently manage club operations.

The system must remain simple to operate today while being flexible enough to accommodate future expansion without requiring major architectural changes.

---

# Primary Objectives

The application shall:

* Provide a professional online presence for the riding club.
* Allow visitors to book paid trial riding sessions.
* Allow prospective riders to register online.
* Allow administrators to manage registrations and trial bookings.
* Allow coaches to maintain attendance and student progress.
* Allow enrolled students to monitor their attendance, fees and progress.
* Provide a content management capability so that club information can evolve without requiring application redesign.
* Support future business growth through modular expansion.

---

# Business Goals

The system should help the club:

* Increase trial ride bookings.
* Improve conversion of trial riders into enrolled students.
* Reduce manual paperwork.
* Digitize attendance.
* Maintain centralized student records.
* Improve communication with students.
* Present a professional online identity.
* Support future services such as competitions, memberships and horse leasing.

---

# Problems Being Solved

Currently, many riding clubs rely on manual registers, phone calls and spreadsheets.

This project addresses these issues by providing:

* Online trial ride booking.
* Digital registration.
* Attendance management.
* Student progress tracking.
* Fee monitoring.
* Centralized information management.
* Online presentation of facilities and services.

---

# Target Audience

The application is intended for:

### Visitors

Individuals interested in learning horse riding or exploring the club.

### Trial Riders

Visitors who wish to experience a paid introductory riding session before enrolling.

### Enrolled Students

Students whose registrations have been approved by the club.

### Coaches

Coaches responsible for attendance, student progress and riding sessions.

### Club Administrators

Personnel responsible for managing registrations, bookings, pricing, schedules, horses and website content.

---

# Supported Platforms

The application shall operate on:

* Android
* iOS
* Modern Web Browsers

All three platforms shall provide a consistent user experience while following their respective platform guidelines.

---

# Technology Stack

## Frontend

* React Native
* React Native Web
* Redux Toolkit
* React Navigation
* Axios

## Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic

## Database

* PostgreSQL

---

# Application Access Model

The application intentionally avoids traditional username/password or role-based authentication for the MVP.

Instead, application access is determined by the mobile number entered during login.

### Visitor

A person who has not logged in.

Visitors may:

* Browse the website.
* View club information.
* Book trial rides.
* Submit registration requests.
* Contact the club.

### Student Access

If the entered mobile number belongs to an approved registration, the student dashboard is displayed.

### Coach Access

If the entered mobile number matches one of the configured coach numbers, the coach dashboard is displayed.

Coach mobile numbers are maintained by the administrator through system configuration.

### Administrator Access

If the entered mobile number matches one of the configured administrator numbers, the administrator dashboard is displayed.

Administrator mobile numbers are stored in the system configuration.

The application backend determines which dashboard to display after validating the entered mobile number.

---

# Core Modules

The first production release shall include the following modules:

1. Landing Website
2. About the Club
3. Facilities
4. Horses
5. Team
6. Testimonials
7. Trial Ride Booking
8. Registration
9. Student Dashboard
10. Coach Dashboard
11. Administrator Dashboard
12. Attendance Management
13. Contact & Locations
14. Website Content Management
15. System Configuration

---

# Design Principles

The application shall be designed according to the following principles.

## Simplicity

Every interaction should require the minimum possible number of steps.

---

## Mobile First

The application should provide an excellent experience on mobile devices while remaining fully responsive on tablets and desktops.

---

## Configurability

Business rules should be configurable wherever practical.

Examples include:

* Trial days
* Trial timings
* Trial fees
* Slot capacities
* Contact information
* Club facilities
* Horse information

Changes to these items should not require source code modifications.

---

## Scalability

The architecture should allow new modules to be added without restructuring the existing application.

Examples include:

* Online payments
* Membership plans
* Stable management
* Horse health records
* Competition management
* Merchandise store
* Push notifications
* WhatsApp notifications
* AI-powered chatbot

---

## Maintainability

The project should follow a modular architecture with clearly separated frontend, backend and database components.

---

# Minimum Viable Product (MVP)

The MVP shall include:

* Landing website
* Trial ride booking
* Registration workflow
* Student dashboard
* Coach dashboard
* Administrator dashboard
* Attendance management
* Fee tracking
* Student progress
* Facilities page
* Horses page
* Team page
* Testimonials
* Contact page
* System configuration

---

# Out of Scope (Initial Release)

The following features are intentionally excluded from the MVP:

* Online payment gateway
* OTP-based authentication
* Password-based login
* Social media login
* Horse medical records
* Inventory management
* Stable management
* Merchandise store
* Competition registration
* AI assistant
* Video learning platform

These features may be introduced in future releases.

---

# Success Criteria

The project will be considered successful when:

* Visitors can easily explore the club.
* Trial rides can be booked online.
* Registrations can be submitted digitally.
* Administrators can manage bookings and registrations from a single dashboard.
* Coaches can maintain attendance and student progress.
* Students can monitor their attendance, fees and riding progress.
* Website content can be updated without application redesign.
* The application performs consistently across Android, iOS and the Web.

---

# Guiding Principle

The Horse Riding Club Management System should remain simple enough for a small riding club to operate comfortably while being architecturally prepared to support future expansion into a comprehensive equestrian management platform.

---

**End of Document**
