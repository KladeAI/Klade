#!/usr/bin/env python3
"""Task 2: Extend 10-K coverage to 3 years of history"""
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

print("=== 10-K HISTORICAL DEPTH ===")

# Get all companies
companies = []
offset = 0
while True:
    batch = sget("companies", {"select": "id,ticker,cik", "order": "ticker.asc", "offset": str(offset), "limit": "500"})
    if not batch: break
    companies.extend(batch)
    if len(batch) < 500: break
    offset += 500
print(f"Companies: {len(companies)}")

# Get existing 10-K accession numbers
existing_acc = set()
offset = 0
while True:
    batch = sget("filings", {"select": "accession_number", "filing_type": "eq.10-K", "offset": str(offset), "limit": "1000"})
    if not batch: break
    for f in batch:
        existing_acc.add(f["accession_number"])
    if len(batch) < 1000: break
    offset += 1000
print(f"Existing 10-K accessions: {len(existing_acc)}")

new_filings = 0
new_chunks = 0
errors = 0

for ci, comp in enumerate(companies):
    ticker = comp["ticker"]
    cik = comp["cik"].lstrip("0")
    company_id = comp["id"]
    
    # Fetch EDGAR submissions
    time.sleep(0.12)
    api_url = f"https://data.sec.gov/submissions/CIK{cik.zfill(10)}.json"
    try:
        req = urllib.request.Request(api_url, headers=SEC_HDR)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
            data = json.loads(r.read())
    except Exception as e:
        errors += 1
        continue
    
    recent = data.get("filings", {}).get("recent", {})
    forms = recent.get("form", [])
    dates = recent.get("filingDate", [])
    accessions = recent.get("accessionNumber", [])
    primary_docs = recent.get("primaryDocument", [])
    
    added = 0
    for fi in range(len(forms)):
        if forms[fi] not in ("10-K", "10-K/A"):
            continue
        filing_date = dates[fi] if fi < len(dates) else None
        accession = accessions[fi] if fi < len(accessions) else None
        primary_doc = primary_docs[fi] if fi < len(primary_docs) else ""
        if not filing_date or not accession or filing_date < "2023-01-01":
            continue
        if accession in existing_acc:
            continue
        
        acc_path = accession.replace("-", "")
        filing_url = f"https://www.sec.gov/Archives/edgar/data/{cik}/{acc_path}/{primary_doc}"
        filing_id = str(uuid.uuid4())
        
        s = spost("filings", {
            "id": filing_id, "company_id": company_id, "ticker": ticker,
            "filing_type": "10-K", "filing_date": filing_date,
            "accession_number": accession, "filing_url": filing_url,
            "status": "processing", "total_chunks": 0
        })
        if s not in (200, 201):
            errors += 1
            continue
        
        existing_acc.add(accession)
        time.sleep(0.12)
        html = sec_fetch(filing_url)
        
        if not html or len(html) < 100:
            spatch("filings", {"status": "error"}, {"id": f"eq.{filing_id}"})
            errors += 1
            continue
        
        text = strip_html(html)
        chunks = chunk_text(text)
        
        if not chunks:
            spatch("filings", {"status": "complete", "total_chunks": 0}, {"id": f"eq.{filing_id}"})
            added += 1
            continue
        
        rows = [{
            "filing_id": filing_id, "company_id": company_id, "ticker": ticker,
            "filing_type": "10-K", "chunk_index": chi, "section": "General",
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
            new_chunks += len(chunks)
        else:
            errors += 1
    
    new_filings += added
    if added > 0 or (ci+1) % 50 == 0:
        print(f"  [{ci+1}/{len(companies)}] {ticker}: +{added} (total: {new_filings} filings, {new_chunks} chunks, {errors} err)")

print(f"\n=== 10-K DONE: new_filings={new_filings}, new_chunks={new_chunks}, errors={errors} ===")
