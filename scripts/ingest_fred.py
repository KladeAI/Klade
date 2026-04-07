#!/usr/bin/env python3
"""Task 3: FRED economic indicators → economic_indicators table.
Loads 200 key economic series from FRED API."""
import json, urllib.request, urllib.error, socket, time, sys

# Force IPv4
orig_getaddrinfo = socket.getaddrinfo
def ipv4_getaddrinfo(*args, **kwargs):
    return [r for r in orig_getaddrinfo(*args, **kwargs) if r[0] == socket.AF_INET]
socket.getaddrinfo = ipv4_getaddrinfo

SUPABASE_URL = "https://humaesmbiarcqtpdwldg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
FRED_API_KEY = "223274221a49c8b82ac715f31771813d"
BATCH_SIZE = 300

# 200 key economic series organized by category
FRED_SERIES = {
    # GDP & Output (20)
    "GDP": ("Gross Domestic Product", "Quarterly"),
    "GDPC1": ("Real GDP", "Quarterly"),
    "GDPPOT": ("Real Potential GDP", "Quarterly"),
    "A191RL1Q225SBEA": ("Real GDP Growth Rate", "Quarterly"),
    "GDPDEF": ("GDP Implicit Price Deflator", "Quarterly"),
    "NETEXP": ("Net Exports of Goods and Services", "Quarterly"),
    "PCEC96": ("Real Personal Consumption Expenditures", "Quarterly"),
    "GPDI": ("Gross Private Domestic Investment", "Quarterly"),
    "GCE": ("Government Consumption Expenditures", "Quarterly"),
    "INDPRO": ("Industrial Production Index", "Monthly"),
    "TCU": ("Capacity Utilization", "Monthly"),
    "DGORDER": ("Manufacturers New Orders Durable Goods", "Monthly"),
    "AMTMNO": ("Manufacturers New Orders Total", "Monthly"),
    "RSAFS": ("Advance Retail Sales", "Monthly"),
    "HOUST": ("Housing Starts", "Monthly"),
    "PERMIT": ("Building Permits", "Monthly"),
    "BUSINV": ("Total Business Inventories", "Monthly"),
    "ISRATIO": ("Total Business Inventories/Sales Ratio", "Monthly"),
    "CPGDPAI": ("Corporate Profits After Tax", "Quarterly"),
    "CP": ("Corporate Profits After Tax with IVA and CCAdj", "Quarterly"),

    # Labor Market (25)
    "UNRATE": ("Unemployment Rate", "Monthly"),
    "PAYEMS": ("Total Nonfarm Payrolls", "Monthly"),
    "CIVPART": ("Labor Force Participation Rate", "Monthly"),
    "EMRATIO": ("Employment-Population Ratio", "Monthly"),
    "CES0500000003": ("Average Hourly Earnings", "Monthly"),
    "AWHAETP": ("Average Weekly Hours", "Monthly"),
    "ICSA": ("Initial Claims", "Weekly"),
    "CCSA": ("Continued Claims", "Weekly"),
    "JTSJOL": ("Job Openings", "Monthly"),
    "JTSQUR": ("Quits Rate", "Monthly"),
    "JTSHIR": ("Hires Level", "Monthly"),
    "JTSLDR": ("Layoffs and Discharges Rate", "Monthly"),
    "LNS13327709": ("U-6 Unemployment Rate", "Monthly"),
    "NROU": ("Natural Rate of Unemployment", "Quarterly"),
    "USPRIV": ("All Employees Total Private", "Monthly"),
    "MANEMP": ("Manufacturing Employees", "Monthly"),
    "USCONS": ("Construction Employees", "Monthly"),
    "USFIRE": ("Financial Activities Employees", "Monthly"),
    "USINFO": ("Information Sector Employees", "Monthly"),
    "USPBS": ("Professional and Business Services", "Monthly"),
    "USEHS": ("Education and Health Services", "Monthly"),
    "USLEIH": ("Leisure and Hospitality", "Monthly"),
    "USGOVT": ("Government Employees", "Monthly"),
    "CEU0500000008": ("Average Hourly Earnings Production", "Monthly"),
    "CES0500000011": ("Average Weekly Earnings", "Monthly"),

    # Inflation & Prices (20)
    "CPIAUCSL": ("Consumer Price Index All Urban", "Monthly"),
    "CPILFESL": ("Core CPI Less Food and Energy", "Monthly"),
    "CPIUFDSL": ("CPI Food", "Monthly"),
    "CUSR0000SETB01": ("CPI Gasoline", "Monthly"),
    "CPIMEDSL": ("CPI Medical Care", "Monthly"),
    "CUSR0000SEHA": ("CPI Rent of Primary Residence", "Monthly"),
    "PCEPI": ("PCE Price Index", "Monthly"),
    "PCEPILFE": ("Core PCE Price Index", "Monthly"),
    "PPIFIS": ("PPI Final Demand", "Monthly"),
    "WPSFD4131": ("PPI Finished Goods Less Food Energy", "Monthly"),
    "PPIACO": ("PPI All Commodities", "Monthly"),
    "MICH": ("UMich Inflation Expectation", "Monthly"),
    "T5YIE": ("5-Year Breakeven Inflation", "Daily"),
    "T10YIE": ("10-Year Breakeven Inflation", "Daily"),
    "T5YIFR": ("5-Year Forward Inflation", "Daily"),
    "CPALTT01USM657N": ("CPI Annual Change", "Monthly"),
    "GASREGW": ("Regular Gasoline Price", "Weekly"),
    "DCOILWTICO": ("WTI Crude Oil Price", "Daily"),
    "DCOILBRENTEU": ("Brent Crude Oil Price", "Daily"),
    "GOLDAMGBD228NLBM": ("Gold Price London Fix", "Daily"),

    # Interest Rates & Yields (25)
    "FEDFUNDS": ("Federal Funds Rate", "Monthly"),
    "DFF": ("Federal Funds Effective Rate Daily", "Daily"),
    "DFEDTARU": ("Federal Funds Target Upper", "Daily"),
    "DFEDTARL": ("Federal Funds Target Lower", "Daily"),
    "DTB3": ("3-Month Treasury Bill", "Daily"),
    "DGS1": ("1-Year Treasury Rate", "Daily"),
    "DGS2": ("2-Year Treasury Rate", "Daily"),
    "DGS5": ("5-Year Treasury Rate", "Daily"),
    "DGS7": ("7-Year Treasury Rate", "Daily"),
    "DGS10": ("10-Year Treasury Rate", "Daily"),
    "DGS20": ("20-Year Treasury Rate", "Daily"),
    "DGS30": ("30-Year Treasury Rate", "Daily"),
    "T10Y2Y": ("10Y-2Y Treasury Spread", "Daily"),
    "T10Y3M": ("10Y-3M Treasury Spread", "Daily"),
    "MORTGAGE30US": ("30-Year Fixed Mortgage Rate", "Weekly"),
    "MORTGAGE15US": ("15-Year Fixed Mortgage Rate", "Weekly"),
    "DPRIME": ("Bank Prime Loan Rate", "Daily"),
    "DAAA": ("Moody's AAA Corporate Bond Yield", "Daily"),
    "DBAA": ("Moody's BAA Corporate Bond Yield", "Daily"),
    "BAMLC0A0CM": ("ICE BofA US Corporate Total Return", "Daily"),
    "BAMLH0A0HYM2": ("ICE BofA US High Yield Total Return", "Daily"),
    "TEDRATE": ("TED Spread", "Daily"),
    "USD3MTD156N": ("3-Month LIBOR", "Daily"),
    "SOFR": ("Secured Overnight Financing Rate", "Daily"),
    "EFFR": ("Effective Federal Funds Rate", "Daily"),

    # Money Supply & Credit (15)
    "M1SL": ("M1 Money Stock", "Monthly"),
    "M2SL": ("M2 Money Stock", "Monthly"),
    "BOGMBASE": ("Monetary Base", "Monthly"),
    "TOTRESNS": ("Total Reserves", "Monthly"),
    "EXCSRESNS": ("Excess Reserves", "Monthly"),
    "TOTCI": ("Commercial and Industrial Loans", "Weekly"),
    "REALLN": ("Real Estate Loans", "Weekly"),
    "CONSUMER": ("Consumer Loans", "Monthly"),
    "REVOLSL": ("Revolving Consumer Credit", "Monthly"),
    "NONREVSL": ("Nonrevolving Consumer Credit", "Monthly"),
    "TOTALSL": ("Total Consumer Credit", "Monthly"),
    "DPSACBW027SBOG": ("Deposits All Commercial Banks", "Weekly"),
    "H8B1058NCBCMG": ("Large Bank Assets", "Weekly"),
    "BUSLOANS": ("Commercial and Industrial Loans All Banks", "Monthly"),
    "CCLACBW027SBOG": ("Credit Card Loans All Banks", "Weekly"),

    # Housing & Real Estate (15)
    "CSUSHPISA": ("S&P/Case-Shiller Home Price Index", "Monthly"),
    "MSPUS": ("Median Sales Price of Houses Sold", "Quarterly"),
    "ASPUS": ("Average Sales Price of Houses Sold", "Quarterly"),
    "HSN1F": ("New One Family Houses Sold", "Monthly"),
    "EXHOSLUSM495S": ("Existing Home Sales", "Monthly"),
    "MSACSR": ("Monthly Supply of New Houses", "Monthly"),
    "USSTHPI": ("All-Transactions House Price Index", "Quarterly"),
    "RHORUSQ156N": ("Homeownership Rate", "Quarterly"),
    "RRVRUSQ156N": ("Rental Vacancy Rate", "Quarterly"),
    "RHVRUSQ156N": ("Homeowner Vacancy Rate", "Quarterly"),
    "FIXHAI": ("Housing Affordability Index", "Monthly"),
    "UMCSENT": ("UMich Consumer Sentiment", "Monthly"),
    "CSCICP03USM665S": ("Consumer Confidence Index", "Monthly"),
    "TLRESCONS": ("Total Residential Construction", "Monthly"),
    "HOSINVUSM495N": ("Housing Inventory Estimate", "Monthly"),

    # Trade & International (15)
    "BOPGSTB": ("Trade Balance Goods and Services", "Monthly"),
    "BOPGTB": ("Trade Balance Goods", "Monthly"),
    "IMPGS": ("Real Imports of Goods and Services", "Quarterly"),
    "EXPGS": ("Real Exports of Goods and Services", "Quarterly"),
    "DTWEXBGS": ("Trade Weighted US Dollar Index Broad", "Daily"),
    "DEXUSEU": ("USD/EUR Exchange Rate", "Daily"),
    "DEXJPUS": ("JPY/USD Exchange Rate", "Daily"),
    "DEXUSUK": ("USD/GBP Exchange Rate", "Daily"),
    "DEXCHUS": ("CNY/USD Exchange Rate", "Daily"),
    "DEXCAUS": ("CAD/USD Exchange Rate", "Daily"),
    "RBUSBIS": ("Real Broad Dollar Index BIS", "Monthly"),
    "IEABC": ("US International Investment Position", "Quarterly"),
    "IIPUSNETIQ": ("Net International Investment Position", "Quarterly"),
    "IR": ("Import Price Index", "Monthly"),
    "IQ": ("Export Price Index", "Monthly"),

    # Government & Fiscal (15)
    "FYFSD": ("Federal Surplus or Deficit", "Annual"),
    "GFDEBTN": ("Federal Debt Total Public", "Quarterly"),
    "GFDEGDQ188S": ("Federal Debt to GDP Ratio", "Quarterly"),
    "FGEXPND": ("Federal Government Expenditures", "Quarterly"),
    "FGRECPT": ("Federal Government Receipts", "Quarterly"),
    "A091RC1Q027SBEA": ("Federal Government Tax Receipts", "Quarterly"),
    "W068RCQ027SBEA": ("Government Social Benefits", "Quarterly"),
    "SLEXPND": ("State and Local Expenditures", "Quarterly"),
    "FYOINT": ("Federal Interest Outlays", "Annual"),
    "FDHBFIN": ("Federal Debt Held by Foreign Investors", "Monthly"),
    "FDHBFRBN": ("Federal Debt Held by Federal Reserve", "Monthly"),
    "TREAST": ("Treasury Securities Outstanding", "Monthly"),
    "A068RC1Q027SBEA": ("Interest Payments Federal Government", "Quarterly"),
    "W006RC1Q027SBEA": ("Federal Government Spending Total", "Quarterly"),
    "CUUR0000SA0": ("CPI-U All Items", "Monthly"),

    # Financial Markets (15)
    "SP500": ("S&P 500 Index", "Daily"),
    "NASDAQCOM": ("NASDAQ Composite Index", "Daily"),
    "DJIA": ("Dow Jones Industrial Average", "Daily"),
    "WILL5000IND": ("Wilshire 5000 Total Market Index", "Daily"),
    "VIXCLS": ("CBOE Volatility Index VIX", "Daily"),
    "DEXMXUS": ("MXN/USD Exchange Rate", "Daily"),
    "BOGZ1FL073164003Q": ("Nonfinancial Corporate Debt", "Quarterly"),
    "NCBCMDPMVCE": ("Market Value of Corporate Equities", "Quarterly"),
    "BOGZ1FL664090005Q": ("Mutual Fund Total Assets", "Quarterly"),
    "BOGZ1FL893064105Q": ("All Sectors Total Debt Securities", "Quarterly"),
    "RRPONTSYD": ("Overnight Reverse Repurchase Agreements", "Daily"),
    "WTREGEN": ("Fed Total Assets", "Weekly"),
    "WALCL": ("Fed Total Assets (All)", "Weekly"),
    "WSHOMCB": ("Fed MBS Holdings", "Weekly"),
    "TREAST": ("Treasury Securities Outstanding", "Monthly"),

    # Miscellaneous / Leading Indicators (15)
    "USSLIND": ("Leading Index for the US", "Monthly"),
    "BSCICP03USM665S": ("Business Confidence Index", "Monthly"),
    "STLFSI4": ("St. Louis Fed Financial Stress Index", "Weekly"),
    "NFCI": ("Chicago Fed National Financial Conditions", "Weekly"),
    "CFNAI": ("Chicago Fed National Activity Index", "Monthly"),
    "USREC": ("US Recessions", "Monthly"),
    "SAHMREALTIME": ("Sahm Rule Recession Indicator", "Monthly"),
    "DRTSCILM": ("Senior Loan Officer Survey", "Quarterly"),
    "PMSAVE": ("Personal Saving", "Monthly"),
    "PSAVERT": ("Personal Saving Rate", "Monthly"),
    "PI": ("Personal Income", "Monthly"),
    "PCE": ("Personal Consumption Expenditures", "Monthly"),
    "DSPIC96": ("Real Disposable Personal Income", "Monthly"),
    "A229RX0": ("Real DPI Per Capita", "Quarterly"),
    "USEPUINDXD": ("Economic Policy Uncertainty", "Daily"),
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

def fetch_fred_series(series_id):
    """Fetch all observations for a FRED series."""
    url = f"https://api.stlouisfed.org/fred/series/observations?series_id={series_id}&api_key={FRED_API_KEY}&file_type=json&sort_order=asc"
    req = urllib.request.Request(url)
    resp = urllib.request.urlopen(req, timeout=30)
    data = json.loads(resp.read())
    return data.get('observations', [])

def main():
    series_list = list(FRED_SERIES.items())
    # Deduplicate (TREAST appears twice)
    seen = set()
    unique_series = []
    for sid, info in series_list:
        if sid not in seen:
            seen.add(sid)
            unique_series.append((sid, info))
    
    print(f"Total FRED series to fetch: {len(unique_series)}")
    
    total_rows = 0
    total_series = 0
    errors = 0
    
    for i, (series_id, (series_name, frequency)) in enumerate(unique_series):
        try:
            observations = fetch_fred_series(series_id)
            
            rows = []
            for obs in observations:
                val = obs.get('value', '.')
                if val == '.' or val == '':
                    continue
                try:
                    val_float = float(val)
                except (ValueError, TypeError):
                    continue
                
                rows.append({
                    'series_id': series_id,
                    'series_name': series_name,
                    'observation_date': obs['date'],
                    'value': val_float,
                    'unit': 'index' if 'Index' in series_name else 'level',
                    'frequency': frequency,
                })
            
            # Batch insert
            series_total = 0
            for j in range(0, len(rows), BATCH_SIZE):
                batch = rows[j:j+BATCH_SIZE]
                inserted = supabase_post('economic_indicators', batch)
                series_total += inserted
            
            total_rows += series_total
            total_series += 1
            
            if (i + 1) % 10 == 0 or (i + 1) == len(unique_series):
                print(f"  Progress: {i+1}/{len(unique_series)} series, {total_rows} rows total (last: {series_id} = {series_total} obs)")
            
            # FRED rate limit: 120 req/min
            time.sleep(0.6)
            
        except urllib.error.HTTPError as e:
            print(f"  HTTP {e.code} for {series_id}: {e.read().decode()[:100]}")
            errors += 1
            time.sleep(1)
        except Exception as e:
            print(f"  ERROR {series_id}: {e}")
            errors += 1
            time.sleep(1)
    
    print(f"\n{'='*60}")
    print(f"FRED INGESTION COMPLETE")
    print(f"{'='*60}")
    print(f"Series processed: {total_series}/{len(unique_series)}")
    print(f"Total observations inserted: {total_rows}")
    print(f"Errors: {errors}")
    return total_rows

if __name__ == '__main__':
    total = main()
    print(f"RESULT: {total}")
