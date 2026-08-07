"""Upsert ATTENDANCE/DASHBOARD_MONTHS into live DB."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from dotenv import load_dotenv
load_dotenv()
import sqlalchemy as sa

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/horse_riding_club")
engine = sa.create_engine(DATABASE_URL)

with engine.begin() as conn:
    result = conn.execute(sa.text("""
        INSERT INTO configuration (category, config_key, integer_value, description, display_order)
        VALUES (
            'ATTENDANCE', 'DASHBOARD_MONTHS', 2,
            'Number of past months of attendance records to display on the Coach Dashboard and Admin Dashboard. E.g. 2 = show current month + previous month.',
            1
        )
        ON CONFLICT (category, config_key) DO UPDATE
            SET integer_value = EXCLUDED.integer_value,
                description   = EXCLUDED.description,
                updated_at    = NOW()
    """))
    print(f"Done. rowcount={result.rowcount}")
