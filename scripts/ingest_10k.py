#!/usr/bin/env python3
"""Task 4: SEC 10-K filings → filings + filing_chunks tables.
Fetches most recent 10-K for each S&P 500 company, downloads full text, chunks it."""
import json, urllib.request, urllib.error, socket, time, re, html, os

# Force IPv4
orig_getaddrinfo = socket.getaddrinfo
def ipv4_getaddrinfo(*args, **kwargs):
    return [r for r in orig_getaddrinfo(*args, **kwargs) if r[0] == socket.AF_INET]
socket.getaddrinfo = ipv4_getaddrinfo

SUPABASE_URL = "https://humaesmbiarcqtpdwldg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
USER_AGENT = "Klade AI dev@kladeai.com"
BATCH_SIZE = 50  # smaller for chunks with large text
CHUNK_SIZE = 2000  # chars per chunk

def supabase_post(table, rows, retries=2):
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    data = json.dumps(rows).encode()
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('apikey', SUPABASE_KEY)
    req.add_header('Authorization', f'Bearer {SUPABASE_KEY}')
    req.add_header('Content-Type', 'application/json')
    req.add_header('Prefer', 'return=representation,resolution=ignore-duplicates')
    for attempt in range(retries + 1):
        try:
            resp = urllib.request.urlopen(req, timeout=60)
            return json.loads(resp.read())
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:300]
            if e.code == 409:
                return rows  # duplicates, fine
            if attempt < retries and e.code in (429, 500, 502, 503):
                time.sleep(2 ** attempt)
                continue
            print(f"  Insert error {table}: {e.code} {body[:200]}")
            return []
        except Exception as e:
            if attempt < retries:
                time.sleep(2)
                continue
            print(f"  Network error: {e}")
            return []

def supabase_post_minimal(table, rows, retries=2):
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    data = json.dumps(rows).encode()
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('apikey', SUPABASE_KEY)
    req.add_header('Authorization', f'Bearer {SUPABASE_KEY}')
    req.add_header('Content-Type', 'application/json')
    req.add_header('Prefer', 'return=minimal,resolution=ignore-duplicates')
    for attempt in range(retries + 1):
        try:
            urllib.request.urlopen(req, timeout=60)
            return len(rows)
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:300]
            if e.code == 409:
                return len(rows)
            if attempt < retries and e.code in (429, 500, 502, 503):
                time.sleep(2 ** attempt)
                continue
            if len(rows) > 10:
                mid = len(rows) // 2
                return supabase_post_minimal(table, rows[:mid]) + supabase_post_minimal(table, rows[mid:])
            print(f"  Insert error {table}: {e.code} {body[:200]}")
            return 0
        except Exception as e:
            if attempt < retries:
                time.sleep(2)
                continue
            print(f"  Network error: {e}")
            return 0

def get_companies():
    all_companies = []
    offset = 0
    while True:
        url = f"{SUPABASE_URL}/rest/v1/companies?select=id,ticker,cik&offset={offset}&limit=500"
        req = urllib.request.Request(url)
        req.add_header('apikey', SUPABASE_KEY)
        req.add_header('Authorization', f'Bearer {SUPABASE_KEY}')
        data = json.loads(urllib.request.urlopen(req, timeout=15).read())
        all_companies.extend(data)
        if len(data) < 500:
            break
        offset += 500
    return all_companies

def search_filings(cik, form_type="10-K", count=1):
    """Search EDGAR EFTS for filings."""
    cik_clean = cik.lstrip('0')
    url = f"https://efts.sec.gov/LATEST/search-index?q=%22{form_type}%22&dateRange=custom&startdt=2023-01-01&enddt=2026-12-31&forms={form_type}&from=0&size={count}"
    # Use the submissions API instead
    url = f"https://data.sec.gov/submissions/CIK{cik}.json"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        data = json.loads(resp.read())
        recent = data.get('filings', {}).get('recent', {})
        forms = recent.get('form', [])
        dates = recent.get('filingDate', [])
        accessions = recent.get('accessionNumber', [])
        primary_docs = recent.get('primaryDocument', [])
        
        results = []
        for i, form in enumerate(forms):
            if form == form_type and i < len(dates):
                results.append({
                    'form': form,
                    'date': dates[i],
                    'accession': accessions[i] if i < len(accessions) else '',
                    'primary_doc': primary_docs[i] if i < len(primary_docs) else '',
                })
                if len(results) >= count:
                    break
        return results
    except Exception as e:
        return []

def fetch_filing_text(cik, accession, primary_doc):
    """Fetch the full text of a filing."""
    cik_clean = cik.lstrip('0')
    accession_clean = accession.replace('-', '')
    url = f"https://www.sec.gov/Archives/edgar/data/{cik_clean}/{accession_clean}/{primary_doc}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        resp = urllib.request.urlopen(req, timeout=60)
        raw = resp.read()
        try:
            text = raw.decode('utf-8')
        except:
            text = raw.decode('latin-1')
        return text
    except Exception as e:
        print(f"  Fetch error: {e}")
        return None

def strip_html(text):
    """Remove HTML tags and clean up text."""
    # Remove script/style
    text = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', text, flags=re.DOTALL|re.IGNORECASE)
    # Remove tags
    text = re.sub(r'<[^>]+>', ' ', text)
    # Decode entities
    text = html.unescape(text)
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\n\s*\n', '\n\n', text)
    return text.strip()

def chunk_text(text, chunk_size=CHUNK_SIZE):
    """Split text into chunks, trying to break at sentence boundaries."""
    chunks = []
    words = text.split()
    current = []
    current_len = 0
    
    for word in words:
        current.append(word)
        current_len += len(word) + 1
        
        if current_len >= chunk_size:
            chunk_text = ' '.join(current)
            chunks.append(chunk_text)
            current = []
            current_len = 0
    
    if current:
        chunks.append(' '.join(current))
    
    return chunks

def identify_section(text_chunk):
    """Try to identify the SEC filing section."""
    text_lower = text_chunk[:500].lower()
    sections = {
        'Item 1.': 'Business',
        'Item 1A.': 'Risk Factors',
        'Item 1B.': 'Unresolved Staff Comments',
        'Item 2.': 'Properties',
        'Item 3.': 'Legal Proceedings',
        'Item 4.': 'Mine Safety',
        'Item 5.': 'Market for Common Equity',
        'Item 6.': 'Selected Financial Data',
        'Item 7.': 'MD&A',
        'Item 7A.': 'Quantitative Disclosures',
        'Item 8.': 'Financial Statements',
        'Item 9.': 'Changes in Accounting',
        'Item 9A.': 'Controls and Procedures',
        'Item 10.': 'Directors and Officers',
        'Item 11.': 'Executive Compensation',
        'Item 12.': 'Security Ownership',
        'Item 13.': 'Certain Relationships',
        'Item 14.': 'Principal Accountant Fees',
        'Item 15.': 'Exhibits',
    }
    for key, val in sections.items():
        if key.lower() in text_lower:
            return val
    return 'General'

def main():
    # Resume support
    resume_file = os.path.expanduser('~/.openclaw/workspace/startup/klade/scripts/.10k_progress')
    done_tickers = set()
    if os.path.exists(resume_file):
        with open(resume_file) as f:
            done_tickers = set(line.strip() for line in f if line.strip())
        print(f"Resuming: {len(done_tickers)} companies already done")
    
    companies = get_companies()
    companies = [c for c in companies if c.get('cik') and c['ticker'] not in done_tickers]
    print(f"Companies to process: {len(companies)}")
    
    total_filings = 0
    total_chunks = 0
    errors = 0
    
    for i, company in enumerate(companies):
        ticker = company['ticker']
        company_id = company['id']
        cik = company['cik']
        
        try:
            # Find most recent 10-K
            filings = search_filings(cik, "10-K", count=1)
            if not filings:
                with open(resume_file, 'a') as f:
                    f.write(ticker + '\n')
                continue
            
            filing = filings[0]
            
            # Insert filing record
            filing_row = {
                'company_id': company_id,
                'ticker': ticker,
                'filing_type': '10-K',
                'filing_date': filing['date'],
                'accession_number': filing['accession'],
                'filing_url': f"https://www.sec.gov/Archives/edgar/data/{cik.lstrip('0')}/{filing['accession'].replace('-','')}/{filing['primary_doc']}",
                'status': 'processing',
            }
            result = supabase_post('filings', [filing_row])
            if not result:
                errors += 1
                continue
            
            filing_id = result[0].get('id') if isinstance(result, list) and result else None
            
            # Fetch filing text
            text = fetch_filing_text(cik, filing['accession'], filing['primary_doc'])
            if not text:
                errors += 1
                with open(resume_file, 'a') as f:
                    f.write(ticker + '\n')
                continue
            
            # Strip HTML and chunk
            clean_text = strip_html(text)
            if len(clean_text) < 100:
                print(f"  {ticker}: Filing text too short ({len(clean_text)} chars)")
                with open(resume_file, 'a') as f:
                    f.write(ticker + '\n')
                continue
            
            chunks = chunk_text(clean_text)
            
            # Insert chunks
            chunk_rows = []
            for idx, chunk in enumerate(chunks):
                section = identify_section(chunk) if idx < 20 else 'General'
                chunk_rows.append({
                    'filing_id': filing_id,
                    'company_id': company_id,
                    'ticker': ticker,
                    'filing_type': '10-K',
                    'chunk_index': idx,
                    'section': section,
                    'content': chunk[:10000],  # cap content length
                    'token_count': len(chunk.split()),
                })
            
            # Batch insert chunks
            chunk_count = 0
            for j in range(0, len(chunk_rows), BATCH_SIZE):
                batch = chunk_rows[j:j+BATCH_SIZE]
                inserted = supabase_post_minimal('filing_chunks', batch)
                chunk_count += inserted
            
            # Update filing with chunk count
            if filing_id:
                update_url = f"{SUPABASE_URL}/rest/v1/filings?id=eq.{filing_id}"
                update_data = json.dumps({'total_chunks': chunk_count, 'status': 'complete'}).encode()
                req = urllib.request.Request(update_url, data=update_data, method='PATCH')
                req.add_header('apikey', SUPABASE_KEY)
                req.add_header('Authorization', f'Bearer {SUPABASE_KEY}')
                req.add_header('Content-Type', 'application/json')
                req.add_header('Prefer', 'return=minimal')
                try:
                    urllib.request.urlopen(req, timeout=15)
                except:
                    pass
            
            total_filings += 1
            total_chunks += chunk_count
            
            with open(resume_file, 'a') as f:
                f.write(ticker + '\n')
            
            if (i + 1) % 10 == 0 or (i + 1) == len(companies):
                print(f"  Progress: {i+1}/{len(companies)} | Filings: {total_filings} | Chunks: {total_chunks} | Errors: {errors}")
            
            # Rate limit
            time.sleep(0.2)
            
        except Exception as e:
            print(f"  ERROR {ticker}: {e}")
            errors += 1
            time.sleep(1)
    
    print(f"\n{'='*60}")
    print(f"10-K INGESTION COMPLETE")
    print(f"{'='*60}")
    print(f"Filings inserted: {total_filings}")
    print(f"Chunks inserted: {total_chunks}")
    print(f"Errors: {errors}")
    return total_filings, total_chunks

if __name__ == '__main__':
    f, c = main()
    print(f"RESULT: {f} filings, {c} chunks")
