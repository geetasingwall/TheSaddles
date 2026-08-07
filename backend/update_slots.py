"""Run once to update trial time slots: cd backend && python update_slots.py"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))

from app.database.connection import SessionLocal

SLOTS = [
    {"day": "Monday",    "start": "17:30", "end": "18:00", "capacity": 2},
    {"day": "Monday",    "start": "18:00", "end": "18:30", "capacity": 2},
    {"day": "Monday",    "start": "18:30", "end": "19:00", "capacity": 2},
    {"day": "Tuesday",   "start": "17:30", "end": "18:00", "capacity": 2},
    {"day": "Tuesday",   "start": "18:00", "end": "18:30", "capacity": 2},
    {"day": "Tuesday",   "start": "18:30", "end": "19:00", "capacity": 2},
    {"day": "Wednesday", "start": "17:30", "end": "18:00", "capacity": 2},
    {"day": "Wednesday", "start": "18:00", "end": "18:30", "capacity": 2},
    {"day": "Wednesday", "start": "18:30", "end": "19:00", "capacity": 2},
    {"day": "Thursday",  "start": "17:30", "end": "18:00", "capacity": 2},
    {"day": "Thursday",  "start": "18:00", "end": "18:30", "capacity": 2},
    {"day": "Thursday",  "start": "18:30", "end": "19:00", "capacity": 2},
    {"day": "Friday",    "start": "17:30", "end": "18:00", "capacity": 2},
    {"day": "Friday",    "start": "18:00", "end": "18:30", "capacity": 2},
    {"day": "Friday",    "start": "18:30", "end": "19:00", "capacity": 2},
    {"day": "Saturday",  "start": "17:30", "end": "18:00", "capacity": 2},
    {"day": "Saturday",  "start": "18:00", "end": "18:30", "capacity": 2},
    {"day": "Saturday",  "start": "18:30", "end": "19:00", "capacity": 2},
    {"day": "Sunday",    "start": "07:00", "end": "07:30", "capacity": 2},
    {"day": "Sunday",    "start": "07:30", "end": "08:00", "capacity": 2},
]

db = SessionLocal()
try:
    from app.models.models import Configuration
    config = db.query(Configuration).filter(
        Configuration.category == "TRIAL",
        Configuration.config_key == "TRIAL_TIME_SLOTS"
    ).first()
    if config:
        config.string_value = json.dumps(SLOTS)
        config.json_value = None
        db.commit()
        print("✅ Trial slots updated successfully.")
        print(f"   {len(SLOTS)} slots configured (Mon–Sat evening × 3, Sunday morning × 2)")
    else:
        print("❌ TRIAL_TIME_SLOTS config row not found.")
finally:
    db.close()
