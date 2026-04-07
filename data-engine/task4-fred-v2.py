#!/usr/bin/env python3
"""Task 4: Additional FRED economic series (correct schema)"""
import json, time, urllib.request, urllib.parse, urllib.error, ssl, socket, sys
sys.stdout.reconfigure(line_buffering=True)

_orig = socket.getaddrinfo
def _ipv4(*a, **k):
    r = _orig(*a, **k)
    return [x for x in r if x[0] == socket.AF_INET] or r
socket.getaddrinfo = _ipv4

URL = "https://humaesmbiarcqtpdwldg.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
FRED_KEY = "223274221a49c8b82ac715f31771813d"
ctx = ssl.create_default_context()
HDR = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}

def sget(ep, params=None):
    url = f"{URL}/rest/v1/{ep}" + ("?" + urllib.parse.urlencode(params, doseq=True) if params else "")
    req = urllib.request.Request(url, headers=HDR)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
            return json.loads(r.read())
    except:
        return []

def spost(ep, data):
    url = f"{URL}/rest/v1/{ep}"
    h = dict(HDR); h["Prefer"] = "return=minimal"
    req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=h, method="POST")
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=60) as r:
            return r.status
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:200]
        print(f"    POST err {s}: {e.code} {body}")
        return e.code
    except:
        return 0

def fred_fetch(endpoint, params={}):
    params["api_key"] = FRED_KEY
    params["file_type"] = "json"
    url = f"https://api.stlouisfed.org/fred/{endpoint}?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
        return json.loads(r.read())

print("=== FRED ADDITIONAL SERIES ===")

# Check existing series
existing_series = set()
offset = 0
while True:
    batch = sget("economic_indicators", {"select": "series_id", "order": "series_id.asc", "offset": str(offset), "limit": "1000"})
    if not batch: break
    for b in batch:
        existing_series.add(b["series_id"])
    if len(batch) < 1000: break
    offset += 1000
print(f"Existing series: {len(existing_series)}")

# Schema: id, series_id, series_name, observation_date, value, unit, frequency
FREQ_MAP = {"Q": "Quarterly", "M": "Monthly", "W": "Weekly", "D": "Daily", "A": "Annual", "SA": "Semiannual", "BW": "Biweekly"}

additional = {
    "CSUSHPINSA": "S&P/Case-Shiller US National Home Price Index",
    "IPMAN": "Industrial Production Manufacturing",
    "GOLDAMGBD228NLBM": "Gold Fixing Price London Bullion Market",
    "TOTALSA": "Total Vehicle Sales",
    "HOUST": "Housing Starts Total",
    "PERMIT": "New Private Housing Units Authorized",
    "MSPUS": "Median Sales Price of Houses Sold US",
    "ICSA": "Initial Claims Seasonally Adjusted",
    "CCSA": "Continued Claims Seasonally Adjusted",
    "JTSJOL": "Job Openings Total Nonfarm",
    "JTSQUR": "Quits Total Nonfarm Rate",
    "WALCL": "Federal Reserve Total Assets",
    "INDPRO": "Industrial Production Total Index",
    "TCU": "Capacity Utilization Total Industry",
    "BOPGSTB": "Trade Balance Goods and Services",
    "PPIACO": "Producer Price Index All Commodities",
    "DCOILWTICO": "Crude Oil Prices WTI",
    "M1SL": "M1 Money Stock",
    "M2SL": "M2 Money Stock",
    "UMCSENT": "U Michigan Consumer Sentiment",
    "STLFSI4": "St Louis Fed Financial Stress Index",
    "BAMLH0A0HYM2": "ICE BofA US High Yield Spread",
    "T10Y3M": "10Y-3M Treasury Spread",
    "T10Y2Y": "10Y-2Y Treasury Spread",
    "VIXCLS": "CBOE Volatility Index VIX",
    "DTWEXBGS": "Nominal Broad US Dollar Index",
    "RSAFS": "Advance Retail Sales Food Services",
    "PCE": "Personal Consumption Expenditures",
    "PSAVERT": "Personal Saving Rate",
    "CP": "Corporate Profits After Tax",
}

new_series = {k: v for k, v in additional.items() if k not in existing_series}
print(f"New to fetch: {len(new_series)}")

total_rows = 0
for series_id, series_name in new_series.items():
    print(f"\n  {series_id}: {series_name}")
    
    # Get series metadata for frequency/unit
    try:
        meta = fred_fetch("series", {"series_id": series_id})
        sinfo = meta.get("seriess", [{}])[0]
        freq_short = sinfo.get("frequency_short", "M")
        frequency = FREQ_MAP.get(freq_short, freq_short)
        units = sinfo.get("units_short", "level")
    except Exception as e:
        print(f"    Meta error: {e}")
        frequency = "Monthly"
        units = "level"
    
    # Get observations
    try:
        obs_data = fred_fetch("series/observations", {"series_id": series_id, "observation_start": "2000-01-01"})
    except Exception as e:
        print(f"    Obs error: {e}")
        continue
    
    observations = obs_data.get("observations", [])
    rows = []
    for obs in observations:
        val = obs.get("value", ".")
        if val == "." or val == "":
            continue
        try:
            value = float(val)
        except ValueError:
            continue
        rows.append({
            "series_id": series_id,
            "series_name": series_name,
            "observation_date": obs["date"],
            "value": value,
            "unit": units,
            "frequency": frequency
        })
    
    if not rows:
        print(f"    No valid data")
        continue
    
    inserted = 0
    for b in range(0, len(rows), 500):
        batch = rows[b:b+500]
        s = spost("economic_indicators", batch)
        if s in (200, 201):
            inserted += len(batch)
        else:
            # Try smaller batches
            for row in batch:
                s2 = spost("economic_indicators", [row])
                if s2 in (200, 201):
                    inserted += 1
    
    total_rows += inserted
    print(f"    Inserted {inserted}/{len(rows)} ({frequency}, {units})")
    time.sleep(0.3)

print(f"\n=== FRED DONE: total_new_rows={total_rows} ===")
