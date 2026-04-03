#!/usr/bin/env python3
"""Ingest CFTC Commitments of Traders data (2020-2025) into cftc_cot_positions table."""
import csv, io, json, socket, sys, time, urllib.request, zipfile, uuid

# Force IPv4
orig_getaddrinfo = socket.getaddrinfo
def ipv4_getaddrinfo(*args, **kwargs):
    return [r for r in orig_getaddrinfo(*args, **kwargs) if r[0] == socket.AF_INET]
socket.getaddrinfo = ipv4_getaddrinfo

SUPABASE_URL = "https://humaesmbiarcqtpdwldg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
BATCH_SIZE = 500
DELAY = 2  # seconds between batches

# Years to download (2020 gives us 5+ years of history through 2025)
YEARS = [2020, 2021, 2022, 2023, 2024, 2025]

# Column mapping from CFTC CSV headers to our DB columns
COL_MAP = {
    "Market and Exchange Names": "contract_market_name",
    "As of Date in Form YYYY-MM-DD": "report_date",
    "CFTC Contract Market Code": "cftc_contract_market_code",
    "Open Interest (All)": "open_interest",
    "Noncommercial Positions-Long (All)": "noncommercial_long",
    "Noncommercial Positions-Short (All)": "noncommercial_short",
    "Noncommercial Positions-Spreading (All)": "noncommercial_spreading",
    "Commercial Positions-Long (All)": "commercial_long",
    "Commercial Positions-Short (All)": "commercial_short",
    " Total Reportable Positions-Long (All)": "total_long",  # note leading space
    "Total Reportable Positions-Short (All)": "total_short",
}


def safe_numeric(val):
    """Convert string to numeric, return None if not valid."""
    if val is None:
        return None
    val = str(val).strip().replace(",", "")
    if val == "" or val == ".":
        return None
    try:
        return float(val)
    except ValueError:
        return None


def download_and_parse(year):
    """Download CFTC zip for a year and parse CSV rows."""
    url = f"https://www.cftc.gov/files/dea/history/deacot{year}.zip"
    print(f"  Downloading {url} ...", flush=True)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 KladeAI/1.0"})
        resp = urllib.request.urlopen(req, timeout=60)
        data = resp.read()
    except Exception as e:
        print(f"  ⚠ Failed to download {year}: {e}", flush=True)
        return []

    rows = []
    with zipfile.ZipFile(io.BytesIO(data)) as zf:
        for name in zf.namelist():
            if not name.lower().endswith(".txt"):
                continue
            with zf.open(name) as f:
                text = f.read().decode("latin-1")
                reader = csv.DictReader(io.StringIO(text))
                for row in reader:
                    record = {"id": str(uuid.uuid4())}
                    for csv_col, db_col in COL_MAP.items():
                        val = row.get(csv_col)
                        if val is not None:
                            val = val.strip()
                        if db_col == "report_date":
                            record[db_col] = val if val else None
                        elif db_col in ("contract_market_name", "cftc_contract_market_code"):
                            record[db_col] = val
                        else:
                            record[db_col] = safe_numeric(val)
                    if record.get("report_date"):
                        rows.append(record)
    return rows


def insert_batch(batch, batch_num, total_batches):
    """Insert a batch into Supabase via REST API."""
    url = f"{SUPABASE_URL}/rest/v1/cftc_cot_positions"
    payload = json.dumps(batch).encode("utf-8")
    req = urllib.request.Request(url, data=payload, method="POST", headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    })
    try:
        urllib.request.urlopen(req, timeout=30)
        print(f"  Batch {batch_num}/{total_batches}: inserted {len(batch)} rows", flush=True)
        return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  ⚠ Batch {batch_num} error {e.code}: {body[:300]}", flush=True)
        return False


def main():
    print("=== CFTC Commitments of Traders Ingestion ===", flush=True)

    # Collect all rows
    all_rows = []
    for year in YEARS:
        rows = download_and_parse(year)
        print(f"  {year}: {len(rows)} rows parsed", flush=True)
        all_rows.extend(rows)

    print(f"\nTotal rows to insert: {len(all_rows)}", flush=True)

    if not all_rows:
        print("No data to insert!", flush=True)
        sys.exit(1)

    # Batch insert
    total_batches = (len(all_rows) + BATCH_SIZE - 1) // BATCH_SIZE
    inserted = 0
    for i in range(0, len(all_rows), BATCH_SIZE):
        batch = all_rows[i:i + BATCH_SIZE]
        batch_num = (i // BATCH_SIZE) + 1
        if insert_batch(batch, batch_num, total_batches):
            inserted += len(batch)
        else:
            print(f"  Retrying batch {batch_num}...", flush=True)
            time.sleep(5)
            if insert_batch(batch, batch_num, total_batches):
                inserted += len(batch)
            else:
                print(f"  ✗ Batch {batch_num} failed after retry", flush=True)
        time.sleep(DELAY)

    print(f"\n✅ CFTC ingestion complete: {inserted}/{len(all_rows)} rows inserted", flush=True)


if __name__ == "__main__":
    main()
