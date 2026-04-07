#!/usr/bin/env python3
"""
Fix and Continue Data Ingestion — Klade Layer 1
Handles: 8-K retry, 10-K historical depth, 13-F institutional ownership, FRED series
"""
import json
import time
import sys
import os
import re
import uuid
import urllib.request
import urllib.parse
import urllib.error
import ssl
from datetime import datetime, timedelta

# Force IPv4
import socket
_orig_getaddrinfo = socket.getaddrinfo
def _ipv4_getaddrinfo(*args, **kwargs):
    responses = _orig_getaddrinfo(*args, **kwargs)
    return [r for r in responses if r[0] == socket.AF_INET] or responses
socket.getaddrinfo = _ipv4_getaddrinfo

SUPABASE_URL = "https://humaesmbiarcqtpdwldg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
SEC_UA = "Klade AI dev@kladeai.com"
FRED_KEY = "223274221a49c8b82ac715f31771813d"

HEADERS_SUPABASE = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

HEADERS_SEC = {"User-Agent": SEC_UA, "Accept": "text/html,application/xhtml+xml"}

ctx = ssl.create_default_context()

def supabase_get(endpoint, params=None, count=False):
    """GET from Supabase REST API"""
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    if params:
        url += "?" + urllib.parse.urlencode(params, doseq=True)
    headers = dict(HEADERS_SUPABASE)
    if count:
        headers["Prefer"] = "count=exact"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            if count:
                cr = resp.headers.get("content-range", "")
                total = cr.split("/")[-1] if "/" in cr else "0"
                return int(total)
            return json.loads(resp.read())
    except Exception as e:
        print(f"  GET error {endpoint}: {e}")
        return [] if not count else 0

def supabase_post(endpoint, data, upsert=False):
    """POST to Supabase REST API"""
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    headers = dict(HEADERS_SUPABASE)
    if upsert:
        headers["Prefer"] = "resolution=merge-duplicates,return=minimal"
    body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()[:500]
        print(f"  POST error {endpoint}: {e.code} - {err_body}")
        return e.code
    except Exception as e:
        print(f"  POST error {endpoint}: {e}")
        return 0

def supabase_patch(endpoint, data, filters):
    """PATCH Supabase REST API"""
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}?{urllib.parse.urlencode(filters, doseq=True)}"
    headers = dict(HEADERS_SUPABASE)
    body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, headers=headers, method="PATCH")
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception as e:
        print(f"  PATCH error: {e}")
        return 0

def sec_fetch(url, retries=3):
    """Fetch from SEC EDGAR with rate limiting"""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS_SEC)
            with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(1 + attempt)
            else:
                return None
    return None

def chunk_text(text, max_tokens=500):
    """Split text into chunks of roughly max_tokens words"""
    words = text.split()
    chunks = []
    for i in range(0, len(words), max_tokens):
        chunk = " ".join(words[i:i+max_tokens])
        if chunk.strip():
            chunks.append(chunk)
    return chunks

def strip_html(html):
    """Basic HTML tag stripping"""
    text = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'&[a-zA-Z]+;', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# ============================================================
# TASK 1: 8-K Error Retry
# ============================================================
def retry_8k_errors():
    print("\n" + "="*60)
    print("TASK 1: 8-K ERROR RETRY")
    print("="*60)
    
    # Get all non-complete 8-K filings in batches
    offset = 0
    batch_size = 200
    total_fixed = 0
    total_skipped = 0
    total_errors = 0
    
    while True:
        filings = supabase_get("filings", {
            "select": "id,company_id,ticker,filing_type,filing_url,accession_number",
            "filing_type": "eq.8-K",
            "status": "neq.complete",
            "order": "ticker.asc",
            "offset": str(offset),
            "limit": str(batch_size)
        })
        
        if not filings:
            break
            
        print(f"\n  Processing batch at offset {offset}, got {len(filings)} filings")
        
        for i, filing in enumerate(filings):
            filing_id = filing["id"]
            ticker = filing["ticker"]
            filing_url = filing.get("filing_url", "")
            
            if not filing_url:
                total_skipped += 1
                continue
            
            # Check if chunks already exist for this filing
            existing = supabase_get("filing_chunks", {
                "select": "id",
                "filing_id": f"eq.{filing_id}",
                "limit": "1"
            })
            
            if existing:
                # Chunks exist, just mark as complete
                supabase_patch("filings", 
                    {"status": "complete", "total_chunks": len(existing)},
                    {"id": f"eq.{filing_id}"}
                )
                total_fixed += 1
                continue
            
            # Fetch the filing
            time.sleep(0.15)  # SEC rate limit
            html = sec_fetch(filing_url)
            
            if not html:
                total_errors += 1
                if (i + 1) % 50 == 0:
                    print(f"    Progress: {i+1}/{len(filings)} in batch, fixed={total_fixed}, errors={total_errors}")
                continue
            
            text = strip_html(html)
            if len(text) < 50:
                # Mark as complete with 0 chunks - empty filing
                supabase_patch("filings",
                    {"status": "complete", "total_chunks": 0},
                    {"id": f"eq.{filing_id}"}
                )
                total_fixed += 1
                continue
            
            chunks = chunk_text(text)
            
            # Insert chunks in batches
            chunk_rows = []
            for ci, chunk_content in enumerate(chunks):
                chunk_rows.append({
                    "filing_id": filing_id,
                    "company_id": filing["company_id"],
                    "ticker": ticker,
                    "filing_type": "8-K",
                    "chunk_index": ci,
                    "section": "General",
                    "content": chunk_content[:10000],
                    "token_count": len(chunk_content.split())
                })
            
            # Batch insert chunks
            for b in range(0, len(chunk_rows), 200):
                batch = chunk_rows[b:b+200]
                status = supabase_post("filing_chunks", batch)
                if status not in (200, 201):
                    total_errors += 1
                    break
            else:
                # Update filing status
                supabase_patch("filings",
                    {"status": "complete", "total_chunks": len(chunks)},
                    {"id": f"eq.{filing_id}"}
                )
                total_fixed += 1
            
            if (i + 1) % 25 == 0:
                print(f"    Progress: {i+1}/{len(filings)} in batch, fixed={total_fixed}, errors={total_errors}")
        
        offset += batch_size
        if len(filings) < batch_size:
            break
    
    print(f"\n  8-K RETRY DONE: fixed={total_fixed}, skipped={total_skipped}, errors={total_errors}")
    return total_fixed

# ============================================================
# TASK 2: 10-K Historical Depth (3 years)
# ============================================================
def extend_10k_coverage():
    print("\n" + "="*60)
    print("TASK 2: 10-K HISTORICAL DEPTH (3 YEARS)")
    print("="*60)
    
    # Get all companies
    companies = []
    offset = 0
    while True:
        batch = supabase_get("companies", {
            "select": "id,ticker,cik",
            "order": "ticker.asc",
            "offset": str(offset),
            "limit": "500"
        })
        if not batch:
            break
        companies.extend(batch)
        offset += 500
        if len(batch) < 500:
            break
    
    print(f"  Found {len(companies)} companies")
    
    # Get existing 10-K filings to know what we have
    existing_10k = {}
    offset = 0
    while True:
        batch = supabase_get("filings", {
            "select": "ticker,accession_number,filing_date",
            "filing_type": "eq.10-K",
            "order": "ticker.asc",
            "offset": str(offset),
            "limit": "1000"
        })
        if not batch:
            break
        for f in batch:
            key = f["ticker"]
            if key not in existing_10k:
                existing_10k[key] = set()
            existing_10k[key].add(f["accession_number"])
        offset += 1000
        if len(batch) < 1000:
            break
    
    print(f"  Existing 10-K filings across {len(existing_10k)} tickers")
    
    total_new_filings = 0
    total_new_chunks = 0
    errors = 0
    
    for ci, company in enumerate(companies):
        ticker = company["ticker"]
        cik = company["cik"].lstrip("0")
        company_id = company["id"]
        
        # Search EDGAR for 10-K filings (last 3 years)
        time.sleep(0.15)
        search_url = f"https://efts.sec.gov/LATEST/search-index?q=%2210-K%22&dateRange=custom&startdt=2023-01-01&enddt=2026-12-31&forms=10-K&ciks={cik}"
        
        # Use the EDGAR filing API instead
        api_url = f"https://data.sec.gov/submissions/CIK{cik.zfill(10)}.json"
        time.sleep(0.15)
        
        try:
            req = urllib.request.Request(api_url, headers=HEADERS_SEC)
            with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
                data = json.loads(resp.read())
        except Exception as e:
            if (ci + 1) % 50 == 0:
                print(f"    [{ci+1}/{len(companies)}] {ticker}: error fetching submissions: {e}")
            errors += 1
            continue
        
        # Find 10-K filings from recent filings
        recent = data.get("filings", {}).get("recent", {})
        forms = recent.get("form", [])
        dates = recent.get("filingDate", [])
        accessions = recent.get("accessionNumber", [])
        primary_docs = recent.get("primaryDocument", [])
        
        existing_acc = existing_10k.get(ticker, set())
        
        new_count = 0
        for fi in range(len(forms)):
            if forms[fi] not in ("10-K", "10-K/A"):
                continue
            
            filing_date = dates[fi] if fi < len(dates) else None
            accession = accessions[fi] if fi < len(accessions) else None
            primary_doc = primary_docs[fi] if fi < len(primary_docs) else ""
            
            if not filing_date or not accession:
                continue
            
            # Only 2023+
            if filing_date < "2023-01-01":
                continue
            
            if accession in existing_acc:
                continue
            
            # Build filing URL
            acc_path = accession.replace("-", "")
            filing_url = f"https://www.sec.gov/Archives/edgar/data/{cik}/{acc_path}/{primary_doc}"
            
            # Insert filing record
            filing_id = str(uuid.uuid4())
            filing_row = {
                "id": filing_id,
                "company_id": company_id,
                "ticker": ticker,
                "filing_type": "10-K",
                "filing_date": filing_date,
                "accession_number": accession,
                "filing_url": filing_url,
                "status": "processing",
                "total_chunks": 0
            }
            
            status = supabase_post("filings", filing_row)
            if status not in (200, 201):
                errors += 1
                continue
            
            # Fetch and chunk the filing
            time.sleep(0.15)
            html = sec_fetch(filing_url)
            
            if not html or len(html) < 100:
                supabase_patch("filings", {"status": "error"}, {"id": f"eq.{filing_id}"})
                errors += 1
                continue
            
            text = strip_html(html)
            chunks = chunk_text(text)
            
            if not chunks:
                supabase_patch("filings", {"status": "complete", "total_chunks": 0}, {"id": f"eq.{filing_id}"})
                continue
            
            # Insert chunks
            chunk_rows = []
            for chi, chunk_content in enumerate(chunks):
                chunk_rows.append({
                    "filing_id": filing_id,
                    "company_id": company_id,
                    "ticker": ticker,
                    "filing_type": "10-K",
                    "chunk_index": chi,
                    "section": "General",
                    "content": chunk_content[:10000],
                    "token_count": len(chunk_content.split())
                })
            
            chunks_ok = True
            for b in range(0, len(chunk_rows), 200):
                batch = chunk_rows[b:b+200]
                s = supabase_post("filing_chunks", batch)
                if s not in (200, 201):
                    chunks_ok = False
                    break
            
            if chunks_ok:
                supabase_patch("filings", {"status": "complete", "total_chunks": len(chunks)}, {"id": f"eq.{filing_id}"})
                total_new_filings += 1
                total_new_chunks += len(chunks)
                new_count += 1
        
        if new_count > 0 or (ci + 1) % 50 == 0:
            print(f"    [{ci+1}/{len(companies)}] {ticker}: +{new_count} new 10-Ks (total new: {total_new_filings}, chunks: {total_new_chunks})")
    
    print(f"\n  10-K EXTENSION DONE: new_filings={total_new_filings}, new_chunks={total_new_chunks}, errors={errors}")
    return total_new_filings, total_new_chunks

# ============================================================
# TASK 3: 13-F Institutional Ownership
# ============================================================
def ingest_13f():
    print("\n" + "="*60)
    print("TASK 3: 13-F INSTITUTIONAL OWNERSHIP")
    print("="*60)
    
    # Major institutional filers (by CIK)
    # These are the biggest hedge funds / asset managers
    major_filers = {
        "1067983": "Berkshire Hathaway",
        "1336528": "Bridgewater Associates",
        "1649339": "Citadel Advisors",
        "1350694": "Renaissance Technologies",
        "1061165": "Two Sigma Investments",
        "1037389": "BlackRock",
        "886982": "Goldman Sachs",
        "1166559": "JP Morgan Chase",
        "1326801": "DE Shaw",
        "1423053": "Millennium Management",
        "1364742": "Elliott Management",
        "1112520": "AQR Capital",
        "1114446": "Tiger Global",
        "908823": "Vanguard Group",
        "1395670": "Appaloosa Management",
        "1056831": "Viking Global",
        "934639": "State Street Corp",
        "1040273": "Baupost Group",
        "1100682": "Pershing Square",
        "1535392": "Third Point",
    }
    
    total_companies_added = 0
    total_filings_added = 0
    total_chunks_added = 0
    
    for cik, name in major_filers.items():
        print(f"\n  Processing: {name} (CIK: {cik})")
        
        # First check if this company exists
        existing = supabase_get("companies", {
            "select": "id,ticker",
            "cik": f"eq.{cik.zfill(10)}"
        })
        
        if not existing:
            # Also check without leading zeros
            existing = supabase_get("companies", {
                "select": "id,ticker",
                "name": f"eq.{name}"
            })
        
        if existing:
            company_id = existing[0]["id"]
            ticker = existing[0].get("ticker", f"13F-{cik}")
            print(f"    Company exists: {ticker}")
        else:
            # Insert new company
            company_id = str(uuid.uuid4())
            company_row = {
                "id": company_id,
                "ticker": f"13F-{cik[-4:]}",
                "name": name,
                "cik": cik.zfill(10),
                "sector": "Financial Services",
                "industry": "Asset Management",
                "exchange": "N/A",
                "country": "US"
            }
            status = supabase_post("companies", company_row)
            if status not in (200, 201):
                print(f"    ERROR inserting company: {status}")
                continue
            ticker = company_row["ticker"]
            total_companies_added += 1
            print(f"    Added company: {ticker}")
        
        # Fetch 13-F filings from EDGAR
        time.sleep(0.15)
        api_url = f"https://data.sec.gov/submissions/CIK{cik.zfill(10)}.json"
        try:
            req = urllib.request.Request(api_url, headers=HEADERS_SEC)
            with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
                data = json.loads(resp.read())
        except Exception as e:
            print(f"    Error fetching submissions: {e}")
            continue
        
        recent = data.get("filings", {}).get("recent", {})
        forms = recent.get("form", [])
        dates = recent.get("filingDate", [])
        accessions = recent.get("accessionNumber", [])
        primary_docs = recent.get("primaryDocument", [])
        
        # Check existing filings for this company
        existing_filings = set()
        ef = supabase_get("filings", {
            "select": "accession_number",
            "company_id": f"eq.{company_id}",
            "filing_type": "eq.13-F"
        })
        for f in ef:
            existing_filings.add(f["accession_number"])
        
        filings_added = 0
        for fi in range(len(forms)):
            if forms[fi] not in ("13-F", "13F-HR", "13F-HR/A"):
                continue
            
            filing_date = dates[fi] if fi < len(dates) else None
            accession = accessions[fi] if fi < len(accessions) else None
            primary_doc = primary_docs[fi] if fi < len(primary_docs) else ""
            
            if not filing_date or not accession:
                continue
            
            # Only recent filings (last 2 years)
            if filing_date < "2024-01-01":
                continue
            
            if accession in existing_filings:
                continue
            
            acc_path = accession.replace("-", "")
            filing_url = f"https://www.sec.gov/Archives/edgar/data/{cik}/{acc_path}/{primary_doc}"
            
            filing_id = str(uuid.uuid4())
            filing_row = {
                "id": filing_id,
                "company_id": company_id,
                "ticker": ticker,
                "filing_type": "13-F",
                "filing_date": filing_date,
                "accession_number": accession,
                "filing_url": filing_url,
                "status": "processing",
                "total_chunks": 0
            }
            
            status = supabase_post("filings", filing_row)
            if status not in (200, 201):
                continue
            
            # Fetch and chunk
            time.sleep(0.15)
            html = sec_fetch(filing_url)
            
            if not html or len(html) < 100:
                supabase_patch("filings", {"status": "error"}, {"id": f"eq.{filing_id}"})
                continue
            
            text = strip_html(html)
            chunks = chunk_text(text)
            
            if not chunks:
                supabase_patch("filings", {"status": "complete", "total_chunks": 0}, {"id": f"eq.{filing_id}"})
                filings_added += 1
                continue
            
            chunk_rows = []
            for chi, chunk_content in enumerate(chunks):
                chunk_rows.append({
                    "filing_id": filing_id,
                    "company_id": company_id,
                    "ticker": ticker,
                    "filing_type": "13-F",
                    "chunk_index": chi,
                    "section": "Holdings",
                    "content": chunk_content[:10000],
                    "token_count": len(chunk_content.split())
                })
            
            chunks_ok = True
            for b in range(0, len(chunk_rows), 200):
                batch = chunk_rows[b:b+200]
                s = supabase_post("filing_chunks", batch)
                if s not in (200, 201):
                    chunks_ok = False
                    break
            
            if chunks_ok:
                supabase_patch("filings", {"status": "complete", "total_chunks": len(chunks)}, {"id": f"eq.{filing_id}"})
                filings_added += 1
                total_chunks_added += len(chunks)
            
            if filings_added >= 8:  # Limit per filer to keep things moving
                break
        
        total_filings_added += filings_added
        print(f"    Added {filings_added} 13-F filings")
    
    print(f"\n  13-F DONE: companies={total_companies_added}, filings={total_filings_added}, chunks={total_chunks_added}")
    return total_companies_added, total_filings_added, total_chunks_added

# ============================================================
# TASK 4: Additional FRED Series
# ============================================================
def ingest_fred_series():
    print("\n" + "="*60)
    print("TASK 4: ADDITIONAL FRED SERIES")
    print("="*60)
    
    # Check what series we already have
    existing = supabase_get("economic_indicators", {
        "select": "series_id",
        "limit": "1"
    })
    
    # Check schema
    if existing:
        print(f"  Sample indicator: {json.dumps(existing[0], indent=2)}")
    
    # Get schema
    sample = supabase_get("economic_indicators", {"select": "*", "limit": "1"})
    if sample:
        print(f"  Schema columns: {list(sample[0].keys())}")
    
    # Additional useful FRED series beyond the basics
    additional_series = {
        # Housing
        "HOUST": "Housing Starts",
        "PERMIT": "Building Permits",
        "MSPUS": "Median Sales Price of Houses",
        "CSUSHPINSA": "Case-Shiller Home Price Index",
        # Labor market depth
        "ICSA": "Initial Jobless Claims",
        "CCSA": "Continued Claims",
        "JTSJOL": "Job Openings (JOLTS)",
        "JTSQUR": "Quits Rate (JOLTS)",
        # Credit / Financial
        "DRTSCILM": "Bank Lending Standards",
        "TOTRESNS": "Total Reserves",
        "WALCL": "Fed Balance Sheet Total Assets",
        "BOGZ1FL073164003Q": "Household Net Worth",
        # Manufacturing / Production
        "INDPRO": "Industrial Production Index",
        "IPMAN": "Manufacturing Production",
        "NEWORDER": "Manufacturers New Orders",
        "TCU": "Capacity Utilization",
        # Trade
        "BOPGSTB": "Trade Balance",
        "IMPGS": "Imports of Goods and Services",
        "EXPGS": "Exports of Goods and Services",
        # Prices depth
        "PPIACO": "Producer Price Index All Commodities",
        "DCOILWTICO": "WTI Crude Oil Price",
        "GOLDAMGBD228NLBM": "Gold Price",
        # Money supply
        "M1SL": "M1 Money Stock",
        "M2SL": "M2 Money Stock",
        # Sentiment
        "UMCSENT": "U Michigan Consumer Sentiment",
        "STLFSI4": "St Louis Financial Stress Index",
        # Rates depth
        "BAMLH0A0HYM2": "High Yield Bond Spread",
        "T10Y3M": "10Y-3M Treasury Spread",
        "T10Y2Y": "10Y-2Y Treasury Spread",
    }
    
    # Check which series already exist
    existing_series = set()
    offset = 0
    while True:
        batch = supabase_get("economic_indicators", {
            "select": "series_id",
            "order": "series_id.asc",
            "offset": str(offset),
            "limit": "1000"
        })
        if not batch:
            break
        for b in batch:
            existing_series.add(b["series_id"])
        if len(batch) < 1000:
            break
        offset += 1000
    
    # Deduplicate
    unique_existing = set(existing_series)
    print(f"  Found {len(unique_existing)} unique existing series")
    
    new_series = {k: v for k, v in additional_series.items() if k not in unique_existing}
    print(f"  New series to fetch: {len(new_series)}")
    
    total_rows = 0
    
    for series_id, description in new_series.items():
        print(f"\n  Fetching FRED: {series_id} ({description})")
        
        # Fetch from FRED API
        url = f"https://api.stlouisfed.org/fred/series/observations?series_id={series_id}&api_key={FRED_KEY}&file_type=json&observation_start=2000-01-01"
        
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
                data = json.loads(resp.read())
        except Exception as e:
            print(f"    Error: {e}")
            continue
        
        observations = data.get("observations", [])
        if not observations:
            print(f"    No observations found")
            continue
        
        # Build rows matching the schema
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
                "description": description
            })
        
        if not rows:
            print(f"    No valid observations")
            continue
        
        # Batch insert
        inserted = 0
        for b in range(0, len(rows), 500):
            batch = rows[b:b+500]
            status = supabase_post("economic_indicators", batch)
            if status in (200, 201):
                inserted += len(batch)
            elif status == 409:
                # Conflict - try with smaller batches
                for row in batch:
                    s = supabase_post("economic_indicators", row)
                    if s in (200, 201):
                        inserted += 1
            else:
                print(f"    Batch insert error: {status}")
                break
        
        total_rows += inserted
        print(f"    Inserted {inserted}/{len(rows)} observations")
        time.sleep(0.2)  # Rate limit FRED
    
    print(f"\n  FRED DONE: total_new_rows={total_rows}")
    return total_rows

# ============================================================
# MAIN
# ============================================================
def get_counts():
    counts = {}
    for table in ["companies", "filings", "filing_chunks", "economic_indicators", "fundamentals"]:
        counts[table] = supabase_get(table, {"select": "id", "limit": "0"}, count=True)
    return counts

if __name__ == "__main__":
    print("=" * 60)
    print("KLADE DATA ENGINE - FIX AND CONTINUE")
    print(f"Started: {datetime.utcnow().isoformat()}Z")
    print("=" * 60)
    
    # Pre-counts
    print("\n--- PRE-RUN COUNTS ---")
    pre_counts = get_counts()
    for k, v in pre_counts.items():
        print(f"  {k}: {v:,}")
    print(f"  TOTAL: {sum(pre_counts.values()):,}")
    
    # Run tasks
    task1_fixed = retry_8k_errors()
    task2_filings, task2_chunks = extend_10k_coverage()
    task3_companies, task3_filings, task3_chunks = ingest_13f()
    task4_rows = ingest_fred_series()
    
    # Post-counts
    print("\n\n" + "=" * 60)
    print("--- POST-RUN COUNTS ---")
    post_counts = get_counts()
    for k, v in post_counts.items():
        diff = v - pre_counts.get(k, 0)
        print(f"  {k}: {v:,} (+{diff:,})")
    print(f"  TOTAL: {sum(post_counts.values()):,}")
    
    # Save to day-tracker.json
    tracker_path = "/home/Arjun/.openclaw/workspace/startup/klade/data-engine/day-tracker.json"
    try:
        with open(tracker_path, "r") as f:
            tracker = json.load(f)
    except:
        tracker = {}
    
    tracker["last_run"] = datetime.utcnow().isoformat() + "Z"
    tracker["counts"] = post_counts
    tracker["total"] = sum(post_counts.values())
    tracker["task_results"] = {
        "8k_retry": {"fixed": task1_fixed},
        "10k_historical": {"new_filings": task2_filings, "new_chunks": task2_chunks},
        "13f_ownership": {"new_companies": task3_companies, "new_filings": task3_filings, "new_chunks": task3_chunks},
        "fred_additional": {"new_rows": task4_rows}
    }
    
    os.makedirs(os.path.dirname(tracker_path), exist_ok=True)
    with open(tracker_path, "w") as f:
        json.dump(tracker, f, indent=2)
    
    print(f"\nTracker updated: {tracker_path}")
    print(f"\nCompleted: {datetime.utcnow().isoformat()}Z")
