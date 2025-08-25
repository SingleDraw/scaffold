import os
import json
from app.config import settings  # import settings object

SINK_DIR = settings.sink_dir
LOG_FILE = os.path.join(SINK_DIR, "debug.log")

# Ensure sink directory exists
os.makedirs(SINK_DIR, exist_ok=True)

def append_debug_log(entry: dict):
    """Append structured JSON log to debug.log"""
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")