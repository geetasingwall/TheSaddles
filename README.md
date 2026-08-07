# Horse Riding Club Management System

A full-stack digital platform for managing horse riding club operations.

## Quick Start

### Full Stack (Docker)
```bash
docker compose up --build
```
- Frontend: http://localhost:80
- Backend API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

### Backend (Local)
```bash
cd backend
pip install -r requirements.txt
# Copy .env.example to .env and configure DATABASE_URL
uvicorn app.main:app --reload
```

### Frontend (Local)
```bash
cd frontend
npm install
npm run dev
```
App: http://localhost:5173

### Database Only
```bash
docker compose up -d postgres
# Then run: psql -U postgres -d horse_riding_club -f database/schema/init.sql
```

## Default Login
- Admin mobile: `9999999999`

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite |
| Styling | CSS Modules |
| HTTP | Axios |
| Forms | React Hook Form + Zod |
| Backend | Python 3.13 + FastAPI |
| ORM | SQLAlchemy 2.x |
| Validation | Pydantic V2 |
| Database | PostgreSQL 16+ |
| Migrations | Alembic |
| Container | Docker + Nginx |

## Project Structure
```
CLUB/
├── backend/          # FastAPI application
│   └── app/
│       ├── api/      # Routers
│       ├── services/ # Business logic
│       ├── repositories/ # DB queries
│       ├── models/   # SQLAlchemy models
│       ├── schemas/  # Pydantic schemas
│       └── main.py
├── frontend/         # React application
│   └── src/
│       ├── api/      # Axios calls
│       ├── screens/  # Feature screens
│       ├── components/ # Reusable UI
│       └── store/    # Global state
├── database/
│   └── schema/init.sql  # All 15 tables
└── docker-compose.yml
```

## API Documentation
Swagger UI available at `/docs` when backend is running.

## Access Model
| Mobile Number | Dashboard |
|--------------|-----------|
| Admin number | Admin Dashboard |
| Coach number | Coach Dashboard |
| Approved student | Student Dashboard |
| Pending registration | Awaiting Approval |
| Unknown | Register invitation |
