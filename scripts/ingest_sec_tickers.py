#!/usr/bin/env python3
"""Ingest SEC Company Tickers into Supabase."""
import json, os, time, uuid, requests
from datetime import datetime, timezone

# Config
ENV_PATH = "/home/Arjun/.openclaw/workspace/startup/klade-analyst/.env"
def load_env():
    env = {}
    with open(ENV_PATH) as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                k, v = line.strip().split('=', 1)
                env[k] = v
    return env

env = load_env()
SUPABASE_URL = env["SUPABASE_URL"]
SUPABASE_KEY = env["SUPABASE_SERVICE_ROLE_KEY"]
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Step 1: Create table via SQL
print("Creating sec_company_tickers table...")
sql = """
CREATE TABLE IF NOT EXISTS sec_company_tickers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cik INTEGER NOT NULL,
    ticker TEXT,
    company_name TEXT,
    exchange TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sec_tickers_cik ON sec_company_tickers(cik);
CREATE INDEX IF NOT EXISTS idx_sec_tickers_ticker ON sec_company_tickers(ticker);
"""
r = requests.post(
    f"{SUPABASE_URL}/rest/v1/rpc/",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"query": sql}
)
# Try direct SQL via postgres if RPC doesn't work - use psql instead
if r.status_code != 200:
    print(f"RPC failed ({r.status_code}), will try via psql separately")

# Step 2: Download SEC tickers
print("Downloading SEC company tickers...")
SEC_URL = "https://www.sec.gov/files/company_tickers.json"
resp = requests.get(SEC_URL, headers={"User-Agent": "Klade AI dev@kladeai.com"})
resp.raise_for_status()
data = resp.json()
print(f"Downloaded {len(data)} tickers")

# Step 3: Parse into rows
rows = []
for key, item in data.items():
    rows.append({
        "id": str(uuid.uuid4()),
        "cik": item.get("cik_str"),
        "ticker": item.get("ticker"),
        "company_name": item.get("title"),
        "exchange": item.get("exchange", None),
        "created_at": datetime.now(timezone.utc).isoformat()
    })

print(f"Parsed {len(rows)} rows")

# Step 4: Batch insert with 2-second delays
BATCH_SIZE = 500
inserted = 0
errors = 0

for i in range(0, len(rows), BATCH_SIZE):
    batch = rows[i:i+BATCH_SIZE]
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/sec_company_tickers",
        headers=HEADERS,
        json=batch
    )
    if r.status_code in (200, 201):
        inserted += len(batch)
        print(f"  Inserted batch {i//BATCH_SIZE + 1}: {len(batch)} rows (total: {inserted})")
    else:
        errors += len(batch)
        print(f"  ERROR batch {i//BATCH_SIZE + 1}: {r.status_code} - {r.text[:200]}")
    
    if i + BATCH_SIZE < len(rows):
        time.sleep(2)

# Step 5: Verify count
r = requests.get(
    f"{SUPABASE_URL}/rest/v1/sec_company_tickers?select=id",
    headers={**HEADERS, "Prefer": "count=exact", "Range": "0-0"}
)
count = r.headers.get("content-range", "unknown")
print(f"\n=== SEC Company Tickers Summary ===")
print(f"Total parsed: {len(rows)}")
print(f"Inserted: {inserted}")
print(f"Errors: {errors}")
print(f"DB count: {count}")
