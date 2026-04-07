#!/usr/bin/env python3
"""Task 2: XBRL bulk facts → fundamentals table.
Downloads companyfacts.zip from SEC EDGAR, extracts key metrics for all S&P 500 companies."""
import json, urllib.request, urllib.error, socket, zipfile, os, sys, time

# Force IPv4
orig_getaddrinfo = socket.getaddrinfo
def ipv4_getaddrinfo(*args, **kwargs):
    return [r for r in orig_getaddrinfo(*args, **kwargs) if r[0] == socket.AF_INET]
socket.getaddrinfo = ipv4_getaddrinfo

SUPABASE_URL = "https://humaesmbiarcqtpdwldg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
USER_AGENT = "Klade AI dev@kladeai.com"
BATCH_SIZE = 300
ZIP_URL = "https://www.sec.gov/Archives/edgar/daily/xbrl/companyfacts.zip"

# Map XBRL tags to canonical metric names
METRICS_MAP = {
    "Revenues": "Revenue",
    "RevenueFromContractWithCustomerExcludingAssessedTax": "Revenue",
    "SalesRevenueNet": "Revenue",
    "RevenueFromContractWithCustomerIncludingAssessedTax": "Revenue",
    "NetIncomeLoss": "NetIncomeLoss",
    "ProfitLoss": "NetIncomeLoss",
    "OperatingIncomeLoss": "OperatingIncomeLoss",
    "EarningsPerShareBasic": "EarningsPerShareBasic",
    "EarningsPerShareDiluted": "EarningsPerShareDiluted",
    "Assets": "Assets",
    "AssetsCurrent": "AssetsCurrent",
    "Liabilities": "Liabilities",
    "LiabilitiesCurrent": "LiabilitiesCurrent",
    "StockholdersEquity": "StockholdersEquity",
    "StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest": "StockholdersEquity",
    "NetCashProvidedByUsedInOperatingActivities": "OperatingCashFlow",
    "NetCashProvidedByUsedInOperatingActivitiesContinuingOperations": "OperatingCashFlow",
    "PaymentsToAcquirePropertyPlantAndEquipment": "CapitalExpenditure",
    "CommonStockSharesOutstanding": "CommonSharesOutstanding",
    "WeightedAverageNumberOfShareOutstandingBasicAndDiluted": "SharesOutstandingDiluted",
    "WeightedAverageNumberOfDilutedSharesOutstanding": "SharesOutstandingDiluted",
    "LongTermDebt": "LongTermDebt",
    "LongTermDebtNoncurrent": "LongTermDebt",
    "CashAndCashEquivalentsAtCarryingValue": "CashAndEquivalents",
    "CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents": "CashAndEquivalents",
    "CostOfRevenue": "CostOfRevenue",
    "CostOfGoodsAndServicesSold": "CostOfRevenue",
    "GrossProfit": "GrossProfit",
    "ResearchAndDevelopmentExpense": "RAndDExpense",
    "SellingGeneralAndAdministrativeExpense": "SGAExpense",
    "InterestExpense": "InterestExpense",
    "InterestExpenseDebt": "InterestExpense",
    "DepreciationDepletionAndAmortization": "DepreciationAmortization",
    "DepreciationAndAmortization": "DepreciationAmortization",
    "IncomeTaxExpenseBenefit": "IncomeTaxExpense",
    "DividendsCommonStockCash": "DividendsPaid",
    "PaymentsOfDividendsCommonStock": "DividendsPaid",
    "PaymentsForRepurchaseOfCommonStock": "ShareRepurchases",
    "PropertyPlantAndEquipmentNet": "PPENet",
    "Goodwill": "Goodwill",
    "AccountsReceivableNetCurrent": "AccountsReceivable",
    "InventoryNet": "Inventory",
    "AccountsPayableCurrent": "AccountsPayable",
    "RetainedEarningsAccumulatedDeficit": "RetainedEarnings",
}

def supabase_post(table, rows, retries=2):
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    data = json.dumps(rows).encode()
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('apikey', SUPABASE_KEY)
    req.add_header('Authorization', f'Bearer {SUPABASE_KEY}')
    req.add_header('Content-Type', 'application/json')
    req.add_header('Prefer', 'return=minimal')
    for attempt in range(retries + 1):
        try:
            urllib.request.urlopen(req, timeout=30)
            return len(rows)
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:300]
            if attempt < retries and e.code in (429, 500, 502, 503):
                time.sleep(2 ** attempt)
                continue
            print(f"  Error inserting {len(rows)} rows to {table}: {e.code} {body[:200]}")
            # Try splitting
            if len(rows) > 50:
                mid = len(rows) // 2
                return supabase_post(table, rows[:mid]) + supabase_post(table, rows[mid:])
            return 0
        except Exception as e:
            if attempt < retries:
                time.sleep(2)
                continue
            print(f"  Network error: {e}")
            return 0

def get_company_map():
    """Get ticker -> company_id + CIK from Supabase."""
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
    
    cik_map = {}  # CIK (zero-padded 10) -> {ticker, company_id}
    for c in all_companies:
        if c.get('cik'):
            cik_padded = c['cik'].lstrip('0').zfill(10)
            cik_map[cik_padded] = {'ticker': c['ticker'], 'company_id': c['id']}
    print(f"Loaded {len(cik_map)} companies from Supabase")
    return cik_map

def download_zip(zip_path):
    """Download companyfacts.zip if not present."""
    if os.path.exists(zip_path) and os.path.getsize(zip_path) > 100_000_000:
        print(f"Using existing {zip_path} ({os.path.getsize(zip_path) / 1e9:.1f} GB)")
        return
    print(f"Downloading companyfacts.zip...")
    req = urllib.request.Request(ZIP_URL, headers={"User-Agent": USER_AGENT})
    resp = urllib.request.urlopen(req, timeout=300)
    total = 0
    with open(zip_path, 'wb') as f:
        while True:
            chunk = resp.read(1024 * 1024)
            if not chunk:
                break
            f.write(chunk)
            total += len(chunk)
            if total % (50 * 1024 * 1024) == 0:
                print(f"  Downloaded {total / 1e6:.0f} MB...")
    print(f"Downloaded {total / 1e6:.0f} MB total")

def extract_facts(company_json, ticker, company_id):
    """Extract key financial metrics from a company's XBRL data."""
    rows = []
    facts = company_json.get('facts', {})
    us_gaap = facts.get('us-gaap', {})
    
    seen = set()
    for gaap_name, canonical_name in METRICS_MAP.items():
        metric_data = us_gaap.get(gaap_name)
        if not metric_data:
            continue
        
        units = metric_data.get('units', {})
        for unit_name, entries in units.items():
            for entry in entries:
                period_end = entry.get('end', '')
                if not period_end:
                    continue
                val = entry.get('val')
                if val is None:
                    continue
                
                form = entry.get('form', '')
                # Only 10-K and 10-Q forms
                if form not in ('10-K', '10-K/A', '10-Q', '10-Q/A'):
                    continue
                
                dedup_key = (canonical_name, period_end, form.replace('/A', ''))
                if dedup_key in seen:
                    continue
                seen.add(dedup_key)
                
                period_type = 'annual' if '10-K' in form else 'quarterly'
                
                rows.append({
                    'company_id': company_id,
                    'ticker': ticker,
                    'period_end': period_end,
                    'period_type': period_type,
                    'metric': canonical_name,
                    'value': val,
                    'unit': unit_name,
                })
    
    return rows

def main():
    home = os.path.expanduser('~')
    zip_path = os.path.join(home, 'companyfacts.zip')
    
    cik_map = get_company_map()
    download_zip(zip_path)
    
    print(f"Opening zip file...")
    zf = zipfile.ZipFile(zip_path, 'r')
    all_names = zf.namelist()
    print(f"Total files in zip: {len(all_names)}")
    
    # Build target file list
    target_files = {}
    for cik_padded, info in cik_map.items():
        fname = f"CIK{cik_padded}.json"
        target_files[fname] = info
    
    matched = [n for n in all_names if n in target_files]
    print(f"Matched {len(matched)} S&P 500 company files")
    
    total_rows = 0
    total_companies = 0
    errors = 0
    batch_buffer = []
    
    for i, fname in enumerate(matched):
        info = target_files[fname]
        ticker = info['ticker']
        company_id = info['company_id']
        
        try:
            raw = zf.read(fname)
            company_json = json.loads(raw)
            rows = extract_facts(company_json, ticker, company_id)
            batch_buffer.extend(rows)
            
            # Flush when buffer is large
            while len(batch_buffer) >= BATCH_SIZE:
                chunk = batch_buffer[:BATCH_SIZE]
                batch_buffer = batch_buffer[BATCH_SIZE:]
                inserted = supabase_post('fundamentals', chunk)
                total_rows += inserted
            
            total_companies += 1
            
            if (i + 1) % 50 == 0 or (i + 1) == len(matched):
                print(f"  Progress: {i+1}/{len(matched)} companies, {total_rows + len(batch_buffer)} rows extracted, {total_rows} inserted")
        
        except Exception as e:
            print(f"  ERROR {fname} ({ticker}): {e}")
            errors += 1
    
    # Flush remaining
    while batch_buffer:
        chunk = batch_buffer[:BATCH_SIZE]
        batch_buffer = batch_buffer[BATCH_SIZE:]
        inserted = supabase_post('fundamentals', chunk)
        total_rows += inserted
    
    zf.close()
    
    print(f"\n{'='*60}")
    print(f"XBRL INGESTION COMPLETE")
    print(f"{'='*60}")
    print(f"Companies processed: {total_companies}")
    print(f"Total fundamentals inserted: {total_rows}")
    print(f"Errors: {errors}")
    return total_rows

if __name__ == '__main__':
    total = main()
    print(f"RESULT: {total}")
