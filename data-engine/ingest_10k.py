#!/usr/bin/env python3
"""10-K Historical Depth Ingestion - Fetch 10-K filings for all companies (2022-2025)"""

import requests
import json
import time
import re
import sys
import traceback
from datetime import datetime

SUPABASE_URL = "https://humaesmbiarcqtpdwldg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
SEC_UA = "Klade AI dev@kladeai.com"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

session = requests.Session()
session.headers.update(HEADERS)

def supabase_get(path, params=None):
    r = session.get(f"{SUPABASE_URL}/rest/v1/{path}", params=params)
    r.raise_for_status()
    return r.json()

def supabase_post(table, data, upsert=False):
    h = dict(HEADERS)
    if upsert:
        h["Prefer"] = "resolution=merge-duplicates"
    else:
        h["Prefer"] = "return=representation"
    r = requests.post(f"{SUPABASE_URL}/rest/v1/{table}", json=data, headers=h)
    if r.status_code >= 400:
        print(f"  POST {table} error {r.status_code}: {r.text[:200]}")
        return None
    return r.json()

def supabase_patch(table, params, data):
    h = dict(HEADERS)
    h["Prefer"] = "return=minimal"
    r = requests.patch(f"{SUPABASE_URL}/rest/v1/{table}", params=params, json=data, headers=h)
    return r.status_code < 400

def get_all_companies():
    """Fetch all companies from Supabase"""
    companies = []
    offset = 0
    while True:
        batch = supabase_get("companies", {"select": "id,ticker,cik,name", "limit": 1000, "offset": offset})
        if not batch:
            break
        companies.extend(batch)
        if len(batch) < 1000:
            break
        offset += 1000
    return companies

def get_existing_accessions():
    """Fetch all existing 10-K accession numbers"""
    accessions = set()
    offset = 0
    while True:
        batch = supabase_get("filings", {
            "select": "accession_number",
            "filing_type": "eq.10-K",
            "limit": 5000,
            "offset": offset
        })
        if not batch:
            break
        for f in batch:
            if f.get("accession_number"):
                accessions.add(f["accession_number"])
        if len(batch) < 5000:
            break
        offset += 5000
    return accessions

def query_edgar_10k(cik, ticker):
    """Query SEC EDGAR for 10-K filings"""
    cik_clean = cik.lstrip("0") if cik else None
    if not cik_clean:
        return []
    
    url = f"https://efts.sec.gov/LATEST/search-index?q=&dateRange=custom&startdt=2022-01-01&enddt=2025-12-31&forms=10-K&from=0&size=10"
    
    # Use EDGAR full-text search API
    url = f"https://efts.sec.gov/LATEST/search-index?q=%22{ticker}%22&forms=10-K&dateRange=custom&startdt=2022-01-01&enddt=2025-12-31"
    
    # Actually use the submissions API which is more reliable
    cik_padded = cik.zfill(10)
    url = f"https://data.sec.gov/submissions/CIK{cik_padded}.json"
    
    try:
        r = requests.get(url, headers={"User-Agent": SEC_UA}, timeout=15)
        if r.status_code != 200:
            return []
        data = r.json()
        
        filings = []
        recent = data.get("filings", {}).get("recent", {})
        forms = recent.get("form", [])
        dates = recent.get("filingDate", [])
        accessions = recent.get("accessionNumber", [])
        primary_docs = recent.get("primaryDocument", [])
        
        for i, form in enumerate(forms):
            if form in ("10-K", "10-K/A"):
                filing_date = dates[i] if i < len(dates) else None
                if filing_date and filing_date >= "2022-01-01":
                    acc = accessions[i] if i < len(accessions) else None
                    doc = primary_docs[i] if i < len(primary_docs) else ""
                    acc_nodash = acc.replace("-", "") if acc else ""
                    filing_url = f"https://www.sec.gov/Archives/edgar/data/{cik_clean}/{acc_nodash}/{doc}" if doc else ""
                    filings.append({
                        "form": form,
                        "filing_date": filing_date,
                        "accession_number": acc,
                        "filing_url": filing_url,
                        "primary_doc": doc
                    })
        
        return filings
    except Exception as e:
        print(f"  EDGAR error for {ticker}: {e}")
        return []

def fetch_filing_text(filing_url, cik, accession_number):
    """Fetch the full text of a filing"""
    # Try the filing index page first to find the main document
    acc_nodash = accession_number.replace("-", "")
    cik_clean = cik.lstrip("0")
    
    # Try the primary document URL first
    if filing_url:
        try:
            r = requests.get(filing_url, headers={"User-Agent": SEC_UA}, timeout=30)
            if r.status_code == 200 and len(r.text) > 500:
                return clean_filing_text(r.text)
        except:
            pass
    
    # Try the full submission txt
    txt_url = f"https://www.sec.gov/Archives/edgar/data/{cik_clean}/{acc_nodash}/{accession_number}.txt"
    try:
        r = requests.get(txt_url, headers={"User-Agent": SEC_UA}, timeout=30)
        if r.status_code == 200 and len(r.text) > 500:
            return clean_filing_text(r.text)
    except:
        pass
    
    # Try index page to find documents
    index_url = f"https://www.sec.gov/Archives/edgar/data/{cik_clean}/{acc_nodash}/"
    try:
        r = requests.get(index_url, headers={"User-Agent": SEC_UA}, timeout=15)
        if r.status_code == 200:
            # Find .htm files
            htm_files = re.findall(r'href="([^"]+\.htm[l]?)"', r.text, re.I)
            for htm in htm_files:
                if any(x in htm.lower() for x in ['10-k', '10k', 'annual']):
                    doc_url = f"https://www.sec.gov/Archives/edgar/data/{cik_clean}/{acc_nodash}/{htm}"
                    try:
                        r2 = requests.get(doc_url, headers={"User-Agent": SEC_UA}, timeout=30)
                        if r2.status_code == 200 and len(r2.text) > 1000:
                            return clean_filing_text(r2.text)
                    except:
                        continue
    except:
        pass
    
    return None

def clean_filing_text(html_text):
    """Strip HTML tags and clean up filing text"""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', html_text)
    # Remove XML declarations
    text = re.sub(r'<\?[^>]+\?>', '', text)
    # Decode HTML entities
    text = text.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    text = text.replace('&nbsp;', ' ').replace('&quot;', '"')
    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Limit size
    if len(text) > 500000:
        text = text[:500000]
    return text

def chunk_text(text, target_tokens=1000):
    """Split text into chunks of approximately target_tokens (rough: 1 token ≈ 4 chars)"""
    target_chars = target_tokens * 4
    chunks = []
    
    # Split by paragraphs first
    paragraphs = text.split('\n')
    current_chunk = ""
    
    for para in paragraphs:
        if len(current_chunk) + len(para) > target_chars and len(current_chunk) > 200:
            chunks.append(current_chunk.strip())
            current_chunk = para
        else:
            current_chunk += "\n" + para
    
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
    
    # If text didn't have newlines, split by character count
    if len(chunks) <= 1 and len(text) > target_chars:
        chunks = []
        for i in range(0, len(text), target_chars):
            chunk = text[i:i+target_chars]
            # Try to break at sentence boundary
            if i + target_chars < len(text):
                last_period = chunk.rfind('.')
                if last_period > target_chars * 0.7:
                    chunk = chunk[:last_period+1]
            chunks.append(chunk.strip())
    
    return [c for c in chunks if len(c) > 50]

def detect_section(chunk_text, chunk_index, total_chunks):
    """Try to detect which section of the 10-K this chunk belongs to"""
    text_lower = chunk_text[:500].lower()
    if "item 1a" in text_lower or "risk factor" in text_lower:
        return "Risk Factors"
    elif "item 1b" in text_lower or "unresolved staff" in text_lower:
        return "Unresolved Staff Comments"
    elif "item 1" in text_lower and "business" in text_lower:
        return "Business"
    elif "item 2" in text_lower and "properties" in text_lower:
        return "Properties"
    elif "item 7a" in text_lower or "quantitative and qualitative" in text_lower:
        return "Market Risk"
    elif "item 7" in text_lower or "management's discussion" in text_lower:
        return "MD&A"
    elif "item 8" in text_lower or "financial statements" in text_lower:
        return "Financial Statements"
    elif chunk_index < total_chunks * 0.1:
        return "Cover/TOC"
    elif chunk_index > total_chunks * 0.9:
        return "Exhibits/Signatures"
    return "Body"

def main():
    print(f"=== 10-K Historical Depth Ingestion ===")
    print(f"Started: {datetime.utcnow().isoformat()}")
    
    # Step 1: Get all companies
    print("\n[1] Fetching companies...")
    companies = get_all_companies()
    print(f"  Found {len(companies)} companies")
    
    # Step 2: Get existing accessions
    print("\n[2] Fetching existing 10-K accessions...")
    existing = get_existing_accessions()
    print(f"  Found {len(existing)} existing 10-K filings")
    
    # Stats
    stats = {
        "companies_processed": 0,
        "filings_found": 0,
        "filings_skipped_dupe": 0,
        "filings_created": 0,
        "chunks_created": 0,
        "errors": 0,
    }
    
    # Step 3: Process each company
    print(f"\n[3] Processing {len(companies)} companies for 10-K filings...")
    
    for idx, company in enumerate(companies):
        ticker = company.get("ticker", "")
        cik = company.get("cik", "")
        company_id = company["id"]
        
        if idx % 50 == 0:
            print(f"\n  Progress: {idx}/{len(companies)} companies | "
                  f"Filings: {stats['filings_created']} new, {stats['filings_skipped_dupe']} dupes | "
                  f"Chunks: {stats['chunks_created']} | Errors: {stats['errors']}")
        
        if not cik or cik == "0000000000":
            continue
        
        try:
            # Query EDGAR
            edgar_filings = query_edgar_10k(cik, ticker)
            
            # Rate limit: 10 req/sec for SEC
            time.sleep(0.12)
            
            for ef in edgar_filings:
                acc = ef.get("accession_number")
                if not acc:
                    continue
                
                stats["filings_found"] += 1
                
                if acc in existing:
                    stats["filings_skipped_dupe"] += 1
                    continue
                
                # Create filing record
                filing_data = {
                    "company_id": company_id,
                    "ticker": ticker,
                    "filing_type": "10-K",
                    "filing_date": ef["filing_date"],
                    "accession_number": acc,
                    "filing_url": ef.get("filing_url", ""),
                    "status": "pending",
                }
                
                result = supabase_post("filings", filing_data)
                if not result or len(result) == 0:
                    stats["errors"] += 1
                    continue
                
                filing_id = result[0]["id"]
                existing.add(acc)
                
                # Fetch full text
                text = fetch_filing_text(ef.get("filing_url", ""), cik, acc)
                time.sleep(0.12)  # Rate limit
                
                if not text or len(text) < 500:
                    # Mark as error
                    supabase_patch("filings", {"id": f"eq.{filing_id}"}, {"status": "error"})
                    stats["errors"] += 1
                    continue
                
                # Chunk the text
                chunks = chunk_text(text)
                
                if not chunks:
                    supabase_patch("filings", {"id": f"eq.{filing_id}"}, {"status": "error"})
                    stats["errors"] += 1
                    continue
                
                # Determine period_end from filing_date
                filing_year = int(ef["filing_date"][:4])
                # 10-K is typically for the prior fiscal year
                period_end = f"{filing_year - 1}-12-31"
                
                # Insert chunks in batches of 150
                total_chunk_count = len(chunks)
                for batch_start in range(0, len(chunks), 150):
                    batch = chunks[batch_start:batch_start+150]
                    chunk_records = []
                    for ci, chunk in enumerate(batch):
                        global_idx = batch_start + ci
                        section = detect_section(chunk, global_idx, total_chunk_count)
                        token_count = len(chunk) // 4
                        chunk_records.append({
                            "filing_id": filing_id,
                            "company_id": company_id,
                            "ticker": ticker,
                            "filing_type": "10-K",
                            "chunk_index": global_idx,
                            "section": section,
                            "content": chunk,
                            "token_count": token_count,
                        })
                    
                    r = supabase_post("filing_chunks", chunk_records)
                    if r:
                        stats["chunks_created"] += len(batch)
                    else:
                        stats["errors"] += 1
                
                # Update filing
                supabase_patch("filings", {"id": f"eq.{filing_id}"}, {
                    "status": "complete",
                    "total_chunks": total_chunk_count,
                    "period_end": period_end,
                })
                
                stats["filings_created"] += 1
                
                if stats["filings_created"] % 10 == 0:
                    print(f"    [10-K] {stats['filings_created']} filings ingested, {stats['chunks_created']} chunks")
            
            stats["companies_processed"] += 1
            
        except Exception as e:
            print(f"  ERROR processing {ticker}: {e}")
            stats["errors"] += 1
            continue
    
    print(f"\n=== 10-K INGESTION COMPLETE ===")
    print(json.dumps(stats, indent=2))
    
    # Write stats
    with open("/tmp/10k_stats.json", "w") as f:
        json.dump(stats, f)

if __name__ == "__main__":
    main()
