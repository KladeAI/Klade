#!/usr/bin/env python3
"""Phase 4: Historical 10-K backfill — fetch 10-K filings from 2010-2025 for all S&P 500 companies.

Expands filing_chunks coverage from ~3 days to 15 years of 10-K full-text data.
Uses SEC EDGAR submissions API to find all historical 10-K filings per company,
downloads full text, chunks it, and inserts into Supabase.

Resume-safe: tracks completed tickers in /tmp/10k_historical_resume.txt
"""
import json, urllib.request, urllib.error, socket, time, re, html, os, sys

# ── Force IPv4 ──────────────────────────────────────────────────────────────
orig_getaddrinfo = socket.getaddrinfo
def ipv4_getaddrinfo(*args, **kwargs):
    return [r for r in orig_getaddrinfo(*args, **kwargs) if r[0] == socket.AF_INET]
socket.getaddrinfo = ipv4_getaddrinfo

# ── Config ──────────────────────────────────────────────────────────────────
SUPABASE_URL = "https://humaesmbiarcqtpdwldg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
USER_AGENT = "Klade AI dev@kladeai.com"
BATCH_SIZE = 50
CHUNK_SIZE = 2000  # chars per chunk
MAX_CHUNK_CONTENT = 10000
SEC_DELAY = 0.2  # seconds between SEC requests
DB_DELAY = 2.0   # seconds between Supabase batch inserts
RESUME_FILE = "/tmp/10k_historical_resume.txt"
MIN_YEAR = 2010
MAX_YEAR = 2025

# Priority order: biggest/most important companies first
PRIORITY_TICKERS = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA", "BRK-B",
    "JPM", "GS", "MS", "BAC", "WFC", "C", "V", "MA",
    "JNJ", "UNH", "PFE", "ABBV", "MRK", "LLY", "TMO", "ABT",
    "XOM", "CVX", "COP", "SLB", "EOG",
    "HD", "LOW", "TGT", "WMT", "COST", "AMGN",
    "DIS", "NFLX", "CMCSA", "CRM", "ORCL", "ADBE", "INTC", "AMD",
    "PG", "KO", "PEP", "MCD", "NKE", "SBUX",
    "CAT", "DE", "BA", "GE", "RTX", "LMT", "HON",
    "BLK", "SCHW", "AXP", "SPGI", "MCO", "ICE",
]

# ── Supabase helpers ────────────────────────────────────────────────────────
def supabase_request(url, method='GET', data=None, headers_extra=None, timeout=30):
    """Generic Supabase request."""
    req = urllib.request.Request(url, method=method)
    req.add_header('apikey', SUPABASE_KEY)
    req.add_header('Authorization', f'Bearer {SUPABASE_KEY}')
    if data is not None:
        req.data = json.dumps(data).encode()
        req.add_header('Content-Type', 'application/json')
    if headers_extra:
        for k, v in headers_extra.items():
            req.add_header(k, v)
    return urllib.request.urlopen(req, timeout=timeout)

def supabase_post_returning(table, rows, retries=2):
    """Insert rows and return the inserted data (for getting IDs)."""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    headers = {'Prefer': 'return=representation,resolution=ignore-duplicates'}
    for attempt in range(retries + 1):
        try:
            resp = supabase_request(url, 'POST', rows, headers, timeout=60)
            return json.loads(resp.read())
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:300]
            if e.code == 409:
                return rows
            if attempt < retries and e.code in (429, 500, 502, 503):
                time.sleep(2 ** (attempt + 1))
                continue
            print(f"    Insert error {table}: {e.code} {body[:200]}")
            return []
        except Exception as e:
            if attempt < retries:
                time.sleep(2)
                continue
            print(f"    Network error: {e}")
            return []

def supabase_post_minimal(table, rows, retries=2):
    """Insert rows with minimal return (faster for bulk)."""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    headers = {'Prefer': 'return=minimal,resolution=ignore-duplicates'}
    for attempt in range(retries + 1):
        try:
            supabase_request(url, 'POST', rows, headers, timeout=60)
            return len(rows)
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:300]
            if e.code == 409:
                return len(rows)
            if attempt < retries and e.code in (429, 500, 502, 503):
                time.sleep(2 ** (attempt + 1))
                continue
            # Split batch on persistent errors
            if len(rows) > 5:
                mid = len(rows) // 2
                a = supabase_post_minimal(table, rows[:mid])
                time.sleep(DB_DELAY)
                b = supabase_post_minimal(table, rows[mid:])
                return a + b
            print(f"    Insert error {table}: {e.code} {body[:200]}")
            return 0
        except Exception as e:
            if attempt < retries:
                time.sleep(2)
                continue
            print(f"    Network error: {e}")
            return 0

def get_existing_accessions():
    """Get all existing accession numbers from filings table."""
    existing = set()
    offset = 0
    while True:
        url = f"{SUPABASE_URL}/rest/v1/filings?select=accession_number&offset={offset}&limit=1000"
        try:
            resp = supabase_request(url, timeout=30)
            data = json.loads(resp.read())
            for row in data:
                if row.get('accession_number'):
                    existing.add(row['accession_number'])
            if len(data) < 1000:
                break
            offset += 1000
        except Exception as e:
            print(f"  Error fetching existing accessions: {e}")
            break
    return existing

def get_companies():
    """Get all companies from Supabase."""
    all_companies = []
    offset = 0
    while True:
        url = f"{SUPABASE_URL}/rest/v1/companies?select=id,ticker,cik,name&offset={offset}&limit=500"
        try:
            resp = supabase_request(url, timeout=15)
            data = json.loads(resp.read())
            all_companies.extend(data)
            if len(data) < 500:
                break
            offset += 500
        except Exception as e:
            print(f"  Error fetching companies: {e}")
            break
    return all_companies

# ── SEC EDGAR helpers ───────────────────────────────────────────────────────
def fetch_all_10k_filings(cik, min_year=MIN_YEAR, max_year=MAX_YEAR):
    """Fetch ALL 10-K filing metadata from EDGAR submissions API for a given CIK."""
    padded_cik = cik.zfill(10)
    url = f"https://data.sec.gov/submissions/CIK{padded_cik}.json"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        data = json.loads(resp.read())
    except Exception as e:
        print(f"    EDGAR submissions error: {e}")
        return []
    
    results = []
    
    # Process recent filings
    recent = data.get('filings', {}).get('recent', {})
    results.extend(_extract_10k_from_submission(recent, cik, min_year, max_year))
    
    # Process older filings from additional files
    older_files = data.get('filings', {}).get('files', [])
    for file_info in older_files:
        fname = file_info.get('name', '')
        if not fname:
            continue
        file_url = f"https://data.sec.gov/submissions/{fname}"
        req2 = urllib.request.Request(file_url, headers={"User-Agent": USER_AGENT})
        time.sleep(SEC_DELAY)
        try:
            resp2 = urllib.request.urlopen(req2, timeout=30)
            older_data = json.loads(resp2.read())
            results.extend(_extract_10k_from_submission(older_data, cik, min_year, max_year))
        except Exception as e:
            print(f"    Error fetching older submissions {fname}: {e}")
            continue
    
    # Sort by date descending (newest first)
    results.sort(key=lambda x: x['date'], reverse=True)
    return results

def _extract_10k_from_submission(sub_data, cik, min_year, max_year):
    """Extract 10-K filings from a submissions data block."""
    forms = sub_data.get('form', [])
    dates = sub_data.get('filingDate', [])
    accessions = sub_data.get('accessionNumber', [])
    primary_docs = sub_data.get('primaryDocument', [])
    
    results = []
    for i, form in enumerate(forms):
        if form not in ('10-K', '10-K/A'):
            continue
        if i >= len(dates) or i >= len(accessions) or i >= len(primary_docs):
            continue
        
        date = dates[i]
        try:
            year = int(date[:4])
        except (ValueError, IndexError):
            continue
        
        if year < min_year or year > max_year:
            continue
        
        results.append({
            'form': form,
            'date': date,
            'accession': accessions[i],
            'primary_doc': primary_docs[i],
        })
    
    return results

def fetch_filing_text(cik, accession, primary_doc):
    """Fetch the full text of a filing from EDGAR."""
    cik_clean = cik.lstrip('0')
    accession_clean = accession.replace('-', '')
    url = f"https://www.sec.gov/Archives/edgar/data/{cik_clean}/{accession_clean}/{primary_doc}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        resp = urllib.request.urlopen(req, timeout=90)
        raw = resp.read()
        try:
            text = raw.decode('utf-8')
        except UnicodeDecodeError:
            text = raw.decode('latin-1')
        return text
    except Exception as e:
        print(f"    Fetch error ({url[:80]}...): {e}")
        return None

# ── Text processing ─────────────────────────────────────────────────────────
def strip_html(text):
    """Remove HTML tags and clean up text."""
    text = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = html.unescape(text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n+', '\n\n', text)
    return text.strip()

def chunk_text(text, chunk_size=CHUNK_SIZE):
    """Split text into chunks of ~chunk_size characters."""
    chunks = []
    words = text.split()
    current = []
    current_len = 0
    
    for word in words:
        wl = len(word) + 1
        if current_len + wl > chunk_size and current:
            chunks.append(' '.join(current))
            current = [word]
            current_len = wl
        else:
            current.append(word)
            current_len += wl
    
    if current:
        chunks.append(' '.join(current))
    
    return chunks

def identify_section(text_chunk):
    """Try to identify the SEC filing section from chunk text."""
    text_lower = text_chunk[:500].lower()
    sections = [
        ('item 1a', 'Risk Factors'),
        ('item 1b', 'Unresolved Staff Comments'),
        ('item 1c', 'Cybersecurity'),
        ('item 1.', 'Business'),
        ('item 2.', 'Properties'),
        ('item 3.', 'Legal Proceedings'),
        ('item 4.', 'Mine Safety'),
        ('item 5.', 'Market for Common Equity'),
        ('item 6.', 'Selected Financial Data'),
        ('item 7a', 'Quantitative Disclosures'),
        ('item 7.', 'MD&A'),
        ('item 8.', 'Financial Statements'),
        ('item 9a', 'Controls and Procedures'),
        ('item 9.', 'Changes in Accounting'),
        ('item 10', 'Directors and Officers'),
        ('item 11', 'Executive Compensation'),
        ('item 12', 'Security Ownership'),
        ('item 13', 'Certain Relationships'),
        ('item 14', 'Principal Accountant Fees'),
        ('item 15', 'Exhibits'),
    ]
    for key, val in sections:
        if key in text_lower:
            return val
    return 'General'

# ── Main ────────────────────────────────────────────────────────────────────
def main():
    start_time = time.time()
    
    # Load resume state
    done_tickers = set()
    if os.path.exists(RESUME_FILE):
        with open(RESUME_FILE) as f:
            done_tickers = set(line.strip() for line in f if line.strip())
        print(f"Resuming: {len(done_tickers)} companies already processed")
    
    # Get companies
    companies = get_companies()
    print(f"Total companies in DB: {len(companies)}")
    
    # Build lookup
    company_map = {c['ticker']: c for c in companies}
    
    # Order: priority tickers first, then alphabetical
    ordered = []
    seen = set()
    for t in PRIORITY_TICKERS:
        if t in company_map and t not in done_tickers:
            ordered.append(company_map[t])
            seen.add(t)
    for c in sorted(companies, key=lambda x: x['ticker']):
        if c['ticker'] not in seen and c['ticker'] not in done_tickers:
            ordered.append(c)
            seen.add(c['ticker'])
    
    print(f"Companies to process: {len(ordered)} (skipping {len(done_tickers)} already done)")
    
    # Get existing accessions to skip duplicates
    print("Loading existing accession numbers...")
    existing_accessions = get_existing_accessions()
    print(f"Existing filings in DB: {len(existing_accessions)}")
    
    total_filings = 0
    total_chunks = 0
    total_skipped = 0
    errors = 0
    
    for i, company in enumerate(ordered):
        ticker = company['ticker']
        company_id = company['id']
        cik = company.get('cik', '')
        name = company.get('name', ticker)
        
        if not cik:
            print(f"  [{i+1}/{len(ordered)}] {ticker}: No CIK, skipping")
            _mark_done(ticker)
            continue
        
        elapsed = time.time() - start_time
        print(f"  [{i+1}/{len(ordered)}] {ticker} ({name[:30]}) | CIK {cik} | elapsed {elapsed/60:.1f}m")
        
        try:
            # Fetch all 10-K filings for this company
            time.sleep(SEC_DELAY)
            filings = fetch_all_10k_filings(cik)
            
            if not filings:
                print(f"    No 10-K filings found")
                _mark_done(ticker)
                continue
            
            company_filings = 0
            company_chunks = 0
            
            for filing in filings:
                accession = filing['accession']
                
                # Skip if already in DB
                if accession in existing_accessions:
                    total_skipped += 1
                    continue
                
                # Insert filing record
                cik_clean = cik.lstrip('0')
                acc_clean = accession.replace('-', '')
                filing_url = f"https://www.sec.gov/Archives/edgar/data/{cik_clean}/{acc_clean}/{filing['primary_doc']}"
                
                filing_row = {
                    'company_id': company_id,
                    'ticker': ticker,
                    'filing_type': filing['form'],
                    'filing_date': filing['date'],
                    'accession_number': accession,
                    'filing_url': filing_url,
                    'status': 'processing',
                }
                
                result = supabase_post_returning('filings', [filing_row])
                time.sleep(DB_DELAY)
                
                filing_id = None
                if isinstance(result, list) and result:
                    filing_id = result[0].get('id')
                
                if not filing_id:
                    # Try to get ID by querying
                    try:
                        q_url = f"{SUPABASE_URL}/rest/v1/filings?accession_number=eq.{accession}&select=id&limit=1"
                        resp = supabase_request(q_url, timeout=15)
                        q_data = json.loads(resp.read())
                        if q_data:
                            filing_id = q_data[0]['id']
                    except:
                        pass
                
                if not filing_id:
                    print(f"    Could not get filing_id for {accession}, skipping chunks")
                    errors += 1
                    continue
                
                # Add to existing set
                existing_accessions.add(accession)
                
                # Fetch filing text
                time.sleep(SEC_DELAY)
                text = fetch_filing_text(cik, accession, filing['primary_doc'])
                if not text:
                    errors += 1
                    # Update filing status to failed
                    try:
                        patch_url = f"{SUPABASE_URL}/rest/v1/filings?id=eq.{filing_id}"
                        supabase_request(patch_url, 'PATCH', {'status': 'failed'},
                                        {'Prefer': 'return=minimal'}, timeout=15)
                    except:
                        pass
                    continue
                
                # Strip HTML and chunk
                clean_text = strip_html(text)
                if len(clean_text) < 100:
                    print(f"    Filing text too short ({len(clean_text)} chars): {accession}")
                    continue
                
                chunks = chunk_text(clean_text)
                
                # Build chunk rows
                chunk_rows = []
                for idx, chunk in enumerate(chunks):
                    section = identify_section(chunk) if idx < 30 else 'General'
                    chunk_rows.append({
                        'filing_id': filing_id,
                        'company_id': company_id,
                        'ticker': ticker,
                        'filing_type': filing['form'],
                        'chunk_index': idx,
                        'section': section,
                        'content': chunk[:MAX_CHUNK_CONTENT],
                        'token_count': len(chunk.split()),
                    })
                
                # Batch insert chunks
                chunk_count = 0
                for j in range(0, len(chunk_rows), BATCH_SIZE):
                    batch = chunk_rows[j:j + BATCH_SIZE]
                    inserted = supabase_post_minimal('filing_chunks', batch)
                    chunk_count += inserted
                    time.sleep(DB_DELAY)
                
                # Update filing status
                try:
                    patch_url = f"{SUPABASE_URL}/rest/v1/filings?id=eq.{filing_id}"
                    supabase_request(patch_url, 'PATCH',
                                    {'total_chunks': chunk_count, 'status': 'complete'},
                                    {'Prefer': 'return=minimal'}, timeout=15)
                except:
                    pass
                
                company_filings += 1
                company_chunks += chunk_count
                total_filings += 1
                total_chunks += chunk_count
            
            print(f"    → {len(filings)} found, {company_filings} new filings, {company_chunks} chunks inserted")
            _mark_done(ticker)
            
        except Exception as e:
            print(f"    ERROR: {e}")
            errors += 1
            _mark_done(ticker)  # Don't retry failed companies endlessly
            time.sleep(1)
        
        # Progress report every 5 companies
        if (i + 1) % 5 == 0:
            elapsed = time.time() - start_time
            rate = total_filings / (elapsed / 60) if elapsed > 0 else 0
            print(f"\n  ══ PROGRESS ══ {i+1}/{len(ordered)} companies | "
                  f"{total_filings} filings | {total_chunks} chunks | "
                  f"{total_skipped} skipped | {errors} errors | "
                  f"{elapsed/60:.1f}m elapsed | {rate:.1f} filings/min\n")
    
    # Final summary
    elapsed = time.time() - start_time
    print(f"\n{'='*70}")
    print(f"  PHASE 4 HISTORICAL 10-K BACKFILL COMPLETE")
    print(f"{'='*70}")
    print(f"  Companies processed: {len(ordered)}")
    print(f"  New filings inserted: {total_filings}")
    print(f"  New chunks inserted:  {total_chunks}")
    print(f"  Filings skipped (dup): {total_skipped}")
    print(f"  Errors:               {errors}")
    print(f"  Runtime:              {elapsed/60:.1f} minutes")
    print(f"{'='*70}")
    
    return total_filings, total_chunks

def _mark_done(ticker):
    """Mark a ticker as done in the resume file."""
    with open(RESUME_FILE, 'a') as f:
        f.write(ticker + '\n')

if __name__ == '__main__':
    filings, chunks = main()
    print(f"\nRESULT: {filings} filings, {chunks} chunks")
