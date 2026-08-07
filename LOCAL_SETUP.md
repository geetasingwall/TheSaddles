# Local Setup Guide (No Docker)

## Prerequisites

Install these before starting:

1. **PostgreSQL 16+** — https://www.postgresql.org/download/windows/
   - During install, set password for `postgres` user (remember it)
   - Default port: `5432` (keep as-is)

2. **Python 3.13+** — https://www.python.org/downloads/
   - ✅ Check **"Add Python to PATH"** during install

3. **Node.js 20+** — https://nodejs.org/
   - Download the LTS version

---

## Step 1 — Create the Database

Open **pgAdmin** (installed with PostgreSQL) or **psql** from Start Menu.

### Using psql:
```
psql -U postgres
```
Then run:
```sql
CREATE DATABASE horse_riding_club;
\q
```

### Load the schema and seed data:
```
psql -U postgres -d horse_riding_club -f database/schema/init.sql
```

> Run this from the `CLUB/` root folder. It creates all 15 tables and inserts seed data including the default admin (mobile: `9999999999`).

---

## Step 2 — Backend Setup

Open a terminal in the `CLUB/` root folder.

```bash
cd backend
```

### Create and activate a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate
```

> Your prompt should now show `(venv)`.

### Install dependencies:
```bash
pip install -r requirements.txt
```

### Configure environment:
```bash
copy .env.example .env
```

Open `.env` and update `DATABASE_URL` with your PostgreSQL password:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/horse_riding_club
UPLOAD_PATH=./app/uploads
ALLOWED_ORIGINS=http://localhost:5173
SERVER_PORT=8000
DEBUG_MODE=true
```

### Start the backend:
```bash
uvicorn app.main:app --reload --port 8000
```

✅ Backend running at: http://localhost:8000  
✅ Swagger UI at: http://localhost:8000/docs

---

## Step 3 — Frontend Setup

Open a **new terminal** in the `CLUB/` root folder.

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at: http://localhost:5173

---

## Step 4 — Login

Go to http://localhost:5173 and click **Login**.

| Mobile Number | Access |
|--------------|--------|
| `9999999999` | Admin Dashboard |

---

## Running Again Later

You only need Steps 2 and 3 each time. The database persists.

**Terminal 1 — Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

---

## Troubleshooting

**`psql` not found** — Add PostgreSQL `bin` folder to PATH:
`C:\Program Files\PostgreSQL\16\bin`

**`pip` not found** — Reinstall Python and check "Add to PATH".

**Port already in use** — Change port: `uvicorn app.main:app --reload --port 8001`

**Database connection error** — Check your password in `.env` and that PostgreSQL service is running (search "Services" in Start Menu → find `postgresql-x64-16` → Start).
