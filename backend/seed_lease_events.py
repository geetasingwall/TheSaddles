"""Upsert HORSES/LEASE_EVENTS configuration row."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dotenv import load_dotenv
load_dotenv()
from sqlalchemy import create_engine, text
import json

engine = create_engine(os.environ["DATABASE_URL"])
default_events = json.dumps(["Show Jumping", "Hacks", "Dressage", "Cross Country", "Endurance"])

with engine.begin() as conn:
    result = conn.execute(text("""
        INSERT INTO configuration (id, category, config_key, json_value, description, is_active, display_order, created_at)
        VALUES (gen_random_uuid(), 'HORSES', 'LEASE_EVENTS', CAST(:val AS jsonb), :desc, true, 1, now())
        ON CONFLICT (category, config_key) DO UPDATE
          SET json_value = CAST(:val AS jsonb),
              description = :desc,
              updated_at = now()
    """), {"val": default_events, "desc": "List of events a horse can be leased for. Edit as a JSON array of strings."})
    print(f"Done. rowcount={result.rowcount}")
