import sqlite3, os, secrets
from datetime import datetime

DB_PATH = os.getenv("DB_PATH", "scenescript.db")

def get_conn():
    return sqlite3.connect(DB_PATH)

def init_db():
    with get_conn() as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS api_keys
            (key TEXT PRIMARY KEY, email TEXT, created_at TEXT, is_active INTEGER DEFAULT 1)""")
        conn.execute("""CREATE TABLE IF NOT EXISTS usage_logs
            (id INTEGER PRIMARY KEY AUTOINCREMENT, api_key TEXT, label TEXT,
             latency_ms REAL, timestamp TEXT)""")
        conn.execute(
            "INSERT OR IGNORE INTO api_keys (key, email, created_at) VALUES (?, ?, ?)",
            ("dev-key-scenescript-2024", "dev@scenescript.ai", datetime.utcnow().isoformat())
        )
        conn.commit()

def is_valid_key(key):
    with get_conn() as conn:
        row = conn.execute(
            "SELECT key FROM api_keys WHERE key=? AND is_active=1", (key,)
        ).fetchone()
    return row is not None

def log_request(api_key, label, latency_ms):
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO usage_logs (api_key, label, latency_ms, timestamp) VALUES (?,?,?,?)",
            (api_key, label, latency_ms, datetime.utcnow().isoformat())
        )
        conn.commit()

def generate_key(email):
    key = "sk-" + secrets.token_urlsafe(32)
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO api_keys (key, email, created_at) VALUES (?,?,?)",
            (key, email, datetime.utcnow().isoformat())
        )
        conn.commit()
    return key

init_db()
