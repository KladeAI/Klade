#!/usr/bin/env python3
"""Task 3: 13-F Institutional Ownership data from major filers"""
import json, time, re, uuid, urllib.request, urllib.parse, urllib.error, ssl, socket, sys
sys.stdout.reconfigure(line_buffering=True)

_orig = socket.getaddrinfo
def _ipv4(*a, **k):
    r = _orig(*a, **k)
    return [x for x in r if x[0] == socket.AF_INET] or r
socket.getaddrinfo = _ipv4

URL = "https://humaesmbiarcqtpdwldg.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
ctx = ssl.create_default_context()
HDR = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}
SEC_HDR = {"User-Agent": "Klade AI dev@kladeai.com"}

def sget(ep, params=None):
    url = f"{URL}/rest/v1/{ep}" + ("?" + urllib.parse.urlencode(params, doseq=True) if params else "")
    req = urllib.request.Request(url, headers=HDR)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"GET err {ep}: {e}")
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

def spatch(ep, data, filters):
    url = f"{URL}/rest/v1/{ep}?" + urllib.parse.urlencode(filters)
    h = dict(HDR); h["Prefer"] = "return=minimal"
    req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=h, method="PATCH")
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except:
        return 0

def sec_fetch(url):
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=SEC_HDR)
            with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
                return r.read().decode("utf-8", errors="replace")
        except:
            time.sleep(1 + attempt)
    return None

def strip_html(html):
    t = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL|re.IGNORECASE)
    t = re.sub(r'<style[^>]*>.*?</style>', '', t, flags=re.DOTALL|re.IGNORECASE)
    t = re.sub(r'<[^>]+>', ' ', t)
    t = re.sub(r'&[a-zA-Z]+;', ' ', t)
    return re.sub(r'\s+', ' ', t).strip()

def chunk_text(text, sz=500):
    words = text.split()
    return [" ".join(words[i:i+sz]) for i in range(0, len(words), sz) if words[i:i+sz]]

print("=== 13-F INSTITUTIONAL OWNERSHIP ===")

# Major institutional filers
major_filers = {
    "1067983": "Berkshire Hathaway Inc",
    "1336528": "Bridgewater Associates LP",
    "1649339": "Citadel Advisors LLC",
    "1350694": "Renaissance Technologies LLC",
    "1061165": "Two Sigma Investments LP",
    "1037389": "BlackRock Inc",
    "886982": "Goldman Sachs Group Inc",
    "1166559": "JPMorgan Chase & Co",
    "1326801": "D E Shaw & Co LP",
    "1423053": "Millennium Management LLC",
    "1364742": "Elliott Investment Management LP",
    "1112520": "AQR Capital Management LLC",
    "908823": "Vanguard Group Inc",
    "1395670": "Appaloosa Management LP",
    "1056831": "Viking Global Investors LP",
    "934639": "State Street Corp",
    "1040273": "Baupost Group LLC",
    "1100682": "Pershing Square Capital Mgmt",
    "1535392": "Third Point LLC",
    "1279708": "Point72 Asset Management LP",
}

total_companies = 0
total_filings = 0
total_chunks = 0

for cik, name in major_filers.items():
    print(f"\n  {name} (CIK: {cik})")
    
    # Check if company exists by CIK
    padded_cik = cik.zfill(10)
    existing = sget("companies", {"select": "id,ticker", "cik": f"eq.{padded_cik}"})
    
    if existing:
        company_id = existing[0]["id"]
        ticker = existing[0]["ticker"]
        print(f"    Exists as {ticker}")
    else:
        company_id = str(uuid.uuid4())
        ticker = f"13F-{cik[-4:]}"
        s = spost("companies", {
            "id": company_id, "ticker": ticker, "name": name,
            "cik": padded_cik, "sector": "Financial Services",
            "industry": "Asset Management", "exchange": "N/A", "country": "US"
        })
        if s not in (200, 201):
            print(f"    ERROR inserting company: {s}")
            continue
        total_companies += 1
        print(f"    Added as {ticker}")
    
    # Fetch EDGAR submissions
    time.sleep(0.15)
    api_url = f"https://data.sec.gov/submissions/CIK{padded_cik}.json"
    try:
        req = urllib.request.Request(api_url, headers=SEC_HDR)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
            data = json.loads(r.read())
    except Exception as e:
        print(f"    Error fetching submissions: {e}")
        continue
    
    recent = data.get("filings", {}).get("recent", {})
    forms = recent.get("form", [])
    dates = recent.get("filingDate", [])
    accessions = recent.get("accessionNumber", [])
    primary_docs = recent.get("primaryDocument", [])
    
    # Get existing filings for this company
    ef = sget("filings", {"select": "accession_number", "company_id": f"eq.{company_id}"})
    existing_acc = set(f["accession_number"] for f in ef)
    
    added = 0
    for fi in range(len(forms)):
        if forms[fi] not in ("13F-HR", "13F-HR/A"):
            continue
        filing_date = dates[fi] if fi < len(dates) else None
        accession = accessions[fi] if fi < len(accessions) else None
        primary_doc = primary_docs[fi] if fi < len(primary_docs) else ""
        if not filing_date or not accession or filing_date < "2024-01-01":
            continue
        if accession in existing_acc:
            continue
        
        acc_path = accession.replace("-", "")
        filing_url = f"https://www.sec.gov/Archives/edgar/data/{cik}/{acc_path}/{primary_doc}"
        filing_id = str(uuid.uuid4())
        
        s = spost("filings", {
            "id": filing_id, "company_id": company_id, "ticker": ticker,
            "filing_type": "13-F", "filing_date": filing_date,
            "accession_number": accession, "filing_url": filing_url,
            "status": "processing", "total_chunks": 0
        })
        if s not in (200, 201):
            continue
        
        existing_acc.add(accession)
        time.sleep(0.15)
        html = sec_fetch(filing_url)
        
        if not html or len(html) < 100:
            spatch("filings", {"status": "error"}, {"id": f"eq.{filing_id}"})
            continue
        
        text = strip_html(html)
        chunks = chunk_text(text)
        
        if not chunks:
            spatch("filings", {"status": "complete", "total_chunks": 0}, {"id": f"eq.{filing_id}"})
            added += 1
            continue
        
        rows = [{
            "filing_id": filing_id, "company_id": company_id, "ticker": ticker,
            "filing_type": "13-F", "chunk_index": chi, "section": "Holdings",
            "content": c[:10000], "token_count": len(c.split())
        } for chi, c in enumerate(chunks)]
        
        ok = True
        for b in range(0, len(rows), 200):
            st = spost("filing_chunks", rows[b:b+200])
            if st not in (200, 201):
                ok = False
                break
        
        if ok:
            spatch("filings", {"status": "complete", "total_chunks": len(chunks)}, {"id": f"eq.{filing_id}"})
            added += 1
            total_chunks += len(chunks)
        
        if added >= 8:
            break
    
    total_filings += added
    print(f"    Added {added} 13-F filings")

print(f"\n=== 13-F DONE: companies={total_companies}, filings={total_filings}, chunks={total_chunks} ===")
