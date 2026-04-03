#!/usr/bin/env python3
"""Ingest CFTC Commitments of Traders (Legacy Futures Only, annual compressed) into Supabase."""
import os, io, time, uuid, zipfile, csv, requests
from datetime import datetime, timezone

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

BASE = "https://www.cftc.gov"
YEARS = list(range(2018, 2027))  # 2018-2026 inclusive

# Column name matching helpers

def find_col(header_map, candidates):
    for name, idx in header_map.items():
        n = name.lower()
        for c in candidates:
            if c in n:
                return idx
    return None


def parse_zip(url):
    print(f"  Downloading {url}")
    r = requests.get(url, timeout=60)
    r.raise_for_status()
    z = zipfile.ZipFile(io.BytesIO(r.content))
    # Pick first .txt or .csv
    member = None
    for n in z.namelist():
        ln = n.lower()
        if ln.endswith('.txt') or ln.endswith('.csv'):
            member = n
            break
    if not member:
        member = z.namelist()[0]
    data = z.read(member)
    text = data.decode('latin-1', errors='replace')
    return text


def iter_rows(text):
    # The files are CSV with header
    reader = csv.reader(io.StringIO(text))
    rows = list(reader)
    if not rows:
        return []
    headers = rows[0]
    header_map = {h: i for i, h in enumerate(headers)}

    # Resolve columns
    # Prefer explicit YYYY-MM-DD column when available
    idx_date_long = find_col(header_map, [
        'yyyy-mm-dd', 'form yyyy-mm-dd', 'as of date in form yyyy-mm-dd'
    ])
    idx_date = idx_date_long if idx_date_long is not None else find_col(header_map, [
        'report_date_as_yyyy', 'report_date', 'report_dt', 'yyyy', 'date'
    ])
    idx_name = find_col(header_map, [
        'market_and_exchange_names', 'market_and_exchange', 'market_name', 'contract_market_name']
    )
    idx_code = find_col(header_map, [
        'cftc_contract_market_code', 'cftc_commodity_code', 'commodity_code', 'market_code']
    )
    idx_open = find_col(header_map, ['open_interest_all', 'open_interest'])
    idx_ncl = find_col(header_map, ['noncomm_long_all', 'noncommercial_long', 'noncomm_long'])
    idx_ncs = find_col(header_map, ['noncomm_short_all', 'noncommercial_short', 'noncomm_short'])
    idx_ncp = find_col(header_map, ['noncomm_spread', 'noncomm_spreading_all', 'noncommercial_spreading'])
    idx_cl = find_col(header_map, ['comm_long_all', 'commercial_long'])
    idx_cs = find_col(header_map, ['comm_short_all', 'commercial_short'])
    idx_tl = find_col(header_map, ['tot_rept_long_all', 'total_reportable_long', 'tot_rept_long'])
    idx_ts = find_col(header_map, ['tot_rept_short_all', 'total_reportable_short', 'tot_rept_short'])

    out = []
    for r in rows[1:]:
        try:
            date_raw = r[idx_date].strip() if idx_date is not None and idx_date < len(r) else ''
        except Exception:
            continue
        if not date_raw:
            continue
        # Normalize date
        date_str = None
        # Try multiple date formats
        dr = date_raw.strip()
        # Common forms: YYYY-MM-DD, YYYYMMDD, MM/DD/YYYY, M/D/YYYY
        try:
            if '-' in dr and len(dr) >= 10 and dr[:4].isdigit():
                # Assume YYYY-MM-DD
                date_str = dr[:10]
            elif '/' in dr:
                parts = dr.split('/')
                if len(parts) == 3 and len(parts[2]) == 4:
                    m = parts[0].zfill(2)
                    d2 = parts[1].zfill(2)
                    y = parts[2]
                    date_str = f"{y}-{m}-{d2}"
            else:
                d = dr.replace('-', '').replace('/', '')
                if len(d) == 8 and d.isdigit():
                    # Heuristic: if first 4 looks like year 1900-2100
                    y = d[:4]
                    if 1900 <= int(y) <= 2100:
                        date_str = f"{d[:4]}-{d[4:6]}-{d[6:8]}"
                    else:
                        # Assume MMDDYYYY
                        date_str = f"{d[4:8]}-{d[:2]}-{d[2:4]}"
        except Exception:
            date_str = None
        
        if not date_str:
            continue

        name = r[idx_name].strip() if idx_name is not None and idx_name < len(r) else None
        code = r[idx_code].strip() if idx_code is not None and idx_code < len(r) else None

        def f(idx):
            try:
                v = r[idx].replace(',', '').strip()
                return float(v) if v else None
            except Exception:
                return None

        row = {
            "id": str(uuid.uuid4()),
            "report_date": date_str,
            "contract_market_name": name,
            "cftc_contract_market_code": code,
            "open_interest": f(idx_open) if idx_open is not None else None,
            "noncommercial_long": f(idx_ncl) if idx_ncl is not None else None,
            "noncommercial_short": f(idx_ncs) if idx_ncs is not None else None,
            "noncommercial_spreading": f(idx_ncp) if idx_ncp is not None else None,
            "commercial_long": f(idx_cl) if idx_cl is not None else None,
            "commercial_short": f(idx_cs) if idx_cs is not None else None,
            "total_long": f(idx_tl) if idx_tl is not None else None,
            "total_short": f(idx_ts) if idx_ts is not None else None,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        out.append(row)
    return out


def batch_insert(rows):
    BATCH_SIZE = 500
    inserted = 0
    errors = 0
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i+BATCH_SIZE]
        r = requests.post(
            f"{SUPABASE_URL}/rest/v1/cftc_cot_positions",
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


total_inserted = 0
total_errors = 0

for y in YEARS:
    url = f"{BASE}/files/dea/history/deacot{y}.zip"
    print(f"\n--- Year {y} ---")
    try:
        text = parse_zip(url)
        rows = iter_rows(text)
        print(f"  Parsed {len(rows)} rows")
        if rows:
            ins, err = batch_insert(rows)
            total_inserted += ins
            total_errors += err
    except Exception as e:
        print(f"  FAILED {y}: {e}")

# Verify
r = requests.get(
    f"{SUPABASE_URL}/rest/v1/cftc_cot_positions?select=id",
    headers={**HEADERS, "Prefer": "count=exact", "Range": "0-0"}
)
count = r.headers.get("content-range", "unknown")
print(f"\n=== CFTC COT Positions Summary ===")
print(f"Total inserted: {total_inserted}")
print(f"Total errors: {total_errors}")
print(f"DB count: {count}")
