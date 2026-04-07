#!/usr/bin/env python3
"""Task 1: Retry 8-K filings stuck in error/processing status"""
import json, time, sys, re, uuid, urllib.request, urllib.parse, urllib.error, ssl, socket

_orig = socket.getaddrinfo
def _ipv4(*a, **k):
    r = _orig(*a, **k)
    return [x for x in r if x[0] == socket.AF_INET] or r
socket.getaddrinfo = _ipv4

URL = "https://humaesmbiarcqtpdwldg.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
ctx = ssl.create_default_context()
HDR = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}

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
    except Exception as e:
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
            req = urllib.request.Request(url, headers={"User-Agent": "Klade AI dev@kladeai.com"})
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

print("=== 8-K ERROR RETRY ===")
fixed = errors = skipped = 0
offset = 0

while True:
    filings = sget("filings", {
        "select": "id,company_id,ticker,filing_url",
        "filing_type": "eq.8-K",
        "status": "neq.complete",
        "order": "ticker.asc",
        "offset": str(offset),
        "limit": "500"
    })
    if not filings:
        break
    
    print(f"\nBatch offset={offset}, count={len(filings)}")
    
    for i, f in enumerate(filings):
        fid = f["id"]
        furl = f.get("filing_url", "")
        
        if not furl:
            # No URL - just mark complete with 0 chunks
            spatch("filings", {"status": "complete", "total_chunks": 0}, {"id": f"eq.{fid}"})
            skipped += 1
            continue
        
        # Check if chunks already exist
        existing = sget("filing_chunks", {"select": "id", "filing_id": f"eq.{fid}", "limit": "1"})
        if existing:
            spatch("filings", {"status": "complete"}, {"id": f"eq.{fid}"})
            fixed += 1
            continue
        
        # Fetch filing
        time.sleep(0.12)
        html = sec_fetch(furl)
        
        if not html or len(html) < 100:
            spatch("filings", {"status": "error"}, {"id": f"eq.{fid}"})
            errors += 1
            continue
        
        text = strip_html(html)
        if len(text) < 50:
            spatch("filings", {"status": "complete", "total_chunks": 0}, {"id": f"eq.{fid}"})
            fixed += 1
            continue
        
        chunks = chunk_text(text)
        rows = [{
            "filing_id": fid,
            "company_id": f["company_id"],
            "ticker": f["ticker"],
            "filing_type": "8-K",
            "chunk_index": ci,
            "section": "General",
            "content": c[:10000],
            "token_count": len(c.split())
        } for ci, c in enumerate(chunks)]
        
        ok = True
        for b in range(0, len(rows), 200):
            s = spost("filing_chunks", rows[b:b+200])
            if s not in (200, 201):
                ok = False
                break
        
        if ok:
            spatch("filings", {"status": "complete", "total_chunks": len(chunks)}, {"id": f"eq.{fid}"})
            fixed += 1
        else:
            errors += 1
        
        if (i+1) % 25 == 0:
            print(f"  [{offset+i+1}] fixed={fixed} errors={errors} skipped={skipped}")
    
    offset += 500
    if len(filings) < 500:
        break

print(f"\n=== 8-K DONE: fixed={fixed}, errors={errors}, skipped={skipped} ===")
