#!/usr/bin/env python3
"""Task 4: Additional FRED economic series"""
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
    except Exception as e:
        print(f"GET err: {e}")
        return []

def spost(ep, data):
    url = f"{URL}/rest/v1/{ep}"
    h = dict(HDR); h["Prefer"] = "return=minimal"
    req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=h, method="POST")
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=60) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except:
        return 0

# Check schema
sample = sget("economic_indicators", {"select": "*", "limit": "1"})
if sample:
    print(f"Schema: {list(sample[0].keys())}")

# Check which series already exist
print("Checking existing series...")
existing_series = set()
offset = 0
while True:
    # Get distinct series_ids
    batch = sget("economic_indicators", {
        "select": "series_id",
        "order": "series_id.asc",
        "offset": str(offset),
        "limit": "1000"
    })
    if not batch: break
    for b in batch:
        existing_series.add(b["series_id"])
    if len(batch) < 1000: break
    offset += 1000

print(f"Existing unique series: {len(existing_series)}")

# Additional FRED series
additional_series = {
    "HOUST": "Housing Starts Total",
    "PERMIT": "New Private Housing Units Authorized by Building Permits",
    "MSPUS": "Median Sales Price of Houses Sold for the US",
    "CSUSHPINSA": "S&P/Case-Shiller U.S. National Home Price Index",
    "ICSA": "Initial Claims Seasonally Adjusted",
    "CCSA": "Continued Claims Seasonally Adjusted",
    "JTSJOL": "Job Openings Total Nonfarm",
    "JTSQUR": "Quits Total Nonfarm Rate",
    "WALCL": "Federal Reserve Total Assets",
    "INDPRO": "Industrial Production Total Index",
    "IPMAN": "Industrial Production Manufacturing",
    "TCU": "Capacity Utilization Total Industry",
    "BOPGSTB": "Trade Balance Goods and Services",
    "PPIACO": "Producer Price Index All Commodities",
    "DCOILWTICO": "Crude Oil Prices WTI Cushing Oklahoma",
    "GOLDAMGBD228NLBM": "Gold Fixing Price London Bullion Market",
    "M1SL": "M1 Money Stock",
    "M2SL": "M2 Money Stock",
    "UMCSENT": "University of Michigan Consumer Sentiment",
    "STLFSI4": "St Louis Fed Financial Stress Index",
    "BAMLH0A0HYM2": "ICE BofA US High Yield Index Option-Adjusted Spread",
    "T10Y3M": "10-Year Treasury Constant Maturity Minus 3-Month Spread",
    "T10Y2Y": "10-Year Treasury Constant Maturity Minus 2-Year Spread",
    "VIXCLS": "CBOE Volatility Index VIX",
    "DTWEXBGS": "Nominal Broad US Dollar Index",
    "TOTALSA": "Total Vehicle Sales",
    "RSAFS": "Advance Retail Sales Food Services",
    "PCE": "Personal Consumption Expenditures",
    "PSAVERT": "Personal Saving Rate",
    "CP": "Corporate Profits After Tax",
}

new_series = {k: v for k, v in additional_series.items() if k not in existing_series}
print(f"New series to fetch: {len(new_series)}")

total_rows = 0
for series_id, desc in new_series.items():
    print(f"\n  {series_id}: {desc}")
    
    url = f"https://api.stlouisfed.org/fred/series/observations?series_id={series_id}&api_key={FRED_KEY}&file_type=json&observation_start=2000-01-01"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
            data = json.loads(r.read())
    except Exception as e:
        print(f"    Error: {e}")
        continue
    
    observations = data.get("observations", [])
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
            "date": obs["date"],
            "value": value,
            "description": desc
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
        elif s == 409:
            # Duplicates - skip
            inserted += len(batch)  # approximate
        else:
            print(f"    Batch error: {s}")
    
    total_rows += inserted
    print(f"    Inserted {inserted}/{len(rows)} observations")
    time.sleep(0.3)

print(f"\n=== FRED DONE: total_new_rows={total_rows} ===")
