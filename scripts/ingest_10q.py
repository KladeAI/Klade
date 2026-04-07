#!/usr/bin/env python3
"""Task 5: SEC 10-Q filings (last 4 quarters) → filings + filing_chunks tables."""
import json, urllib.request, urllib.error, socket, time, re, html, os

orig_getaddrinfo = socket.getaddrinfo
def ipv4_getaddrinfo(*args, **kwargs):
    return [r for r in orig_getaddrinfo(*args, **kwargs) if r[0] == socket.AF_INET]
socket.getaddrinfo = ipv4_getaddrinfo

SUPABASE_URL = "https://humaesmbiarcqtpdwldg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
USER_AGENT = "Klade AI dev@kladeai.com"
BATCH_SIZE = 50
CHUNK_SIZE = 2000
QUARTERS_TO_FETCH = 4

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
            if e.code == 409: return rows
            if attempt < retries and e.code in (429, 500, 502, 503):
                time.sleep(2 ** attempt); continue
            print(f"  Insert error {table}: {e.code} {body[:200]}")
            return []
        except Exception as e:
            if attempt < retries: time.sleep(2); continue
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
            if e.code == 409: return len(rows)
            body = e.read().decode()[:300]
            if attempt < retries and e.code in (429, 500, 502, 503):
                time.sleep(2 ** attempt); continue
            if len(rows) > 10:
                mid = len(rows) // 2
                return supabase_post_minimal(table, rows[:mid]) + supabase_post_minimal(table, rows[mid:])
            print(f"  Insert error: {e.code} {body[:150]}")
            return 0
        except Exception as e:
            if attempt < retries: time.sleep(2); continue
            return 0

def get_companies():
    all_co = []
    offset = 0
    while True:
        url = f"{SUPABASE_URL}/rest/v1/companies?select=id,ticker,cik&offset={offset}&limit=500"
        req = urllib.request.Request(url, headers={'apikey': SUPABASE_KEY, 'Authorization': f'Bearer {SUPABASE_KEY}'})
        data = json.loads(urllib.request.urlopen(req, timeout=15).read())
        all_co.extend(data)
        if len(data) < 500: break
        offset += 500
    return all_co

def search_filings(cik, form_type="10-Q", count=4):
    url = f"https://data.sec.gov/submissions/CIK{cik}.json"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=30).read())
        recent = data.get('filings', {}).get('recent', {})
        forms = recent.get('form', [])
        dates = recent.get('filingDate', [])
        accessions = recent.get('accessionNumber', [])
        primary_docs = recent.get('primaryDocument', [])
        results = []
        for i, form in enumerate(forms):
            if form == form_type:
                results.append({
                    'form': form, 'date': dates[i],
                    'accession': accessions[i] if i < len(accessions) else '',
                    'primary_doc': primary_docs[i] if i < len(primary_docs) else '',
                })
                if len(results) >= count: break
        return results
    except: return []

def fetch_filing_text(cik, accession, primary_doc):
    cik_clean = cik.lstrip('0')
    accession_clean = accession.replace('-', '')
    url = f"https://www.sec.gov/Archives/edgar/data/{cik_clean}/{accession_clean}/{primary_doc}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        resp = urllib.request.urlopen(req, timeout=60)
        raw = resp.read()
        try: return raw.decode('utf-8')
        except: return raw.decode('latin-1')
    except: return None

def strip_html(text):
    text = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = html.unescape(text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def chunk_text(text, chunk_size=CHUNK_SIZE):
    chunks = []
    words = text.split()
    current = []; current_len = 0
    for word in words:
        current.append(word); current_len += len(word) + 1
        if current_len >= chunk_size:
            chunks.append(' '.join(current)); current = []; current_len = 0
    if current: chunks.append(' '.join(current))
    return chunks

def main():
    resume_file = os.path.expanduser('~/.openclaw/workspace/startup/klade/scripts/.10q_progress')
    done_tickers = set()
    if os.path.exists(resume_file):
        with open(resume_file) as f:
            done_tickers = set(line.strip() for line in f if line.strip())
        print(f"Resuming: {len(done_tickers)} companies already done")
    
    companies = get_companies()
    companies = [c for c in companies if c.get('cik') and c['ticker'] not in done_tickers]
    print(f"Companies to process: {len(companies)}")
    
    total_filings = 0; total_chunks = 0; errors = 0
    
    for i, company in enumerate(companies):
        ticker = company['ticker']; company_id = company['id']; cik = company['cik']
        try:
            filings = search_filings(cik, "10-Q", count=QUARTERS_TO_FETCH)
            if not filings:
                with open(resume_file, 'a') as f: f.write(ticker + '\n')
                continue
            
            for filing in filings:
                filing_row = {
                    'company_id': company_id, 'ticker': ticker, 'filing_type': '10-Q',
                    'filing_date': filing['date'], 'accession_number': filing['accession'],
                    'filing_url': f"https://www.sec.gov/Archives/edgar/data/{cik.lstrip('0')}/{filing['accession'].replace('-','')}/{filing['primary_doc']}",
                    'status': 'processing',
                }
                result = supabase_post('filings', [filing_row])
                filing_id = result[0].get('id') if isinstance(result, list) and result else None
                
                text = fetch_filing_text(cik, filing['accession'], filing['primary_doc'])
                if not text: continue
                
                clean_text = strip_html(text)
                if len(clean_text) < 100: continue
                
                chunks = chunk_text(clean_text)
                chunk_rows = [{
                    'filing_id': filing_id, 'company_id': company_id, 'ticker': ticker,
                    'filing_type': '10-Q', 'chunk_index': idx, 'section': 'General',
                    'content': chunk[:10000], 'token_count': len(chunk.split()),
                } for idx, chunk in enumerate(chunks)]
                
                chunk_count = 0
                for j in range(0, len(chunk_rows), BATCH_SIZE):
                    batch = chunk_rows[j:j+BATCH_SIZE]
                    inserted = supabase_post_minimal('filing_chunks', batch)
                    chunk_count += inserted
                
                if filing_id:
                    update_url = f"{SUPABASE_URL}/rest/v1/filings?id=eq.{filing_id}"
                    req = urllib.request.Request(update_url,
                        data=json.dumps({'total_chunks': chunk_count, 'status': 'complete'}).encode(), method='PATCH')
                    req.add_header('apikey', SUPABASE_KEY)
                    req.add_header('Authorization', f'Bearer {SUPABASE_KEY}')
                    req.add_header('Content-Type', 'application/json')
                    try: urllib.request.urlopen(req, timeout=15)
                    except: pass
                
                total_filings += 1; total_chunks += chunk_count
                time.sleep(0.15)
            
            with open(resume_file, 'a') as f: f.write(ticker + '\n')
            
            if (i + 1) % 10 == 0 or (i + 1) == len(companies):
                print(f"  Progress: {i+1}/{len(companies)} | Filings: {total_filings} | Chunks: {total_chunks} | Errors: {errors}")
            time.sleep(0.1)
        except Exception as e:
            print(f"  ERROR {ticker}: {e}"); errors += 1; time.sleep(1)
    
    print(f"\n{'='*60}")
    print(f"10-Q INGESTION COMPLETE")
    print(f"Filings: {total_filings} | Chunks: {total_chunks} | Errors: {errors}")
    return total_filings, total_chunks

if __name__ == '__main__':
    f, c = main()
    print(f"RESULT: {f} filings, {c} chunks")
