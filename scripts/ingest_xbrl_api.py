#!/usr/bin/env python3
"""Task 2: XBRL facts via individual SEC EDGAR API → fundamentals table.
Fetches companyfacts for each S&P 500 company via API (since zip URL is 404)."""
import json, urllib.request, urllib.error, socket, os, sys, time

# Force IPv4
orig_getaddrinfo = socket.getaddrinfo
def ipv4_getaddrinfo(*args, **kwargs):
    return [r for r in orig_getaddrinfo(*args, **kwargs) if r[0] == socket.AF_INET]
socket.getaddrinfo = ipv4_getaddrinfo

SUPABASE_URL = "https://humaesmbiarcqtpdwldg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
USER_AGENT = "Klade AI dev@kladeai.com"
BATCH_SIZE = 300
SEC_API_BASE = "https://data.sec.gov/api/xbrl/companyfacts"

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
    req.add_header('Prefer', 'return=minimal,resolution=ignore-duplicates')
    for attempt in range(retries + 1):
        try:
            urllib.request.urlopen(req, timeout=30)
            return len(rows)
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:300]
            if e.code == 409:
                return len(rows)  # duplicates ignored
            if attempt < retries and e.code in (429, 500, 502, 503):
                time.sleep(2 ** attempt)
                continue
            if len(rows) > 50:
                mid = len(rows) // 2
                return supabase_post(table, rows[:mid]) + supabase_post(table, rows[mid:])
            print(f"  Insert error: {e.code} {body[:150]}")
            return 0
        except Exception as e:
            if attempt < retries:
                time.sleep(2)
                continue
            print(f"  Network error: {e}")
            return 0

def get_companies():
    """Get all companies from Supabase."""
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

def fetch_company_facts(cik):
    """Fetch XBRL facts for a company from SEC EDGAR."""
    url = f"{SEC_API_BASE}/CIK{cik}.json"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    resp = urllib.request.urlopen(req, timeout=30)
    return json.loads(resp.read())

def extract_facts(company_json, ticker, company_id):
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
    # Check for resume point
    resume_file = os.path.expanduser('~/.openclaw/workspace/startup/klade/scripts/.xbrl_progress')
    done_tickers = set()
    if os.path.exists(resume_file):
        with open(resume_file) as f:
            done_tickers = set(f.read().strip().split('\n'))
        print(f"Resuming: {len(done_tickers)} companies already done")
    
    companies = get_companies()
    print(f"Total companies: {len(companies)}")
    
    # Filter to ones with CIK
    companies = [c for c in companies if c.get('cik')]
    # Skip already done
    companies = [c for c in companies if c['ticker'] not in done_tickers]
    print(f"Companies to process: {len(companies)}")
    
    total_rows = 0
    total_companies = 0
    errors = 0
    batch_buffer = []
    
    for i, company in enumerate(companies):
        ticker = company['ticker']
        company_id = company['id']
        cik = company['cik'].lstrip('0').zfill(10)
        
        try:
            data = fetch_company_facts(cik)
            rows = extract_facts(data, ticker, company_id)
            batch_buffer.extend(rows)
            
            while len(batch_buffer) >= BATCH_SIZE:
                chunk = batch_buffer[:BATCH_SIZE]
                batch_buffer = batch_buffer[BATCH_SIZE:]
                inserted = supabase_post('fundamentals', chunk)
                total_rows += inserted
            
            total_companies += 1
            
            # Save progress
            with open(resume_file, 'a') as f:
                f.write(ticker + '\n')
            
            if (i + 1) % 20 == 0 or (i + 1) == len(companies):
                print(f"  Progress: {i+1}/{len(companies)} companies, ~{total_rows + len(batch_buffer)} rows, {errors} errors")
            
            # SEC rate limit: ~10 req/sec max, be conservative
            time.sleep(0.15)
            
        except urllib.error.HTTPError as e:
            if e.code == 404:
                # Company not in XBRL database
                with open(resume_file, 'a') as f:
                    f.write(ticker + '\n')
            else:
                print(f"  HTTP {e.code} for {ticker} (CIK {cik})")
                errors += 1
                time.sleep(1)
        except Exception as e:
            print(f"  ERROR {ticker}: {e}")
            errors += 1
            time.sleep(1)
    
    # Flush remaining
    while batch_buffer:
        chunk = batch_buffer[:BATCH_SIZE]
        batch_buffer = batch_buffer[BATCH_SIZE:]
        inserted = supabase_post('fundamentals', chunk)
        total_rows += inserted
    
    print(f"\n{'='*60}")
    print(f"XBRL API INGESTION COMPLETE")
    print(f"{'='*60}")
    print(f"Companies processed: {total_companies}")
    print(f"Total fundamentals inserted: {total_rows}")
    print(f"Errors: {errors}")
    return total_rows

if __name__ == '__main__':
    total = main()
    print(f"RESULT: {total}")
