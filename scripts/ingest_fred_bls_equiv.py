#!/usr/bin/env python3
"""Ingest missing BLS-equivalent FRED series into economic_indicators table."""
import json, socket, sys, time, urllib.request, urllib.error, uuid

# Force IPv4
orig_getaddrinfo = socket.getaddrinfo
def ipv4_getaddrinfo(*args, **kwargs):
    return [r for r in orig_getaddrinfo(*args, **kwargs) if r[0] == socket.AF_INET]
socket.getaddrinfo = ipv4_getaddrinfo

SUPABASE_URL = "https://humaesmbiarcqtpdwldg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
FRED_API_KEY = "223274221a49c8b82ac715f31771813d"
BATCH_SIZE = 500
DELAY = 2

# BLS-equivalent series to check/ingest
BLS_SERIES = {
    "CPIAUCSL": ("CPI for All Urban Consumers", "Monthly"),
    "CPILFESL": ("Core CPI Less Food and Energy", "Monthly"),
    "PAYEMS": ("Total Nonfarm Payrolls", "Monthly"),
    "UNRATE": ("Unemployment Rate", "Monthly"),
    "JTSJOL": ("JOLTS Job Openings", "Monthly"),
    "PCEPILFE": ("Core PCE Price Index", "Monthly"),
    "PPIACO": ("PPI All Commodities", "Monthly"),
    "ECIWAG": ("Employment Cost Index Wages", "Quarterly"),
    "OPHNFB": ("Nonfarm Business Labor Productivity", "Quarterly"),
    "A939RX0Q048SBEA": ("Real GDP Per Capita", "Quarterly"),
    "ICSA": ("Initial Jobless Claims", "Weekly"),
    "CCSA": ("Continued Jobless Claims", "Weekly"),
    "RSAFS": ("Advance Retail Sales", "Monthly"),
    "HOUST": ("Housing Starts", "Monthly"),
    "PERMIT": ("Building Permits", "Monthly"),
    "INDPRO": ("Industrial Production Index", "Monthly"),
    "UMCSENT": ("Consumer Sentiment Index", "Monthly"),
}


def check_existing(series_id):
    """Check if series already exists in economic_indicators."""
    url = f"{SUPABASE_URL}/rest/v1/economic_indicators?select=id&series_id=eq.{series_id}&limit=1"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Prefer": "count=exact",
    })
    resp = urllib.request.urlopen(req, timeout=15)
    cr = resp.headers.get("content-range", "*/0")
    count = int(cr.split("/")[-1])
    return count


def fetch_fred_series(series_id):
    """Fetch all observations for a FRED series."""
    url = (f"https://api.stlouisfed.org/fred/series/observations"
           f"?series_id={series_id}&api_key={FRED_API_KEY}&file_type=json"
           f"&sort_order=asc")
    req = urllib.request.Request(url, headers={"User-Agent": "KladeAI/1.0"})
    resp = urllib.request.urlopen(req, timeout=30)
    data = json.loads(resp.read())
    return data.get("observations", [])


def insert_batch(batch, batch_num, total_batches, series_id):
    """Insert a batch into Supabase."""
    url = f"{SUPABASE_URL}/rest/v1/economic_indicators"
    payload = json.dumps(batch).encode("utf-8")
    req = urllib.request.Request(url, data=payload, method="POST", headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    })
    try:
        urllib.request.urlopen(req, timeout=30)
        print(f"    Batch {batch_num}/{total_batches}: {len(batch)} rows", flush=True)
        return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"    ⚠ Batch {batch_num} error {e.code}: {body[:300]}", flush=True)
        return False


def ingest_series(series_id, name, frequency):
    """Fetch and ingest a single FRED series."""
    print(f"\n  Fetching {series_id} ({name})...", flush=True)
    observations = fetch_fred_series(series_id)
    
    rows = []
    for obs in observations:
        val = obs.get("value", "").strip()
        if val == "." or val == "":
            continue
        try:
            value = float(val)
        except ValueError:
            continue
        rows.append({
            "id": str(uuid.uuid4()),
            "series_id": series_id,
            "series_name": name,
            "observation_date": obs["date"],
            "value": value,
            "unit": "level",
            "frequency": frequency,
        })

    if not rows:
        print(f"    No valid observations for {series_id}", flush=True)
        return 0

    total_batches = (len(rows) + BATCH_SIZE - 1) // BATCH_SIZE
    inserted = 0
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        batch_num = (i // BATCH_SIZE) + 1
        if insert_batch(batch, batch_num, total_batches, series_id):
            inserted += len(batch)
        else:
            time.sleep(5)
            if insert_batch(batch, batch_num, total_batches, series_id):
                inserted += len(batch)
        time.sleep(DELAY)

    print(f"  ✅ {series_id}: {inserted} rows inserted", flush=True)
    return inserted


def main():
    print("=== FRED BLS-Equivalent Series Ingestion ===\n", flush=True)

    # Check which series are missing
    missing = []
    for series_id, (name, freq) in BLS_SERIES.items():
        count = check_existing(series_id)
        if count == 0:
            print(f"  {series_id}: MISSING — will ingest", flush=True)
            missing.append((series_id, name, freq))
        else:
            print(f"  {series_id}: {count} rows ✅ (already exists)", flush=True)

    if not missing:
        print("\n✅ All BLS-equivalent series already present!", flush=True)
        return

    print(f"\n--- Ingesting {len(missing)} missing series ---", flush=True)
    total_inserted = 0
    for series_id, name, freq in missing:
        try:
            count = ingest_series(series_id, name, freq)
            total_inserted += count
        except Exception as e:
            print(f"  ✗ Error ingesting {series_id}: {e}", flush=True)

    print(f"\n✅ FRED BLS ingestion complete: {total_inserted} total rows inserted across {len(missing)} series", flush=True)


if __name__ == "__main__":
    main()
