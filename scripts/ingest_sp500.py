#!/usr/bin/env python3
"""Task 1: Load S&P 500 companies into companies table."""
import json, urllib.request, urllib.error, ssl, socket, os

# Force IPv4
orig_getaddrinfo = socket.getaddrinfo
def ipv4_getaddrinfo(*args, **kwargs):
    return [r for r in orig_getaddrinfo(*args, **kwargs) if r[0] == socket.AF_INET]
socket.getaddrinfo = ipv4_getaddrinfo

SUPABASE_URL = "https://humaesmbiarcqtpdwldg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
USER_AGENT = "Klade AI dev@kladeai.com"

def fetch_sec_ticker_map():
    """Get ticker->CIK map from SEC."""
    req = urllib.request.Request("https://www.sec.gov/files/company_tickers.json",
                                 headers={"User-Agent": USER_AGENT})
    data = json.loads(urllib.request.urlopen(req, timeout=30).read())
    sec_map = {}
    for entry in data.values():
        sec_map[entry['ticker'].upper()] = {
            'cik': str(entry['cik_str']).zfill(10),
            'name': entry['title']
        }
    print(f"SEC ticker map: {len(sec_map)} companies")
    return sec_map

def get_sp500_tickers():
    """Current S&P 500 tickers."""
    return [
        "AAPL","ABBV","ABT","ACN","ADBE","ADI","ADM","ADP","ADSK","AEE",
        "AEP","AES","AFL","AIG","AIZ","AJG","AKAM","ALB","ALGN","ALK",
        "ALL","ALLE","AMAT","AMCR","AMD","AME","AMGN","AMP","AMT","AMZN",
        "ANET","ANSS","AON","AOS","APA","APD","APH","APTV","ARE","ATO",
        "AVGO","AVY","AWK","AXP","AZO","BA","BAC","BAX","BBWI",
        "BBY","BDX","BEN","BIO","BIIB","BK","BKNG","BKR","BLK",
        "BMY","BR","BRO","BSX","BWA","BXP","C","CAG","CAH",
        "CARR","CAT","CB","CBOE","CBRE","CCI","CCL","CDAY","CDNS","CDW",
        "CE","CEG","CF","CFG","CHD","CHRW","CHTR","CI","CINF","CL",
        "CLX","CMA","CMCSA","CME","CMG","CMI","CMS","CNC","CNP","COF",
        "COO","COP","COST","CPB","CPRT","CPT","CRL","CRM","CSCO","CSGP",
        "CSX","CTAS","CTRA","CTSH","CTVA","CVS","CVX","CZR","D",
        "DAL","DD","DE","DFS","DG","DGX","DHI","DHR","DIS",
        "DLR","DLTR","DOV","DOW","DPZ","DRI","DTE","DUK","DVA","DVN",
        "DXCM","EA","EBAY","ECL","ED","EFX","EIX","EL","EMN",
        "EMR","ENPH","EOG","EPAM","EQIX","EQR","EQT","ES","ESS","ETN",
        "ETR","ETSY","EVRG","EW","EXC","EXPD","EXPE","EXR","F","FANG",
        "FAST","FBHS","FCX","FDS","FDX","FE","FFIV","FIS","FISV","FITB",
        "FLT","FMC","FOX","FOXA","FRT","FTNT","FTV","GD","GE",
        "GEHC","GEN","GILD","GIS","GL","GLW","GM","GNRC","GOOG","GOOGL",
        "GPC","GPN","GRMN","GS","GWW","HAL","HAS","HBAN","HCA","HD",
        "HOLX","HON","HPE","HPQ","HRL","HSIC","HST","HSY","HUM","HWM",
        "IBM","ICE","IDXX","IEX","IFF","ILMN","INCY","INTC","INTU","INVH",
        "IP","IPG","IQV","IR","IRM","ISRG","IT","ITW","IVZ","J",
        "JBHT","JCI","JKHY","JNJ","JNPR","JPM","K","KDP","KEY","KEYS",
        "KHC","KIM","KLAC","KMB","KMI","KMX","KO","KR","L","LDOS",
        "LEN","LH","LHX","LIN","LKQ","LLY","LMT","LNC","LNT","LOW",
        "LRCX","LUMN","LUV","LVS","LW","LYB","LYV","MA","MAA","MAR",
        "MAS","MCD","MCHP","MCK","MCO","MDLZ","MDT","MET","META","MGM",
        "MHK","MKC","MKTX","MLM","MMC","MMM","MNST","MO","MOH","MOS",
        "MPC","MPWR","MRK","MRNA","MRO","MS","MSCI","MSFT","MSI","MTB",
        "MTCH","MTD","MU","NCLH","NDAQ","NDSN","NEE","NEM","NFLX","NI",
        "NKE","NOC","NOW","NRG","NSC","NTAP","NTRS","NUE","NVDA","NVR",
        "NWL","NWS","NWSA","NXPI","O","ODFL","OGN","OKE","OMC","ON",
        "ORCL","ORLY","OTIS","OXY","PARA","PAYC","PAYX","PCAR","PCG","PEAK",
        "PEG","PEP","PFE","PFG","PG","PGR","PH","PHM","PKG","PKI",
        "PLD","PM","PNC","PNR","PNW","POOL","PPG","PPL","PRU","PSA",
        "PSX","PTC","PVH","PWR","PXD","PYPL","QCOM","QRVO","RCL","RE",
        "REG","REGN","RF","RHI","RJF","RL","RMD","ROK","ROL","ROP",
        "ROST","RSG","RTX","RVTY","SBAC","SBUX","SCHW","SEE","SHW",
        "SJM","SLB","SNA","SNPS","SO","SPG","SPGI","SRE","STE",
        "STT","STX","STZ","SWK","SWKS","SYF","SYK","SYY","T","TAP",
        "TDG","TDY","TECH","TEL","TER","TFC","TFX","TGT","TMO","TMUS",
        "TPR","TRGP","TRMB","TROW","TRV","TSCO","TSLA","TSN","TT","TTWO",
        "TXN","TXT","TYL","UAL","UDR","UHS","ULTA","UNH","UNP","UPS",
        "URI","USB","V","VFC","VICI","VLO","VMC","VRSK","VRSN","VRTX",
        "VTR","VTRS","VZ","WAB","WAT","WBA","WBD","WDC","WEC","WELL",
        "WFC","WHR","WM","WMB","WMT","WRB","WRK","WST","WTW","WY",
        "WYNN","XEL","XOM","XRAY","XYL","YUM","ZBH","ZBRA","ZION","ZTS"
    ]

# GICS Sector mapping for common S&P 500 companies
SECTOR_MAP = {
    "AAPL": ("Information Technology", "Technology Hardware"),
    "MSFT": ("Information Technology", "Systems Software"),
    "AMZN": ("Consumer Discretionary", "Internet & Direct Marketing Retail"),
    "GOOGL": ("Communication Services", "Interactive Media"),
    "GOOG": ("Communication Services", "Interactive Media"),
    "META": ("Communication Services", "Interactive Media"),
    "NVDA": ("Information Technology", "Semiconductors"),
    "TSLA": ("Consumer Discretionary", "Automobile Manufacturers"),
    "JPM": ("Financials", "Diversified Banks"),
    "V": ("Financials", "Transaction & Payment Processing"),
    "UNH": ("Health Care", "Managed Health Care"),
    "JNJ": ("Health Care", "Pharmaceuticals"),
    "XOM": ("Energy", "Integrated Oil & Gas"),
    "WMT": ("Consumer Staples", "Hypermarkets & Super Centers"),
    "MA": ("Financials", "Transaction & Payment Processing"),
    "PG": ("Consumer Staples", "Household Products"),
    "HD": ("Consumer Discretionary", "Home Improvement Retail"),
    "CVX": ("Energy", "Integrated Oil & Gas"),
    "LLY": ("Health Care", "Pharmaceuticals"),
    "ABBV": ("Health Care", "Biotechnology"),
    "MRK": ("Health Care", "Pharmaceuticals"),
    "PEP": ("Consumer Staples", "Soft Drinks & Non-alcoholic Beverages"),
    "KO": ("Consumer Staples", "Soft Drinks & Non-alcoholic Beverages"),
    "AVGO": ("Information Technology", "Semiconductors"),
    "COST": ("Consumer Staples", "Hypermarkets & Super Centers"),
    "TMO": ("Health Care", "Life Sciences Tools & Services"),
    "ADBE": ("Information Technology", "Application Software"),
    "CRM": ("Information Technology", "Application Software"),
    "ACN": ("Information Technology", "IT Consulting"),
    "MCD": ("Consumer Discretionary", "Restaurants"),
    "BAC": ("Financials", "Diversified Banks"),
    "CSCO": ("Information Technology", "Communications Equipment"),
    "ABT": ("Health Care", "Health Care Equipment"),
    "NFLX": ("Communication Services", "Movies & Entertainment"),
    "AMD": ("Information Technology", "Semiconductors"),
    "INTC": ("Information Technology", "Semiconductors"),
    "DIS": ("Communication Services", "Movies & Entertainment"),
    "ORCL": ("Information Technology", "Systems Software"),
    "BA": ("Industrials", "Aerospace & Defense"),
    "GS": ("Financials", "Investment Banking"),
    "CAT": ("Industrials", "Construction Machinery"),
    "GE": ("Industrials", "Industrial Conglomerates"),
}

def supabase_post(table, rows):
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    data = json.dumps(rows).encode()
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('apikey', SUPABASE_KEY)
    req.add_header('Authorization', f'Bearer {SUPABASE_KEY}')
    req.add_header('Content-Type', 'application/json')
    req.add_header('Prefer', 'return=minimal')
    try:
        urllib.request.urlopen(req, timeout=30)
        return len(rows)
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:500]
        print(f"  Error: {e.code} {body}")
        return 0

def main():
    sec_map = fetch_sec_ticker_map()
    sp500_tickers = get_sp500_tickers()
    
    rows = []
    missing = []
    for ticker in sp500_tickers:
        lookup = ticker.replace('.', '-')
        info = sec_map.get(lookup) or sec_map.get(ticker)
        if info:
            sector_info = SECTOR_MAP.get(ticker, (None, None))
            rows.append({
                'ticker': ticker,
                'name': info['name'],
                'cik': info['cik'],
                'sector': sector_info[0],
                'industry': sector_info[1],
                'exchange': 'NYSE/NASDAQ',
                'country': 'US',
            })
        else:
            missing.append(ticker)
    
    print(f"Matched {len(rows)} companies, missing {len(missing)}: {missing}")
    
    total = 0
    batch_size = 100
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i+batch_size]
        inserted = supabase_post('companies', batch)
        total += inserted
        print(f"  Batch {i//batch_size + 1}: {inserted} rows (total: {total})")
    
    print(f"\nTotal companies inserted: {total}")
    return total

if __name__ == '__main__':
    main()
