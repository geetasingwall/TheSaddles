"""
Run from backend/ directory:
  python seed_social_config.py
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
engine = create_engine(os.environ["DATABASE_URL"])

rows = [
    ("SOCIAL", "INSTAGRAM_URL", "https://instagram.com", "Instagram profile URL"),
    ("SOCIAL", "FACEBOOK_URL",  "https://facebook.com",  "Facebook page URL"),
    ("SOCIAL", "TWITTER_URL",   "",                       "Twitter / X profile URL (leave blank to hide)"),
    ("SOCIAL", "YOUTUBE_URL",   "",                       "YouTube channel URL (leave blank to hide)"),
    ("SOCIAL", "WHATSAPP_NUMBER", "",                     "WhatsApp number for chat link (digits only)"),
]

with engine.begin() as conn:
    for category, key, value, desc in rows:
        conn.execute(text("""
            INSERT INTO configuration (category, config_key, string_value, description, is_active, display_order)
            VALUES (:cat, :key, :val, :desc, true, 1)
            ON CONFLICT (category, config_key) DO NOTHING
        """), {"cat": category, "key": key, "val": value, "desc": desc})
    print("Social config keys seeded.")
