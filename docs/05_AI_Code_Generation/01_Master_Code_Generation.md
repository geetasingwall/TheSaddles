# Horse Riding Club System

# Master AI Code Generation Guide

Version: 1.0

---

# Purpose

This document is the **single entry point** for AI-assisted code generation.

Its objective is to orchestrate the complete development of the Horse Riding Club System from the project documentation.

The AI should use this document as the starting point and generate the application in a structured, production-ready manner.

---

# Project Objective

Generate a complete, production-ready Horse Riding Club System including:

- PostgreSQL Database
- FastAPI Backend
- React Frontend
- Docker Deployment
- Automated Testing

The generated application must be executable with minimal manual changes.

---

# Technology Stack

## Backend

- Python 3.12+
- FastAPI
- SQLAlchemy 2.x
- Alembic
- Pydantic v2
- PostgreSQL
- Uvicorn

---

## Frontend

- React
- TypeScript
- Vite
- Axios
- React Router
- React Hook Form
- Zod
- CSS Modules

---

## Database

- PostgreSQL 16+

---

## Deployment

- Docker
- Docker Compose
- Nginx

---

# AI Responsibilities

The AI is expected to generate:

✓ Complete application source code

✓ Database implementation

✓ API implementation

✓ Frontend implementation

✓ Tests

✓ Docker configuration

✓ Environment configuration

✓ Build scripts

✓ README files

No placeholders or pseudo code should be generated.

---

# Source Documents

The AI must read and understand the following folders in order.

---

# Step 1

Read:

```text
docs/

00_Project_Blueprint/
```

Purpose

Understand:

- Business requirements
- Functional requirements
- UI/UX expectations
- Domain model
- Overall architecture

This folder defines **what** is being built.

---

# Step 2

Read:

```text
docs/

01_Database_Design/
```

Purpose

Understand:

- Database architecture
- Table relationships
- Naming standards
- Database conventions

---

# Step 3

Read:

```text
database/schema/
```

Purpose

Treat the SQL schema as the authoritative database definition.

Do NOT invent new tables.

Do NOT rename columns.

Do NOT modify relationships unless explicitly required.

Generate:

- SQLAlchemy Models
- Alembic migrations
- Database initialization

directly from these SQL files.

---

# Step 4

Read:

```text
docs/

02_API_Specifications/
```

Purpose

Generate:

- FastAPI Routers
- Request Models
- Response Models
- Validation
- Authentication
- Business APIs

The API specifications are the source of truth.

Do not invent endpoints.

---

# Step 5

Read:

```text
docs/

03_Backend_Development/
```

Purpose

Generate:

- Project Structure
- SQLAlchemy Models
- Pydantic Schemas
- Repository Layer
- Service Layer
- API Routers
- Logging
- Exception Handling
- Authentication
- Response Format

Follow these documents strictly.

---

# Step 6

Read:

```text
docs/

04_Frontend_Development/
```

Purpose

Generate:

- React Project
- Routing
- Screens
- Components
- Theme
- Layout
- Navigation
- Forms

Reuse components wherever possible.

---

# Generation Order

The application should be generated in the following order.

---

## Phase 1

Database

Generate

```text
database/

schema/

migrations/

backups/
```

Complete Alembic support.

---

## Phase 2

Backend

Generate

```text
backend/

app/

main.py

database/

models/

schemas/

repositories/

services/

api/

middleware/

core/

utilities/

tests/
```

Every API defined in the specifications should be fully implemented.

---

## Phase 3

Frontend

Generate

```text
frontend/

src/

api/

assets/

components/

constants/

hooks/

layouts/

navigation/

screens/

services/

store/

styles/

types/

utils/

App.tsx

main.tsx
```

The frontend should consume the generated FastAPI APIs.

---

## Phase 4

Deployment

Generate

```text
docker-compose.yml

Dockerfile

Nginx Configuration

Production Scripts

Environment Files
```

---

## Phase 5

Testing

Generate

Backend Tests

Frontend Tests

API Tests

Integration Tests

---

# Coding Standards

Generate only production-quality code.

Avoid:

- TODO comments
- Placeholder methods
- Empty implementations
- Hardcoded values
- Duplicate code

---

# General Rules

## Database

Never change:

- Table names
- Column names
- Constraints

unless explicitly instructed.

---

## Backend

Follow:

FastAPI best practices

Dependency Injection

Repository Pattern

Service Layer

Pydantic Validation

Centralized Exception Handling

Structured Logging

---

## Frontend

Use:

Functional Components

TypeScript

Reusable Components

Responsive Design

Component-Based Architecture

---

# API Rules

Every endpoint should include:

Validation

Authentication (where applicable)

Error Handling

Response Models

OpenAPI Documentation

HTTP Status Codes

---

# Security

Implement:

JWT Authentication

Password Hashing

Input Validation

Role-Based Authorization

Secure Headers

Environment Variables

Never hardcode secrets.

---

# Logging

Generate centralized logging for:

Authentication

Errors

Requests

Business Events

---

# Configuration

Application configuration should be read from:

```text
.env
```

Support:

Development

Testing

Production

---

# Docker

The generated project must run using:

```bash
docker compose up --build
```

without requiring manual modifications.

---

# Build Verification

The AI should ensure:

Backend starts successfully.

Frontend builds successfully.

Database migrations execute successfully.

Application connects to PostgreSQL.

Swagger UI loads.

React application loads.

No compile errors exist.

---

# Deliverables

The final generated project should include:

✓ PostgreSQL Database

✓ Alembic

✓ FastAPI

✓ SQLAlchemy

✓ Pydantic

✓ React

✓ TypeScript

✓ Docker

✓ Docker Compose

✓ Nginx

✓ Unit Tests

✓ Integration Tests

✓ README

---

# Expected Result

Running the following commands should start the complete application:

## Database

```bash
docker compose up -d postgres
```

---

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Swagger UI should be available at:

```text
http://localhost:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Application should be available at:

```text
http://localhost:5173
```

---

## Full Stack

```bash
docker compose up --build
```

The entire application should start successfully.

---

# AI Completion Criteria

The task is complete only when:

- The backend starts without errors.
- The frontend compiles successfully.
- The database schema is created successfully.
- All APIs are functional.
- The frontend communicates correctly with the backend.
- Authentication is operational.
- All documented modules are implemented.
- No placeholder code remains.

---

# Final Instruction to the AI

Treat all project documentation as authoritative.

Do not redesign the application.

Do not rename database objects.

Do not introduce additional frameworks or libraries unless they are required to satisfy the documented architecture.

Generate a cohesive, production-ready application that faithfully implements the specifications contained in this repository.

The output should be immediately buildable, runnable, and suitable for further feature development.