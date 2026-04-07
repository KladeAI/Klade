#!/usr/bin/env python3
"""13-F Institutional Ownership Ingestion"""

import requests
import json
import time
import re
import xml.etree.ElementTree as ET
from datetime import datetime

SUPABASE_URL = "https://humaesmbiarcqtpdwldg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bWFlc21iaWFyY3F0cGR3bGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM1MDQ3MSwiZXhwIjoyMDg4OTI2NDcxfQ.BnKDM4ICmYshqf16VQ7QXXDn_QBpxUScf_AhYuhdc7Q"
SEC_UA = "Klade AI dev@kladeai.com"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

# Top 20 institutional filers with their CIK numbers
INSTITUTIONS = [
    {"name": "Berkshire Hathaway Inc", "cik": "0001067983"},
    {"name": "BlackRock Inc", "cik": "0001364742"},
    {"name": "Vanguard Group Inc", "cik": "0000102909"},
    {"name": "State Street Corp", "cik": "0000093751"},
    {"name": "JPMorgan Chase & Co", "cik": "0000019617"},
    {"name": "Goldman Sachs Group Inc", "cik": "0000886982"},
    {"name": "Morgan Stanley", "cik": "0000895421"},
    {"name": "Fidelity Investments (FMR LLC)", "cik": "0000315066"},
    {"name": "T. Rowe Price Group Inc", "cik": "0001003078"},
    {"name": "Capital Group Companies", "cik": "0000036405"},
    {"name": "Citadel Advisors LLC", "cik": "0001423053"},
    {"name": "Renaissance Technologies LLC", "cik": "0001037389"},
    {"name": "Bridgewater Associates LP", "cik": "0001350694"},
    {"name": "Two Sigma Investments LP", "cik": "0001179392"},
    {"name": "DE Shaw & Co LP", "cik": "0001009207"},
    {"name": "AQR Capital Management LLC", "cik": "0001167557"},
    {"name": "Wellington Management Group LLP", "cik": "0000106926"},
    {"name": "Northern Trust Corp", "cik": "0000073124"},
    {"name": "Bank of New York Mellon Corp", "cik": "0001390777"},
    {"name": "Charles Schwab Corp", "cik": "0000316709"},
]

session = requests.Session()
session.headers.update(HEADERS)

def create_placeholder_company():
    """Create INST placeholder company"""
    r = session.post(f"{SUPABASE_URL}/rest/v1/companies",
        json={
            "ticker": "INST",
            "name": "Institutional Filers",
            "cik": "0000000000",
            "sector": "Institutional",
            "industry": "Institutional Ownership",
        },
        headers={**HEADERS, "Prefer": "resolution=merge-duplicates,return=representation"},
    )
    if r.status_code < 400:
        data = r.json()
        if data:
            return data[0]["id"]
    
    # Try to fetch existing
    r = session.get(f"{SUPABASE_URL}/rest/v1/companies",
        params={"ticker": "eq.INST", "select": "id", "limit": 1})
    data = r.json()
    if data:
        return data[0]["id"]
    return None

def get_13f_filings(cik):
    """Get recent 13-F filings from EDGAR"""
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
            if form in ("13-F", "13F-HR", "13F-HR/A"):
                filing_date = dates[i] if i < len(dates) else None
                if filing_date and filing_date >= "2024-01-01":
                    acc = accessions[i] if i < len(accessions) else None
                    doc = primary_docs[i] if i < len(primary_docs) else ""
                    cik_clean = cik.lstrip("0")
                    acc_nodash = acc.replace("-", "") if acc else ""
                    filing_url = f"https://www.sec.gov/Archives/edgar/data/{cik_clean}/{acc_nodash}/{doc}" if doc else ""
                    filings.append({
                        "form": "13-F",
                        "filing_date": filing_date,
                        "accession_number": acc,
                        "filing_url": filing_url,
                        "cik": cik,
                    })
                    if len(filings) >= 2:  # Latest 2 filings per institution
                        break
        
        return filings
    except Exception as e:
        print(f"  EDGAR error for CIK {cik}: {e}")
        return []

def fetch_13f_holdings(filing_url, cik, accession_number):
    """Fetch 13-F holdings data"""
    acc_nodash = accession_number.replace("-", "")
    cik_clean = cik.lstrip("0")
    
    # Try to find the XML info table
    index_url = f"https://www.sec.gov/Archives/edgar/data/{cik_clean}/{acc_nodash}/"
    
    try:
        r = requests.get(index_url, headers={"User-Agent": SEC_UA}, timeout=15)
        if r.status_code != 200:
            return None
        
        # Look for the information table XML
        xml_files = re.findall(r'href="([^"]*(?:infotable|information|13f|holdings)[^"]*\.xml)"', r.text, re.I)
        if not xml_files:
            # Try any XML file
            xml_files = re.findall(r'href="([^"]+\.xml)"', r.text, re.I)
        
        for xml_file in xml_files:
            xml_url = f"https://www.sec.gov/Archives/edgar/data/{cik_clean}/{acc_nodash}/{xml_file}"
            try:
                r2 = requests.get(xml_url, headers={"User-Agent": SEC_UA}, timeout=20)
                if r2.status_code == 200 and len(r2.text) > 200:
                    return parse_13f_xml(r2.text)
            except:
                continue
        
        # Fallback: try the primary document
        if filing_url:
            r = requests.get(filing_url, headers={"User-Agent": SEC_UA}, timeout=20)
            if r.status_code == 200:
                text = re.sub(r'<[^>]+>', ' ', r.text)
                text = re.sub(r'\s+', ' ', text).strip()
                if len(text) > 200:
                    return text[:100000]
    except:
        pass
    
    return None

def parse_13f_xml(xml_text):
    """Parse 13-F XML into readable holdings text"""
    try:
        # Remove namespace prefixes for easier parsing
        xml_clean = re.sub(r'xmlns[^"]*"[^"]*"', '', xml_text)
        xml_clean = re.sub(r'<(/?)ns1:', r'<\1', xml_clean)
        xml_clean = re.sub(r'<(/?)n1:', r'<\1', xml_clean)
        
        root = ET.fromstring(xml_clean)
        
        holdings = []
        for info in root.iter():
            if 'infotable' in info.tag.lower() or 'infoTable' in info.tag:
                name = ""
                cusip = ""
                value = ""
                shares = ""
                
                for child in info:
                    tag = child.tag.split('}')[-1].lower() if '}' in child.tag else child.tag.lower()
                    if 'nameofissuer' in tag:
                        name = child.text or ""
                    elif 'cusip' in tag:
                        cusip = child.text or ""
                    elif 'value' in tag:
                        value = child.text or ""
                    elif 'sshprnamt' in tag or 'quantity' in tag:
                        for sub in child:
                            subtag = sub.tag.split('}')[-1].lower() if '}' in sub.tag else sub.tag.lower()
                            if 'sshprnamt' in subtag and sub.text:
                                shares = sub.text
                
                if name:
                    holdings.append(f"{name} | CUSIP: {cusip} | Value: ${value}K | Shares: {shares}")
        
        if holdings:
            return "\n".join(holdings)
    except ET.ParseError:
        pass
    
    # Fallback: return cleaned text
    text = re.sub(r'<[^>]+>', ' ', xml_text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text[:100000] if text else None

def chunk_text(text, target_chars=4000):
    chunks = []
    lines = text.split('\n')
    current = ""
    for line in lines:
        if len(current) + len(line) > target_chars and len(current) > 100:
            chunks.append(current.strip())
            current = line
        else:
            current += "\n" + line
    if current.strip():
        chunks.append(current.strip())
    
    if len(chunks) <= 1 and len(text) > target_chars:
        chunks = []
        for i in range(0, len(text), target_chars):
            c = text[i:i+target_chars]
            if c.strip():
                chunks.append(c.strip())
    
    return [c for c in chunks if len(c) > 50]

def main():
    print(f"=== 13-F Institutional Ownership Ingestion ===")
    print(f"Started: {datetime.utcnow().isoformat()}")
    
    # Step 1: Create placeholder company
    print("\n[1] Creating INST placeholder company...")
    inst_id = create_placeholder_company()
    if not inst_id:
        print("  FATAL: Could not create/find INST company")
        return
    print(f"  INST company ID: {inst_id}")
    
    # Get existing 13-F accessions
    existing = set()
    r = session.get(f"{SUPABASE_URL}/rest/v1/filings", params={
        "filing_type": "eq.13-F",
        "select": "accession_number",
        "limit": 5000
    })
    for f in r.json():
        if f.get("accession_number"):
            existing.add(f["accession_number"])
    print(f"  Existing 13-F filings: {len(existing)}")
    
    stats = {"filings_created": 0, "chunks_created": 0, "errors": 0, "skipped": 0}
    
    # Step 2: Process each institution
    print(f"\n[2] Processing {len(INSTITUTIONS)} institutions...")
    
    for inst in INSTITUTIONS:
        name = inst["name"]
        cik = inst["cik"]
        print(f"\n  Processing: {name} (CIK: {cik})")
        
        try:
            filings = get_13f_filings(cik)
            time.sleep(0.15)
            
            if not filings:
                print(f"    No recent 13-F filings found")
                continue
            
            print(f"    Found {len(filings)} 13-F filings")
            
            for ef in filings:
                acc = ef.get("accession_number")
                if acc in existing:
                    stats["skipped"] += 1
                    continue
                
                # Create filing record
                filing_data = {
                    "company_id": inst_id,
                    "ticker": "INST",
                    "filing_type": "13-F",
                    "filing_date": ef["filing_date"],
                    "accession_number": acc,
                    "filing_url": ef.get("filing_url", ""),
                    "status": "pending",
                }
                
                r = session.post(f"{SUPABASE_URL}/rest/v1/filings",
                    json=filing_data,
                    headers={**HEADERS, "Prefer": "return=representation"})
                
                if r.status_code >= 400:
                    print(f"    Filing insert error: {r.status_code} {r.text[:100]}")
                    stats["errors"] += 1
                    continue
                
                result = r.json()
                filing_id = result[0]["id"]
                existing.add(acc)
                
                # Fetch holdings
                holdings_text = fetch_13f_holdings(ef.get("filing_url", ""), cik, acc)
                time.sleep(0.15)
                
                if not holdings_text or len(holdings_text) < 100:
                    session.patch(f"{SUPABASE_URL}/rest/v1/filings",
                        params={"id": f"eq.{filing_id}"},
                        json={"status": "error"},
                        headers={**HEADERS, "Prefer": "return=minimal"})
                    stats["errors"] += 1
                    continue
                
                # Add institution name as header
                full_text = f"Institution: {name}\nCIK: {cik}\nFiling Date: {ef['filing_date']}\n\n{holdings_text}"
                
                # Chunk and insert
                chunks = chunk_text(full_text)
                total_chunks = len(chunks)
                
                for batch_start in range(0, len(chunks), 150):
                    batch = chunks[batch_start:batch_start+150]
                    records = []
                    for ci, chunk in enumerate(batch):
                        records.append({
                            "filing_id": filing_id,
                            "company_id": inst_id,
                            "ticker": "INST",
                            "filing_type": "13-F",
                            "chunk_index": batch_start + ci,
                            "section": f"Holdings - {name}",
                            "content": chunk,
                            "token_count": len(chunk) // 4,
                        })
                    
                    r = session.post(f"{SUPABASE_URL}/rest/v1/filing_chunks",
                        json=records,
                        headers={**HEADERS, "Prefer": "return=minimal"})
                    if r.status_code < 400:
                        stats["chunks_created"] += len(batch)
                    else:
                        print(f"    Chunk insert error: {r.status_code}")
                        stats["errors"] += 1
                
                # Update filing
                session.patch(f"{SUPABASE_URL}/rest/v1/filings",
                    params={"id": f"eq.{filing_id}"},
                    json={"status": "complete", "total_chunks": total_chunks},
                    headers={**HEADERS, "Prefer": "return=minimal"})
                
                stats["filings_created"] += 1
                print(f"    Created filing with {total_chunks} chunks")
        
        except Exception as e:
            print(f"    ERROR: {e}")
            stats["errors"] += 1
            continue
    
    print(f"\n=== 13-F INGESTION COMPLETE ===")
    print(json.dumps(stats, indent=2))
    
    with open("/tmp/13f_stats.json", "w") as f:
        json.dump(stats, f)

if __name__ == "__main__":
    main()
