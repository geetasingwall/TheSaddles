# Horse Riding Club Management System

# 05_Domain_Model.md

## Part 1 — Domain Overview & Core Business Entities

**Version:** 1.0

---

# 1. Purpose

This document defines the complete business domain of the Horse Riding Club Management System.

Unlike a traditional Software Requirement Specification, this document focuses on the business entities that exist within the system.

Every future implementation artifact—including:

* PostgreSQL Tables
* SQLAlchemy Models
* REST APIs
* React Native Screens
* Reports
* Admin Dashboard
* Coach Dashboard
* Student Dashboard

shall be derived from the entities defined in this document.

This document serves as the master business contract for the entire project.

---

# 2. Domain Philosophy

The application models a real horse riding club.

Instead of thinking in terms of screens or APIs, the application is designed around real-world business objects.

For example,

A student exists whether or not a mobile application exists.

A horse exists regardless of the database.

A booking represents a real booking.

A riding lesson represents a real lesson.

The software simply manages these business entities digitally.

---

# 3. Domain Design Principles

The domain model follows these principles.

## Business First

The domain describes the riding club.

It does not describe software.

---

## Stable Naming

Business entity names shall remain stable.

Examples:

Student

Horse

Attendance

Trial Booking

Facility

Coach

Configuration

Changing these names later should be avoided.

---

## One Entity = One Responsibility

Every entity should have a single responsibility.

Example

Horse

Responsible for horse information only.

Not attendance.

Not booking.

Not payments.

---

## Configurable Business

Business rules should not be hardcoded.

Examples

* Trial fee
* Trial timings
* Trial days
* Slot capacity
* Contact information
* Coach numbers
* Administrator numbers

These belong to configuration entities.

---

## Future Expansion

Entities should support future growth.

For example,

Horse today stores profile information.

Tomorrow it may also store

* Vaccinations
* Veterinary records
* Diet
* Shoe history
* Competition history

without redesigning the system.

---

# 4. Business Domain

The Horse Riding Club consists of the following major business areas.

```
Horse Riding Club

│

├── Public Website

├── Students

├── Coaches

├── Horses

├── Trial Ride Booking

├── Attendance

├── Riding Progress

├── Facilities

├── Team

├── Testimonials

├── Club Locations

└── System Configuration
```

Each area contains one or more business entities.

---

# 5. Core Domain Entities

The system consists of the following primary entities.

| Entity        | Purpose                         |
| ------------- | ------------------------------- |
| Trial Booking | Visitor books a paid trial ride |
| Registration  | Visitor requests admission      |
| Student       | Approved rider                  |
| Coach         | Riding instructor               |
| Administrator | Club administrator              |
| Horse         | Horse profile                   |
| Attendance    | Daily attendance                |
| Progress      | Riding performance              |
| Facility      | Club services                   |
| Team Member   | Club staff                      |
| Testimonial   | Customer review                 |
| Location      | Club branches                   |
| Configuration | Business settings               |

These are the core entities of Version 1.0.

---

# 6. Entity Catalogue

## 6.1 Trial Booking

### Description

Represents a booking made by a visitor for a paid introductory riding session.

The booking exists even if the visitor never becomes a student.

---

### Business Purpose

Allows visitors to experience the riding club before enrolling.

---

### Created By

Visitor

---

### Managed By

Administrator

---

### Lifecycle

Created

↓

Confirmed

↓

Completed

or

Cancelled

---

### Future Extensions

* Online Payment
* Discount Coupons
* Waiting List
* Rescheduling
* Batch Allocation

---

# 6.2 Registration

### Description

Represents a request submitted by a visitor to become a club member.

---

### Created By

Visitor

---

### Managed By

Administrator

---

### Lifecycle

Submitted

↓

Pending Review

↓

Approved

or

Rejected

---

### Notes

Registration is different from Student.

Not every registration becomes a student.

---

### Future Extensions

* Medical Information
* Guardian Details
* Digital Documents
* Membership Plans

---

# 6.3 Student

### Description

Represents an approved club member.

A student participates in riding lessons and club activities.

---

### Created By

System

(Student record is created after registration approval.)

---

### Managed By

Administrator

Coach

---

### Responsibilities

Stores

* Personal Information
* Attendance
* Progress
* Fees
* Batch Allocation
* Event Participation

---

### Future Extensions

* Certifications

* Competition Results

* Membership Renewal

* Insurance

* Emergency Medical Data

---

# 6.4 Coach

### Description

Represents an instructor responsible for training students.

---

### Created By

Administrator

---

### Responsibilities

* Attendance

* Progress Evaluation

* Coach Remarks

* Horse Assignment

---

### Authentication

Coach access is granted using configured mobile numbers.

Coach records are independent of application login.

---

### Future Extensions

* Availability Calendar

* Salary

* Certifications

* Training Schedule

---

# 6.5 Administrator

### Description

Represents a club administrator.

---

### Responsibilities

Responsible for managing the complete application.

Including

* Trial Bookings

* Registrations

* Students

* Coaches

* Horses

* Facilities

* Website

* Configuration

---

### Authentication

Administrator access is granted using configured administrator mobile numbers.

Administrator records are maintained separately from students.

---

### Future Extensions

* Multiple Administrators

* Department Assignment

* Activity Logs

---

# 6.6 Horse

### Description

Represents a horse owned or managed by the club.

---

### Responsibilities

Stores horse profile information.

---

### Examples

* Good Guy

* Evandor

* McQueen

* Whiskey

* Deimus

---

### Future Extensions

Horse may later contain

* Medical History

* Vaccination

* Feeding Schedule

* Shoe Records

* Competition Results

* Retirement Status

* Training History

---

# 6.7 Attendance

### Description

Represents the attendance of a student for a riding session.

---

### Created By

Coach

---

### Managed By

Coach

Administrator

---

### Values

Present

Absent

---

### Future Extensions

* Late Arrival

* Excused Absence

* Holiday

* Cancelled Session

---

# 6.8 Riding Progress

### Description

Represents the learning journey of a student.

---

### Responsibilities

Stores

* Skill Level

* Coach Remarks

* Achievements

* Milestones

---

### Future Extensions

* Video Assessment

* Competition Readiness

* Badge System

* Skill Matrix

---

# 6.9 Facility

### Description

Represents a service offered by the riding club.

---

### Initial Facilities

Horse Riding Lessons

Horse Training

Horse Livery

Horse Lease

---

### Managed By

Administrator

---

### Future Extensions

Unlimited facilities may be added without changing application architecture.

---

# 6.10 Team Member

### Description

Represents a person working at the club.

---

### Examples

Founder

Head Coach

Assistant Coach

Stable Manager

Support Staff

---

### Future Extensions

* Certifications

* Awards

* Social Links

---

# 6.11 Testimonial

### Description

Represents customer feedback.

---

### Managed By

Administrator

---

### Purpose

Displays public trust in the club.

---

### Future Extensions

* Images

* Videos

* Google Review Integration

---

# 6.12 Club Location

### Description

Represents a physical riding club location.

---

### Initial Locations

Noida

New Delhi

---

### Responsibilities

Stores

* Address

* Phone

* Google Maps Link

* Operating Hours

---

### Future Extensions

Unlimited branches.

---

# 6.13 Configuration

### Description

Stores configurable business settings.

This entity replaces hardcoded values throughout the application.

---

### Examples

Trial Fee

Trial Days

Trial Timings

Slot Capacity

Administrator Numbers

Coach Numbers

Club Contact Details

---

### Benefits

Business changes can be made without application deployment.

---

# 7. Aggregate Roots

The following entities are considered Aggregate Roots within the domain.

```
Trial Booking

Registration

Student

Horse

Facility

Configuration
```

Every other entity belongs to or references one of these roots.

---

# 8. Domain Boundaries

The project is divided into the following bounded domains.

```
Public Website Domain

Booking Domain

Registration Domain

Student Domain

Training Domain

Horse Domain

Administration Domain

Configuration Domain
```

Each domain is independent and communicates only through well-defined services.

---

# 9. Part 1 Summary

This section has established:

* The business philosophy.
* Domain design principles.
* Business boundaries.
* Core entities.
* Responsibilities of each entity.
* Future expansion strategy.

These entities are now considered stable and will be used directly to design the PostgreSQL database, SQLAlchemy models, REST APIs and React Native screens.

The next part of this document will define:

* Entity Relationships
* Parent–Child Ownership
* Cardinality (1:1, 1:N, N:N)
* Entity Lifecycles
* State Transition Diagrams
* Ownership Rules

These definitions will complete the logical domain model before database design begins.

---

**End of Part 1**
# Horse Riding Club Management System

# 05_Domain_Model.md

## Part 2 — Entity Relationships, Ownership & Lifecycles

**Version:** 1.0

---

# 10. Purpose

This section defines the relationships between every business entity within the Horse Riding Club Management System.

Once approved, these relationships become the official contract for:

* PostgreSQL Foreign Keys
* SQLAlchemy Relationships
* API Design
* Dashboard Design
* Reports
* Business Logic

No database tables should be designed before this document is frozen.

---

# 11. Relationship Principles

The following principles shall govern every relationship in the system.

## Single Source of Truth

Each business object shall have one authoritative owner.

Example:

A student's attendance belongs to the Student domain.

It should never be duplicated elsewhere.

---

## Parent Owns Child

A child entity cannot exist without its parent unless explicitly stated.

Examples:

Student

↓

Attendance

Attendance cannot exist without a student.

---

## References Instead of Duplication

Whenever possible, entities shall reference one another instead of storing duplicate information.

Example

Attendance references Student.

Attendance does not duplicate student details.

---

## Future Compatibility

Relationships should support future modules without redesign.

---

# 12. Domain Relationship Diagram

```text
Horse Riding Club

│

├── Configuration
│
├── Trial Booking
│
├── Registration
│      │
│      ▼
│   Student
│      │
│      ├──────── Attendance
│      │
│      ├──────── Riding Progress
│      │
│      ├──────── Batch
│      │
│      └──────── Event Participation (Future)
│
├── Coach
│      │
│      ├──────── Batch
│      │
│      └──────── Attendance
│
├── Horse
│      │
│      └──────── Horse Assignment (Future)
│
├── Facility
│
├── Team Member
│
├── Testimonial
│
└── Club Location
```

---

# 13. Entity Relationships

---

## Configuration

Configuration is an independent root entity.

Relationships

Configuration

↓

Controls

* Trial Booking
* Administrator Access
* Coach Access
* Contact Information
* Trial Pricing
* Slot Capacity

Relationship Type

One Configuration

↓

Many Configuration Items

---

## Trial Booking

Relationships

Trial Booking

↓

Visitor

(Logical Relationship)

Trial Booking

↓

Configuration

Trial Days

Trial Timings

Pricing

Relationship

Many Trial Bookings

↓

One Configuration

---

## Registration

Relationships

Registration

↓

Student

Relationship

One Registration

↓

Zero or One Student

Explanation

A registration may be rejected.

Only approved registrations become students.

---

## Student

Student is one of the primary aggregate roots.

Relationships

Student

↓

Attendance

One Student

↓

Many Attendance Records

---

Student

↓

Progress

One Student

↓

Many Progress Records

---

Student

↓

Batch

Many Students

↓

One Batch

---

Student

↓

Registration

One Student

↓

One Registration

---

Student

↓

Coach

Many Students

↓

One Coach

(Current Version)

Future

Many-to-Many

Multiple Coaches

---

# 14. Batch Entity

The Batch entity groups students attending the same riding session.

Examples

Morning Beginners

Morning Intermediate

Evening Beginners

Weekend Riders

---

Relationships

Batch

↓

Students

One Batch

↓

Many Students

---

Coach

↓

Batch

One Coach

↓

Many Batches

---

Attendance

↓

Batch

Many Attendance Records

↓

One Batch

---

Benefits

Supports

* Attendance
* Timetable
* Coach Assignment
* Capacity Planning
* Future Scheduling

---

# 15. Coach

Relationships

Coach

↓

Students

One Coach

↓

Many Students

---

Coach

↓

Attendance

One Coach

↓

Many Attendance Records

---

Coach

↓

Progress

One Coach

↓

Many Progress Records

---

Coach

↓

Batch

One Coach

↓

Many Batches

---

# 16. Attendance

Attendance represents one riding session for one student.

Relationships

Attendance

↓

Student

Many Attendance Records

↓

One Student

---

Attendance

↓

Coach

Many Attendance Records

↓

One Coach

---

Attendance

↓

Batch

Many Attendance Records

↓

One Batch

---

Attendance

↓

Horse

Optional

(Current Version)

Future Assignment

---

# 17. Riding Progress

Progress represents continuous evaluation.

Relationships

Progress

↓

Student

Many

↓

One

---

Progress

↓

Coach

Many

↓

One

---

Progress

↓

Horse

Optional

Future

Training Horse

---

# 18. Horse

Relationships

Horse

↓

Student

Future

Many-to-Many

---

Explanation

A student may ride several horses.

A horse trains many students.

A junction table will manage this relationship.

---

Horse

↓

Coach

Future

Many-to-Many

---

Horse

↓

Medical Records

Future

One Horse

↓

Many Medical Records

---

Horse

↓

Competitions

Future

One Horse

↓

Many Competitions

---

# 19. Facility

Facilities remain independent.

Relationships

None

Reason

Facilities are informational content.

Future

Booking

Pricing

Availability

---

# 20. Team Member

Relationships

Team Members remain independent.

Future

Certification

Awards

Departments

---

# 21. Testimonial

Relationships

None

Future

Student

↓

Testimonial

One Student

↓

Many Testimonials

(Currently optional)

---

# 22. Club Location

Relationships

Location

↓

Facilities

Future

One Location

↓

Many Facilities

---

Location

↓

Coaches

Future

One Location

↓

Many Coaches

---

Location

↓

Students

Future

One Location

↓

Many Students

---

# 23. Aggregate Ownership

The following entities own their respective child entities.

| Parent        | Child                    |
| ------------- | ------------------------ |
| Registration  | Student                  |
| Student       | Attendance               |
| Student       | Progress                 |
| Batch         | Student                  |
| Coach         | Attendance               |
| Coach         | Progress                 |
| Configuration | Trial Settings           |
| Horse         | Medical Records (Future) |

---

# 24. Entity Cardinality

| Parent       | Child            | Cardinality |
| ------------ | ---------------- | ----------- |
| Registration | Student          | 1 : 0..1    |
| Student      | Attendance       | 1 : N       |
| Student      | Progress         | 1 : N       |
| Coach        | Student          | 1 : N       |
| Coach        | Batch            | 1 : N       |
| Batch        | Student          | 1 : N       |
| Batch        | Attendance       | 1 : N       |
| Student      | Registration     | 1 : 1       |
| Student      | Horse (Future)   | N : N       |
| Horse        | Student (Future) | N : N       |

---

# 25. Entity Lifecycles

---

## Trial Booking

```text
Created

↓

Confirmed

↓

Completed

↓

Archived
```

Alternative

```text
Created

↓

Cancelled
```

---

## Registration

```text
Submitted

↓

Pending Review

↓

Approved

↓

Student Created
```

Alternative

```text
Submitted

↓

Rejected
```

---

## Student

```text
Created

↓

Active

↓

Inactive

↓

Archived
```

---

## Attendance

```text
Created

↓

Marked

↓

Locked
```

Locked attendance cannot be modified without administrator approval.

---

## Progress

```text
Created

↓

Updated

↓

Historical Record
```

Progress should never be deleted.

Historical evaluations remain available.

---

# 26. Deletion Strategy

Business entities should rarely be physically deleted.

Preferred strategy

Soft Delete

Entities should contain

* Active
* Inactive
* Archived

instead of permanent deletion.

Benefits

* Reporting
* Auditing
* Historical data
* Regulatory compliance

---

# 27. Domain Integrity Rules

The following rules are mandatory.

A student cannot exist without an approved registration.

Attendance cannot exist without a student.

Attendance must belong to exactly one batch.

Progress must belong to exactly one student.

Every batch must have one assigned coach.

Administrator numbers must exist in configuration.

Coach numbers must exist in configuration.

Trial bookings must reference active trial schedules.

No booking shall exceed configured slot capacity.

---

# 28. Part 2 Summary

This section has frozen:

* Parent-child ownership
* Entity relationships
* Cardinality
* Aggregate ownership
* Lifecycle states
* Domain integrity rules
* Deletion strategy

These definitions will be used directly while designing PostgreSQL tables and SQLAlchemy relationships.

The next section (Part 3) will define:

* Business Rules
* Validation Rules
* State Machines
* Domain Services
* Event Flows
* Transaction Boundaries

This will complete the logical domain model before database schema design begins.

---

**End of Part 2**
# Horse Riding Club Management System

# 05_Domain_Model.md

## Part 3A — Business Rules, Validation Rules & Business Invariants

**Version:** 1.0

---

# 29. Purpose

This document defines the business rules governing the Horse Riding Club Management System.

Business rules describe **how the club operates**, independent of the software implementation.

Every backend service, database constraint, API validation and frontend validation shall comply with these rules.

These rules represent Version 1.0 of the club's operating policy.

---

# 30. Business Rule Categories

The rules are organized into the following categories:

* General Rules
* Trial Booking Rules
* Registration Rules
* Student Rules
* Coach Rules
* Attendance Rules
* Riding Progress Rules
* Horse Rules
* Facility Rules
* Configuration Rules
* Contact & Location Rules
* Data Integrity Rules

---

# 31. General Business Rules

### BR-001

Every mobile number within the system shall be unique.

A mobile number cannot belong to:

* Two students
* Two coaches
* Two administrators

---

### BR-002

Every business entity shall have a unique system-generated identifier.

These identifiers remain unchanged throughout the lifetime of the record.

---

### BR-003

Only active records shall participate in business operations.

Inactive or archived records remain available for historical reporting.

---

### BR-004

Business configuration shall always override hardcoded values.

Example:

Trial fee

↓

Configuration

↓

Application

---

### BR-005

Dates and times shall be stored in a standardized format.

The user interface may display localized formats.

---

# 32. Trial Booking Rules

### BR-006

A visitor may book one or more trial seats, subject to slot availability.

---

### BR-007

Bookings shall only be accepted for administrator-configured trial days.

---

### BR-008

Bookings shall only be accepted for administrator-configured time slots.

---

### BR-009

The booking capacity of a slot shall never exceed its configured limit.

Default

2 riders per slot.

---

### BR-010

The total number of riders booked for a slot shall include every booking associated with that slot.

Example

Booking A

1 rider

Booking B

1 rider

↓

Slot Full

---

### BR-011

If a requested slot is full, the booking shall be rejected.

---

### BR-012

The booking amount shall equal:

Number of Riders × Trial Fee

The trial fee is obtained from the Configuration entity.

---

### BR-013

A booking confirmation number shall be generated for every successful booking.

---

### BR-014

Cancelled bookings immediately release their reserved seats.

---

### BR-015

Completed bookings remain permanently available for historical reporting.

---

# 33. Registration Rules

### BR-016

A visitor must complete the registration form before becoming a student.

---

### BR-017

Every registration begins in the **Pending** state.

---

### BR-018

Only an administrator may approve or reject a registration.

---

### BR-019

Approving a registration automatically creates a Student record.

---

### BR-020

Rejecting a registration does not create a Student record.

---

### BR-021

A mobile number with an active student account cannot submit another registration.

---

### BR-022

Pending registrations may be edited by an administrator before approval.

---

# 34. Student Rules

### BR-023

Every student originates from exactly one approved registration.

---

### BR-024

Every student belongs to one active training batch.

---

### BR-025

Every student shall have one assigned primary coach.

Future versions may support multiple coaches.

---

### BR-026

A student's dashboard shall only display information related to that student.

---

### BR-027

Students may update only administrator-approved profile fields.

Critical identity fields remain administrator-controlled.

---

# 35. Coach Rules

### BR-028

Every coach shall have a unique mobile number.

---

### BR-029

Only active coaches may be assigned to batches.

---

### BR-030

A coach may manage multiple batches.

---

### BR-031

Coach remarks become immediately visible to administrators.

Student visibility of remarks may be configurable in future versions.

---

# 36. Attendance Rules

### BR-032

Attendance may only be recorded for active students.

---

### BR-033

Attendance shall always reference:

* Student
* Coach
* Batch
* Attendance Date

---

### BR-034

Only one attendance record shall exist for a student on a specific training session.

Duplicate attendance records are not permitted.

---

### BR-035

Attendance values:

* Present
* Absent

Future values may include:

* Late
* Excused
* Holiday

---

### BR-036

Attendance modifications shall be recorded in the audit trail.

---

# 37. Riding Progress Rules

### BR-037

Progress records represent historical evaluations.

They shall never be physically deleted.

---

### BR-038

Each progress evaluation belongs to:

* One student
* One coach

---

### BR-039

A new evaluation creates a new historical record rather than overwriting previous evaluations.

---

### BR-040

Progress history shall remain available for reporting.

---

# 38. Horse Rules

### BR-041

Every horse shall have a unique name within the club.

---

### BR-042

Horse profile information shall remain editable by administrators.

---

### BR-043

Inactive horses shall not appear in riding assignments.

---

### BR-044

Historical horse records shall never be removed permanently.

---

# 39. Facility Rules

### BR-045

Facilities represent services offered by the club.

---

### BR-046

Facilities may be activated or deactivated.

---

### BR-047

Inactive facilities shall not appear on the public website.

---

# 40. Team Rules

### BR-048

Only active team members shall appear on the website.

---

### BR-049

Display order shall be administrator configurable.

---

# 41. Testimonial Rules

### BR-050

Testimonials require administrator approval before publication.

---

### BR-051

Hidden testimonials remain available within the administrator dashboard.

---

# 42. Club Location Rules

### BR-052

Every location shall contain:

* Name
* Address
* Contact Number
* Google Maps URL

---

### BR-053

Inactive locations shall not appear on the public website.

---

# 43. Configuration Rules

### BR-054

Configuration values shall become effective immediately after being saved.

---

### BR-055

Application restart shall not be required for configuration changes.

---

### BR-056

Configuration changes shall be recorded in the audit log.

---

# 44. Validation Rules

## Mobile Number

* Mandatory
* Numeric
* Unique
* Valid Indian mobile number format

---

## Name

* Mandatory
* Maximum length configurable
* Leading and trailing spaces removed

---

## Email

* Optional
* Must follow valid email format when supplied

---

## Date

* Valid calendar date
* Booking date cannot reference disabled trial days

---

## Trial Slot

* Must exist
* Must be active
* Must have remaining capacity

---

## Number of Riders

* Minimum: 1
* Maximum: Configurable

---

## Batch

* Must exist
* Must be active

---

## Coach

* Must exist
* Must be active

---

## Student

* Must be active

---

# 45. Business Invariants

The following conditions must always remain true.

### INV-001

A student cannot exist without an approved registration.

---

### INV-002

Attendance cannot exist without a student.

---

### INV-003

Attendance cannot exist without a coach.

---

### INV-004

Attendance cannot exist without a batch.

---

### INV-005

Every batch must have one assigned coach.

---

### INV-006

Every booking references exactly one configured trial slot.

---

### INV-007

Slot capacity shall never be exceeded.

---

### INV-008

Only active facilities appear publicly.

---

### INV-009

Only active horses are available for future assignments.

---

### INV-010

Administrator access is granted only to active administrator records.

---

### INV-011

Coach access is granted only to active coach records.

---

### INV-012

Student dashboard access is granted only to active students.

---

# 46. Error Handling Principles

Business rule violations shall return meaningful messages.

Examples:

* Trial slot is fully booked.
* Mobile number is already registered.
* Registration is awaiting approval.
* Student is inactive.
* Coach is inactive.
* Selected batch does not exist.
* Invalid trial date.

Internal implementation details shall never be exposed to end users.

---

# 47. Part 3A Summary

This section defines the operational rules that govern the Horse Riding Club Management System.

These rules are implementation-independent and shall be enforced consistently across:

* Database constraints
* Backend services
* REST APIs
* React Native validation
* Administrative workflows
* Automated test cases

No implementation should bypass these business rules.

---

**End of Part 3A**
