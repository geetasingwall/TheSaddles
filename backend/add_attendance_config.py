"""Run once: cd backend && python add_attendance_config.py"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))

from app.database.connection import SessionLocal
from app.models.models import Configuration

db = SessionLocal()
try:
    existing = db.query(Configuration).filter(
        Configuration.category == "ATTENDANCE",
        Configuration.config_key == "DASHBOARD_MONTHS"
    ).first()
    if existing:
        print("ℹ️  Config already exists. Current value:", existing.integer_value)
    else:
        db.add(Configuration(
            category="ATTENDANCE",
            config_key="DASHBOARD_MONTHS",
            integer_value=2,
            description="Number of months of attendance to show on admin and coach dashboards.",
            display_order=1,
        ))
        db.commit()
        print("✅ ATTENDANCE/DASHBOARD_MONTHS config added (default: 2 months).")
finally:
    db.close()
