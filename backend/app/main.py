import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.settings import get_settings
from app.middleware.middleware import LoggingMiddleware, ExceptionMiddleware
from app.api.routers import (
    auth_router, public_router, booking_router, reg_router,
    student_router, coach_router, attendance_router, admin_router,
    horse_router, facility_router,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

settings = get_settings()

app = FastAPI(
    title="Horse Riding Club Management System",
    version="1.0.0",
    description="API for Horse Riding Club — trial bookings, registrations, dashboards",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(ExceptionMiddleware)
app.add_middleware(LoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for static file serving
uploads_path = os.path.abspath(settings.UPLOAD_PATH)
os.makedirs(uploads_path, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")

# Register all routers
for router in [auth_router, public_router, booking_router, reg_router, student_router, coach_router, attendance_router, admin_router, horse_router, facility_router]:
    app.include_router(router)


@app.get("/")
def root():
    return {"message": "Horse Riding Club API", "docs": "/docs", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
