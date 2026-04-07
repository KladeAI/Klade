#!/usr/bin/env python3
"""8-K Error Recovery - Re-fetch and chunk failed 8-K filings"""

import requests
import json
import time
import re
import sys
from datetime import datetime

SUPABASE_URL = "https://humaesmbiarcqtpdwldg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
SEC_UA = "Klade AI dev@kladeai.com"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

def clean_html(html):
    text = re.sub(r'<[^>]+>', ' ', html)
    text = text.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    text = text.replace('&nbsp;', ' ').replace('&quot;', '"')
    text = re.sub(r'\s+', ' ', text).strip()
    if len(text) > 200000:
        text = text[:200000]
    return text

def chunk_text(text, target_chars=4000):
    chunks = []
    for i in range(0, len(text), target_chars):
        chunk = text[i:i+target_chars]
        if i + target_chars < len(text):
            last_period = chunk.rfind('.')
            if last_period > target_chars * 0.7:
                chunk = chunk[:last_period+1]
        if len(chunk.strip()) > 50:
            chunks.append(chunk.strip())
    return chunks

def main():
    print(f"=== 8-K Error Recovery ===")
    print(f"Started: {datetime.utcnow().isoformat()}")
    
    session = requests.Session()
    session.headers.update(HEADERS)
    
    # Fetch failed 8-K filings
    all_failed = []
    offset = 0
    while True:
        r = session.get(f"{SUPABASE_URL}/rest/v1/filings", params={
            "filing_type": "eq.8-K",
            "status": "neq.complete",
            "select": "id,accession_number,filing_url,company_id,ticker",
            "limit": 500,
            "offset": offset
        })
        batch = r.json()
        if not batch:
            break
        all_failed.extend(batch)
        if len(batch) < 500:
            break
        offset += 500
    
    print(f"Found {len(all_failed)} 8-K filings needing recovery")
    
    stats = {"recovered": 0, "marked_error": 0, "chunks_created": 0, "total": len(all_failed)}
    
    for idx, filing in enumerate(all_failed):
        filing_id = filing["id"]
        filing_url = filing.get("filing_url", "")
        ticker = filing.get("ticker", "")
        company_id = filing.get("company_id", "")
        acc = filing.get("accession_number", "")
        
        if idx % 50 == 0:
            print(f"  Progress: {idx}/{len(all_failed)} | Recovered: {stats['recovered']} | Errors: {stats['marked_error']}")
        
        text = None
        if filing_url:
            try:
                r = requests.get(filing_url, headers={"User-Agent": SEC_UA}, timeout=20)
                if r.status_code == 200 and len(r.text) > 200:
                    text = clean_html(r.text)
            except:
                pass
        
        time.sleep(0.12)
        
        if not text or len(text) < 200:
            # Mark as error
            session.patch(f"{SUPABASE_URL}/rest/v1/filings",
                params={"id": f"eq.{filing_id}"},
                json={"status": "error"},
                headers={**HEADERS, "Prefer": "return=minimal"})
            stats["marked_error"] += 1
            continue
        
        # Chunk and insert
        chunks = chunk_text(text)
        if not chunks:
            session.patch(f"{SUPABASE_URL}/rest/v1/filings",
                params={"id": f"eq.{filing_id}"},
                json={"status": "error"},
                headers={**HEADERS, "Prefer": "return=minimal"})
            stats["marked_error"] += 1
            continue
        
        # Insert chunks in batches
        total_chunks = len(chunks)
        success = True
        for batch_start in range(0, len(chunks), 150):
            batch = chunks[batch_start:batch_start+150]
            chunk_records = []
            for ci, chunk in enumerate(batch):
                chunk_records.append({
                    "filing_id": filing_id,
                    "company_id": company_id,
                    "ticker": ticker,
                    "filing_type": "8-K",
                    "chunk_index": batch_start + ci,
                    "section": "Body",
                    "content": chunk,
                    "token_count": len(chunk) // 4,
                })
            
            r = session.post(f"{SUPABASE_URL}/rest/v1/filing_chunks",
                json=chunk_records,
                headers={**HEADERS, "Prefer": "return=minimal"})
            if r.status_code < 400:
                stats["chunks_created"] += len(batch)
            else:
                success = False
                print(f"  Chunk insert error for {filing_id}: {r.status_code}")
        
        # Update filing
        session.patch(f"{SUPABASE_URL}/rest/v1/filings",
            params={"id": f"eq.{filing_id}"},
            json={"status": "complete" if success else "error", "total_chunks": total_chunks},
            headers={**HEADERS, "Prefer": "return=minimal"})
        
        if success:
            stats["recovered"] += 1
        else:
            stats["marked_error"] += 1
    
    print(f"\n=== 8-K RECOVERY COMPLETE ===")
    print(json.dumps(stats, indent=2))
    
    with open("/tmp/8k_stats.json", "w") as f:
        json.dump(stats, f)

if __name__ == "__main__":
    main()
