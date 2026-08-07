"""
Run this once to add missing columns to the horses table.
Usage: python database/migrations/add_horse_columns.py
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', 'backend', '.env'))

engine = create_engine(os.environ['DATABASE_URL'])

statements = [
    "ALTER TABLE horses ADD COLUMN IF NOT EXISTS lease_events TEXT;",
    "ALTER TABLE horses ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;",
]

with engine.connect() as conn:
    for stmt in statements:
        conn.execute(text(stmt))
        print(f"OK: {stmt}")
    conn.commit()

print("Done.")
