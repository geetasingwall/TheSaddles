# Horse Riding Club Management System

# Backend Architecture

Version: 1.0

---

# 1. Purpose

This document defines the backend architecture of the Horse Riding Club Management System.

It serves as the master reference for all backend development and ensures every developer or AI code generator follows the same architecture.

The objective is to produce a backend that is:

* Simple
* Modular
* Scalable
* Maintainable
* Production Ready

---

# 2. Technology Stack

## Backend

* Python 3.13+
* FastAPI

---

## ORM

* SQLAlchemy 2.x

---

## Database

* PostgreSQL 16+

---

## Database Migration

* Alembic

---

## Validation

* Pydantic V2

---

## Server

* Uvicorn

---

## API Documentation

Automatically generated using

* Swagger UI
* OpenAPI

---

# 3. Backend Architecture

The application follows a layered architecture.

```
Frontend
        │
        ▼
FastAPI Router
        │
        ▼
Service Layer
        │
        ▼
Repository Layer
        │
        ▼
SQLAlchemy Models
        │
        ▼
PostgreSQL
```

Each layer has exactly one responsibility.

---

# 4. Architecture Principles

The backend follows these principles.

## Principle 1

Business logic never exists inside API endpoints.

---

## Principle 2

Database queries never exist inside Services.

---

## Principle 3

Repositories only communicate with the database.

---

## Principle 4

Services communicate only with Repositories.

---

## Principle 5

Routers communicate only with Services.

---

## Principle 6

The frontend never communicates directly with PostgreSQL.

---

# 5. Layer Responsibilities

## API Layer

Responsibilities

* Receive HTTP requests
* Validate request body
* Call Services
* Return HTTP response

No business logic should exist here.

---

## Service Layer

Responsibilities

* Business rules
* Validation
* Decision making
* Workflow execution

Examples

* Register Student
* Book Trial Ride
* Approve Registration
* Mark Attendance
* Record Fee Payment

---

## Repository Layer

Responsibilities

* CRUD Operations
* SQL Queries
* Database Transactions

Repositories should never contain business rules.

---

## Model Layer

Responsibilities

* SQLAlchemy Models
* Relationships
* Table Mapping

No business logic.

---

# 6. Folder Structure

```
backend/

    app/

        api/

        services/

        repositories/

        models/

        schemas/

        database/

        core/

        utils/

        middleware/

        configuration/

        static/

        uploads/

    tests/

    alembic/

    requirements.txt

    main.py
```

---

# 7. Request Flow

```
Mobile App

↓

FastAPI Router

↓

Service

↓

Repository

↓

PostgreSQL

↓

Repository

↓

Service

↓

Router

↓

JSON Response
```

---

# 8. Module Breakdown

The backend will be divided into independent modules.

## Configuration

Handles

* Application Configuration
* System Configuration

---

## Trial Booking

Handles

* Trial Slot Availability
* Booking
* Booking Summary

---

## Registration

Handles

* Student Registration
* Registration Approval
* Registration Rejection

---

## Student

Handles

* Student Dashboard
* Student Information

---

## Coach

Handles

* Coach Dashboard
* Attendance

---

## Administrator

Handles

* Admin Dashboard
* Reports
* Configuration

---

## Attendance

Handles

* Daily Attendance
* Attendance Reports

---

## Fee Management

Handles

* Payment Entry
* Payment History
* Outstanding Fees

---

## Student Progress

Handles

* Coach Assessments
* Progress Timeline

---

## Horses

Handles

* Horse Information
* Lesson Availability

---

## Facilities

Handles

* Website Facilities

---

## Team

Handles

* Team Members

---

## Testimonials

Handles

* Website Testimonials

---

## Locations

Handles

* Club Branches

---

# 9. Database Connection

A single PostgreSQL connection pool will be used.

SQLAlchemy Session Factory will manage sessions.

Every request receives:

* One Database Session

The session is automatically closed after the request.

---

# 10. Error Handling

Errors should never expose internal implementation details.

Every API returns a standard JSON response.

Example

```
{
    "success": false,
    "message": "Registration not found."
}
```

---

# 11. Logging

The backend will log

* Application Startup
* Errors
* Warnings
* API Requests
* API Responses
* Database Errors

Logs should never store sensitive information.

---

# 12. File Uploads

Uploaded files are stored on the server.

Examples

```
uploads/

    horses/

    team/

    testimonials/

    facilities/
```

The database stores only the relative file path.

---

# 13. Authentication Strategy

The system intentionally avoids traditional username/password authentication.

Dashboard selection is based on the entered mobile number.

Application flow:

* If the mobile number belongs to an Administrator → Administrator Dashboard
* If the mobile number belongs to a Coach → Coach Dashboard
* If the mobile number belongs to an approved Student → Student Dashboard
* Otherwise → Public Website

The backend validates the mobile number against the appropriate database tables and routes the user accordingly.

---

# 14. API Design Principles

All APIs

* RESTful
* JSON Based
* Stateless

HTTP Methods

GET

POST

PUT

DELETE

PATCH

will be used appropriately.

---

# 15. Validation

Validation is performed using Pydantic.

Examples

* Required Fields
* Phone Number Format
* Date Validation
* Numeric Validation

Validation occurs before business logic execution.

---

# 16. Configuration Management

Application settings will be loaded from

```
.env
```

Examples

* Database URL
* Upload Path
* Allowed Origins
* Server Port
* Debug Mode

No hardcoded configuration values are permitted in the application.

---

# 17. Performance Considerations

The backend should:

* Use database indexes effectively.
* Avoid unnecessary database queries.
* Retrieve only required columns where appropriate.
* Support pagination for list endpoints.
* Minimize duplicate business logic.

---

# 18. Coding Standards

* Follow PEP 8.
* Use type hints throughout the project.
* Prefer dependency injection over global objects.
* Keep functions focused on a single responsibility.
* Avoid code duplication.
* Use meaningful class, method, and variable names.

---

# 19. Future Expansion

The architecture should allow future modules such as:

* Online Fee Payments
* WhatsApp Notifications
* SMS Notifications
* Email Notifications
* Push Notifications
* Event Management
* Horse Show Registration
* Online Merchandise
* Multiple Club Branches

These additions should not require changes to the core architecture.

---

# 20. Architecture Summary

```
React Native (Android)

React Native (iOS)

React Web

            │

            ▼

        FastAPI

            │

            ▼

      Service Layer

            │

            ▼

    Repository Layer

            │

            ▼

    SQLAlchemy Models

            │

            ▼

      PostgreSQL 16+
```

---

# Conclusion

This architecture establishes a clear separation of concerns between presentation, business logic, data access, and persistence. It is intentionally designed to remain simple while supporting future enhancements without major structural changes.

All subsequent backend documents, generated code, and implementation artifacts must conform to the architectural principles defined in this specification.
