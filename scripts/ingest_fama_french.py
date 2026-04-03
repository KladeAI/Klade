#!/usr/bin/env python3
"""Ingest Fama-French Factor data into Supabase."""
import sys, json, os, time, uuid, requests, io, zipfile, csv, re
from datetime import datetime, timezone

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

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

BASE_URL = "https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp"

# Fama-French datasets to download
DATASETS = [
    {"name": "F-F_Research_Data_Factors_daily_CSV", "dataset": "FF3_daily", "frequency": "daily"},
    {"name": "F-F_Research_Data_Factors_CSV", "dataset": "FF3_monthly", "frequency": "monthly"},
    {"name": "F-F_Momentum_Factor_daily_CSV", "dataset": "Momentum_daily", "frequency": "daily"},
    {"name": "F-F_Momentum_Factor_CSV", "dataset": "Momentum_monthly", "frequency": "monthly"},
    {"name": "F-F_Research_Data_5_Factors_2x3_daily_CSV", "dataset": "FF5_daily", "frequency": "daily"},
    {"name": "F-F_Research_Data_5_Factors_2x3_CSV", "dataset": "FF5_monthly", "frequency": "monthly"},
]

def download_and_extract(name):
    """Download zip file and extract CSV content."""
    url = f"{BASE_URL}/{name}.zip"
    print(f"  Downloading {url}")
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    
    z = zipfile.ZipFile(io.BytesIO(resp.content))
    for fname in z.namelist():
        if fname.endswith('.CSV') or fname.endswith('.csv'):
            return z.read(fname).decode('utf-8', errors='replace')
    # If no CSV found, try the first file
    return z.read(z.namelist()[0]).decode('utf-8', errors='replace')

def parse_date(date_str, frequency):
    """Parse Fama-French date format. Daily: YYYYMMDD, Monthly: YYYYMM"""
    date_str = date_str.strip()
    try:
        if frequency == "daily" and len(date_str) == 8:
            return f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}"
        elif frequency == "monthly" and len(date_str) == 6:
            return f"{date_str[:4]}-{date_str[4:6]}-01"
        elif len(date_str) == 8:
            return f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}"
        elif len(date_str) == 6:
            return f"{date_str[:4]}-{date_str[4:6]}-01"
    except:
        pass
    return None

def parse_ff_csv(content, dataset, frequency):
    """Parse Fama-French CSV content into rows."""
    rows = []
    lines = content.split('\n')
    
    # Find header row (first row with column names)
    header_idx = None
    headers = []
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
        # Skip description lines
        parts = [p.strip() for p in line.split(',')]
        # Header typically has factor names like Mkt-RF, SMB, HML, RF
        if any(h in line for h in ['Mkt-RF', 'SMB', 'HML', 'Mom', 'RMW', 'CMA', 'RF']):
            headers = parts
            header_idx = i
            break
    
    if header_idx is None:
        print(f"  Could not find header in {dataset}")
        return rows
    
    # Clean headers
    headers = [h.strip() for h in headers]
    
    # Parse data rows
    for line in lines[header_idx + 1:]:
        line = line.strip()
        if not line:
            continue
        
        parts = [p.strip() for p in line.split(',')]
        
        # First column is date
        date_str = parts[0].strip()
        
        # Skip if not numeric (annual averages section, etc.)
        if not date_str.isdigit():
            continue
        
        date_val = parse_date(date_str, frequency)
        if not date_val:
            continue
        
        # Each subsequent column is a factor
        for j in range(1, min(len(parts), len(headers))):
            factor_name = headers[j].strip()
            if not factor_name:
                continue
            try:
                value = float(parts[j].strip())
            except (ValueError, IndexError):
                continue
            
            rows.append({
                "id": str(uuid.uuid4()),
                "date": date_val,
                "factor": factor_name,
                "value": value,
                "frequency": frequency,
                "dataset": dataset,
                "created_at": datetime.now(timezone.utc).isoformat()
            })
    
    return rows

def batch_insert(rows):
    """Insert rows in batches with 2-second delays."""
    BATCH_SIZE = 500
    inserted = 0
    errors = 0
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i+BATCH_SIZE]
        r = requests.post(
            f"{SUPABASE_URL}/rest/v1/fama_french_factors",
            headers=HEADERS,
            json=batch
        )
        if r.status_code in (200, 201):
            inserted += len(batch)
            if inserted % 5000 < BATCH_SIZE:
                print(f"    Progress: {inserted} rows inserted")
        else:
            errors += len(batch)
            print(f"    ERROR batch {i//BATCH_SIZE + 1}: {r.status_code} - {r.text[:200]}")
        if i + BATCH_SIZE < len(rows):
            time.sleep(2)
    return inserted, errors

# Main
total_inserted = 0
total_errors = 0

for ds in DATASETS:
    print(f"\n--- Processing {ds['dataset']} ---")
    try:
        content = download_and_extract(ds["name"])
        print(f"  Downloaded {len(content)} chars")
        
        rows = parse_ff_csv(content, ds["dataset"], ds["frequency"])
        print(f"  Parsed {len(rows)} factor observations")
        
        if rows:
            ins, err = batch_insert(rows)
            total_inserted += ins
            total_errors += err
            print(f"  Done: {ins} inserted, {err} errors")
    except Exception as e:
        print(f"  FAILED: {e}")

# Verify
r = requests.get(
    f"{SUPABASE_URL}/rest/v1/fama_french_factors?select=id",
    headers={**HEADERS, "Prefer": "count=exact", "Range": "0-0"}
)
count = r.headers.get("content-range", "unknown")
print(f"\n=== Fama-French Factors Summary ===")
print(f"Total inserted: {total_inserted}")
print(f"Total errors: {total_errors}")
print(f"DB count: {count}")
