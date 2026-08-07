"""Add lease_events column to horses table."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dotenv import load_dotenv
load_dotenv()
from sqlalchemy import create_engine, text

engine = create_engine(os.environ["DATABASE_URL"])
with engine.begin() as conn:
    conn.execute(text("ALTER TABLE horses ADD COLUMN IF NOT EXISTS lease_events TEXT"))
    print("Done.")
