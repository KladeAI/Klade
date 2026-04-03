# Layer 2: Free Data Source Analysis & Ingestion Roadmap

**Date:** 2026-04-03  
**Author:** Dev (AI Co-founder, Klade AI)  
**Purpose:** Identify, evaluate, and prioritize free public financial/economic data sources for ingestion into Clay's Supabase database to expand the data moat beyond Layer 1's 4.59M records.

---

## Executive Summary

Clay currently operates on **4.59M records** from 5 core sources (SEC EDGAR, XBRL, FRED, Treasury, FDIC). Many of Clay's 225 skills reference data sources that aren't pre-loaded — they rely on live API calls at query time, which means slower responses, potential rate limits, and no historical depth.

### Top 5 Recommendations (Ranked by Client Value)

| Rank | Source | Est. Records | Key Value | Effort | Phase |
|------|--------|-------------|-----------|--------|-------|
| 1 | **BLS (Bureau of Labor Statistics)** | ~800K | CPI, employment, wages — essential for every macro overlay, industry analysis, and due diligence | Easy | 1 |
| 2 | **Damodaran Industry Data** | ~15K | Industry betas, ERP, cost of capital — directly used in every DCF and valuation model | Easy | 1 |
| 3 | **Fama-French Factors** | ~50K | Factor returns for portfolio attribution and risk analysis — table stakes for any portfolio desk | Easy | 1 |
| 4 | **FINRA Short Interest** | ~500K | Short interest by security — critical for market desk, event-driven analysis, risk monitoring | Medium | 1 |
| 5 | **Census Bureau Economic Data** | ~2M | Industry statistics, business dynamics, employment by NAICS — powers industry deep-dives and due diligence | Medium | 2 |

**Total estimated new records across all phases: ~5.5M–7M**  
This would bring Clay's total data moat to **~10–12M records** — a significant competitive advantage.

---

## Detailed Source-by-Source Analysis

### 1. BLS (Bureau of Labor Statistics)

**Priority: 🔴 CRITICAL — Phase 1**

| Field | Detail |
|-------|--------|
| **API Endpoint** | `https://api.bls.gov/publicAPI/v2/timeseries/data/` |
| **Authentication** | Free API key required for v2 (register at bls.gov/developers) |
| **Rate Limits** | v2: 500 queries/day, 50 series per query, 20 years per query |
| **Data Provided** | CPI (all items, categories, metro areas), PPI (by industry/commodity), Employment (NFP, JOLTS, QCEW), Wages (ECI, OES), Productivity, Import/Export prices |
| **Freshness** | Monthly (most series), some quarterly |
| **Est. Records** | ~800,000 (200+ series × 20+ years × monthly observations) |
| **Effort** | **Easy** — clean JSON API, well-documented series IDs, similar to our FRED pipeline |
| **Desks Benefiting** | Market (economic calendar), Research (industry deep-dive), Deal (due diligence), Credit (macro overlay), Wealth (inflation analysis) |
| **API Key Needed?** | ✅ Yes — free registration required |

**Key Series to Ingest:**
- CPI-U (CUSR0000SA0) — headline inflation
- CPI components (food, energy, shelter, medical, etc.)
- PPI by industry (500+ series)
- Total Nonfarm Payrolls (CES0000000001)
- JOLTS (job openings, hires, quits, separations)
- QCEW (employment/wages by county × industry)
- ECI (Employment Cost Index)
- OES (Occupational Employment & Wage Statistics)
- Productivity and Costs (manufacturing, nonfarm business)

**Why Critical:** BLS data is referenced by our `economic-calendar`, `industry-deep-dive`, and `due-diligence-checklist` skills. Every macro analysis Clay produces needs CPI, employment, and wage data. Currently fetched live — pre-loading gives instant response + historical depth.

---

### 2. Damodaran Industry Data (NYU Stern)

**Priority: 🔴 CRITICAL — Phase 1**

| Field | Detail |
|-------|--------|
| **Source URL** | `https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datacurrent.html` |
| **Authentication** | None — public Excel/CSV downloads |
| **Rate Limits** | None (static files) |
| **Data Provided** | Industry-average betas (levered/unlevered), equity risk premiums by country, cost of capital by industry, revenue multiples, EV/EBITDA by sector, margins by industry, debt ratios, tax rates by country, total beta |
| **Freshness** | Updated annually (January) |
| **Est. Records** | ~15,000 (94 industries × 10+ metrics × 10+ years archived) |
| **Effort** | **Easy** — download Excel files, parse with openpyxl/pandas, structured tables |
| **Desks Benefiting** | Modeling (DCF, WACC), Deal (fairness opinions, valuation), Credit (cost of debt), Research (industry comps), PEVC (multiples) |
| **API Key Needed?** | ❌ No |

**Key Datasets:**
- Industry betas (US, Europe, Japan, Emerging Markets)
- Equity risk premiums by country (160+ countries)
- Cost of capital by industry sector
- Revenue/EBITDA multiples by sector
- Operating margins by industry
- Tax rates by country (KPMG source)
- Debt ratios by industry

**Why Critical:** Referenced directly by `model-scaffold` and `fairness-opinion-support` skills. Every DCF model needs industry beta and ERP. Currently, Clay has to web-search for these — pre-loading makes every valuation instant and consistent.

---

### 3. Fama-French Factor Data (Kenneth French Data Library)

**Priority: 🔴 CRITICAL — Phase 1**

| Field | Detail |
|-------|--------|
| **Source URL** | `https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html` |
| **Authentication** | None — public CSV downloads in ZIP files |
| **Rate Limits** | None (static files) |
| **Data Provided** | 3-factor returns (Mkt-RF, SMB, HML), 5-factor returns (+RMW, CMA), Momentum factor, Risk-free rate, industry portfolios, size/value sorted portfolios |
| **Freshness** | Monthly updates |
| **Est. Records** | ~50,000 (daily factors since 1926, monthly/annual aggregates, 49 industry portfolios) |
| **Effort** | **Easy** — download ZIPs, parse fixed-width CSVs. Python library `getFamaFrenchFactors` handles it |
| **Desks Benefiting** | Portfolio (factor attribution, risk analysis), Research (equity analysis), Wealth (performance attribution), Market (factor timing) |
| **API Key Needed?** | ❌ No |

**Key Datasets:**
- F-F 3 factors (daily, monthly, annual) — 1926-present
- F-F 5 factors (daily, monthly, annual) — 1963-present
- Momentum factor (daily, monthly)
- 49-industry portfolios (daily, monthly)
- 25 size/BM portfolios
- International factor data (developed + emerging markets)

**Why Critical:** Referenced in portfolio desk skills. Factor analysis is the foundation of modern portfolio analytics — backtesting, attribution, and risk decomposition all depend on Fama-French data. Boutique wealth managers and family offices need this for performance reporting.

---

### 4. FINRA Short Interest Data

**Priority: 🟡 HIGH — Phase 1**

| Field | Detail |
|-------|--------|
| **API Endpoint** | `https://api.finra.org/data/group/otcMarket/name/EquityShortInterest` |
| **Authentication** | None for public API |
| **Rate Limits** | Reasonable (not heavily documented; no key required) |
| **Data Provided** | Short interest by security (OTC + exchange-listed), settlement date, shares short, days to cover, average daily volume |
| **Freshness** | Twice monthly (mid-month and end-of-month settlement dates) |
| **Est. Records** | ~500,000 (5 years rolling × ~8,000 securities × 24 reports/year) |
| **Effort** | **Medium** — POST-based JSON API with filtering, need to paginate through securities |
| **Desks Benefiting** | AltData (short-interest-monitor skill), Market (event-driven), Research (sentiment signals), Portfolio (risk monitoring) |
| **API Key Needed?** | ❌ No |

**Additional FINRA Data:**
- Short Sale Volume (daily, per security) — much larger dataset
- Monthly Short Interest Files (downloadable, historical back to 2014)

**Why Critical:** Our `short-interest-monitor` skill directly references FINRA data. Short interest is a key signal for event-driven analysis (short squeezes, bearish sentiment), risk monitoring, and activist investor tracking — all high-value for PE shops and boutique banks.

---

### 5. CFTC Commitments of Traders (COT)

**Priority: 🟡 HIGH — Phase 1**

| Field | Detail |
|-------|--------|
| **API Endpoint** | CFTC Public Reporting Environment (PRE) — REST API at `https://publicreporting.cftc.gov/` |
| **Authentication** | None |
| **Rate Limits** | Socrata Open Data API — generous limits |
| **Data Provided** | Futures/options positions by trader category (commercial, non-commercial, managed money), disaggregated and legacy reports, all commodity/financial futures |
| **Freshness** | Weekly (released every Friday for Tuesday positions) |
| **Est. Records** | ~300,000 (20+ years × 52 weeks × ~200 contracts × disaggregated categories) |
| **Effort** | **Easy** — Socrata API with standard filtering, CSV/JSON export. Python `cot_reports` library available |
| **Desks Benefiting** | Market (positioning analysis, sentiment), AltData (alternative signals), Portfolio (commodity exposure), Research (macro overlay) |
| **API Key Needed?** | ❌ No |

**Why Critical:** COT data shows institutional positioning in commodities, rates, and FX — essential for macro analysis and market desk. Family offices with commodity exposure need this. Not yet referenced by any skill, but a valuable addition to the market desk.

---

### 6. Census Bureau Economic Data

**Priority: 🟡 HIGH — Phase 2**

| Field | Detail |
|-------|--------|
| **API Endpoint** | `https://api.census.gov/data/` (multiple datasets) |
| **Authentication** | Free API key required (register at census.gov) |
| **Rate Limits** | 500 queries/day per key |
| **Data Provided** | Economic Census (establishments, sales, payroll by NAICS), County Business Patterns (CBP), Quarterly Workforce Indicators (QWI), Annual Business Survey, Business Dynamics Statistics |
| **Freshness** | Annual (Economic Census every 5 years, CBP annual, QWI quarterly) |
| **Est. Records** | ~2,000,000 (massive geographic × industry × time coverage) |
| **Effort** | **Medium** — Multiple dataset APIs with different schemas, need NAICS code mapping, geographic hierarchies |
| **Desks Benefiting** | Research (industry-deep-dive), Deal (due-diligence-checklist, market sizing), PEVC (industry analysis), Wealth (business valuation context) |
| **API Key Needed?** | ✅ Yes — free registration |

**Key Datasets to Prioritize:**
- County Business Patterns (CBP) — establishments, employment, payroll by NAICS × county
- Economic Census (2022 latest) — detailed industry statistics
- Quarterly Workforce Indicators — employment flows by industry
- Business Dynamics Statistics — firm entry/exit, job creation/destruction since 1978
- Annual Business Survey — innovation, technology use, ownership demographics

**Why Critical:** Referenced by `due-diligence-checklist` and `industry-deep-dive` skills. Industry sizing, competitive landscape, and employment dynamics are fundamental to M&A due diligence and market analysis. Census provides the most granular US industry data available.

---

### 7. PatentsView API (USPTO)

**Priority: 🟡 HIGH — Phase 2**

| Field | Detail |
|-------|--------|
| **API Endpoint** | `https://search.patentsview.org/api/v1/patent/` (27 endpoints) |
| **Authentication** | Free API key required (register at PatentsView) |
| **Rate Limits** | Reasonable; no fixed result cap |
| **Data Provided** | US patent grants (since 1976), pre-grant applications (since 2001), CPC classifications, inventor/assignee data, citation networks, patent claims |
| **Freshness** | Quarterly bulk updates; API near-real-time |
| **Est. Records** | ~1,500,000 (focus on corporate patents for S&P 500 + key industries, not all 12M+ patents) |
| **Effort** | **Medium** — API recently overhauled (2026), need to handle pagination, assignee-to-company mapping |
| **Desks Benefiting** | AltData (patent-intelligence skill), Research (competitive moat analysis), Deal (IP due diligence), PEVC (tech company evaluation) |
| **API Key Needed?** | ✅ Yes — free registration |

**Ingestion Strategy:** Don't ingest all 12M+ patents — focus on:
- S&P 500 company patents (last 10 years)
- Key industry segments (tech, pharma, biotech, energy)
- Citation and classification data for competitive analysis

**Why Critical:** Our `patent-intelligence` skill directly references PatentsView. Patent analytics are high-value for tech-focused PE deals, competitive moat analysis, and industry deep-dives. Mid-market boutique banks doing tech M&A need this.

---

### 8. World Bank Indicators API

**Priority: 🟢 MODERATE — Phase 2**

| Field | Detail |
|-------|--------|
| **API Endpoint** | `https://api.worldbank.org/v2/` |
| **Authentication** | None |
| **Rate Limits** | Generous (public API, no key needed) |
| **Data Provided** | 16,000+ development indicators across 217 countries — GDP, trade, FDI, demographics, infrastructure, governance, financial sector depth |
| **Freshness** | Annual (most indicators), some quarterly |
| **Est. Records** | ~500,000 (focus on 200 key financial/economic indicators × 50 countries × 20 years) |
| **Effort** | **Easy** — clean REST API, JSON/XML, well-documented, Python `wbgapi` library |
| **Desks Benefiting** | Research (international/emerging markets), Deal (cross-border M&A), Credit (sovereign risk), PEVC (market entry analysis) |
| **API Key Needed?** | ❌ No |

**Key Indicators:**
- GDP (current, growth, per capita) by country
- FDI flows (inward/outward)
- Trade data (exports, imports, balance)
- Financial sector indicators (domestic credit, stock market cap/GDP)
- Governance indicators (rule of law, regulatory quality)
- Infrastructure metrics
- Demographics (population, urbanization, labor force)

**Why Critical:** Essential for any cross-border analysis, emerging market research, or international deal work. Family offices with international allocations and boutique banks doing cross-border M&A need country-level macro data.

---

### 9. IMF Data API

**Priority: 🟢 MODERATE — Phase 2**

| Field | Detail |
|-------|--------|
| **API Endpoint** | `http://dataservices.imf.org/REST/SDMX_JSON.svc/` |
| **Authentication** | None |
| **Rate Limits** | 10 requests per second, 50 per minute recommended |
| **Data Provided** | World Economic Outlook (WEO) projections, Balance of Payments, International Financial Statistics (IFS), Government Finance Statistics, commodity prices, exchange rates |
| **Freshness** | Semi-annual (WEO), monthly (IFS), quarterly (BOP) |
| **Est. Records** | ~300,000 (key datasets × countries × time series) |
| **Effort** | **Medium** — SDMX format requires parsing, hierarchical code lists |
| **Desks Benefiting** | Market (global macro), Research (country analysis), Credit (sovereign risk), Portfolio (global allocation) |
| **API Key Needed?** | ❌ No |

**Key Datasets:**
- World Economic Outlook — GDP forecasts, inflation forecasts by country
- International Financial Statistics — exchange rates, interest rates, monetary aggregates
- Balance of Payments — current account, capital flows
- Commodity price indices

**Why Critical:** WEO projections are the gold standard for macro forecasts cited by every major bank. Pre-loading means Clay can instantly reference IMF projections in any macro overlay or country analysis.

---

### 10. SEC N-PORT Fund Holdings

**Priority: 🟢 MODERATE — Phase 2**

| Field | Detail |
|-------|--------|
| **Source** | `https://www.sec.gov/data-research/sec-markets-data/form-n-port-data-sets` |
| **Authentication** | None |
| **Rate Limits** | Bulk ZIP downloads (400-450 MB per quarter) |
| **Data Provided** | Complete portfolio holdings for registered mutual funds and ETFs — security name, CUSIP, quantity, value, asset type, country, coupon, maturity |
| **Freshness** | Monthly (within each quarterly bulk file) |
| **Est. Records** | ~3,000,000+ (but we'd focus on top 500 funds initially: ~500K records) |
| **Effort** | **Hard** — Large XML files within ZIPs, complex schema, need fund-to-family mapping |
| **Desks Benefiting** | Portfolio (fund analysis, flow tracking), Research (institutional positioning), AltData (smart money signals), Wealth (fund selection) |
| **API Key Needed?** | ❌ No |

**Why Critical:** Shows what major mutual funds and ETFs actually hold — a gold mine for institutional flow analysis. Complements 13-F data (which covers hedge funds/institutions) by adding mutual fund/ETF positions. High value for wealth managers doing fund selection.

---

### 11. USAspending.gov — Federal Spending Data

**Priority: 🟢 MODERATE — Phase 3**

| Field | Detail |
|-------|--------|
| **API Endpoint** | `https://api.usaspending.gov/api/v2/` |
| **Authentication** | None |
| **Rate Limits** | None documented; generous public API |
| **Data Provided** | Federal contract awards, grants, loans — recipient, amount, agency, NAICS code, location, period of performance |
| **Freshness** | Near real-time (daily updates) |
| **Est. Records** | ~500,000 (focused on top defense/tech contractors, recent 5 years) |
| **Effort** | **Medium** — POST-based API, need to map recipients to public companies, large result sets |
| **Desks Benefiting** | Research (government contractor analysis), Deal (defense M&A), AltData (government spending signals), Industry (sector analysis) |
| **API Key Needed?** | ❌ No |

**Why Critical:** Government contract data is a major revenue signal for defense, healthcare, and IT companies. Boutique banks working on government contractor M&A need this. PE shops evaluating defense/aerospace targets need contract backlog visibility.

---

### 12. OECD Data API

**Priority: 🟢 MODERATE — Phase 3**

| Field | Detail |
|-------|--------|
| **API Endpoint** | `https://sdmx.oecd.org/public/rest/` (SDMX REST API) |
| **Authentication** | None |
| **Rate Limits** | Fair use limits |
| **Data Provided** | GDP forecasts, leading indicators (CLI), trade data, tax revenue, education/labor stats, housing prices, financial indicators for 38 OECD member countries |
| **Freshness** | Monthly/quarterly depending on indicator |
| **Est. Records** | ~200,000 (focused selection of key indicators) |
| **Effort** | **Medium** — SDMX format, similar to IMF parsing |
| **Desks Benefiting** | Research (international), Market (leading indicators), Credit (country risk), Deal (cross-border) |
| **API Key Needed?** | ❌ No |

---

### 13. FOMC Economic Projections (via FRED)

**Priority: 🟢 MODERATE — Phase 1 (Easy add-on to FRED pipeline)**

| Field | Detail |
|-------|--------|
| **API Endpoint** | Same FRED API (`api.stlouisfed.org`) — FOMC SEP series |
| **Authentication** | FRED API key (we already have this) |
| **Rate Limits** | Same as FRED |
| **Data Provided** | FOMC median projections for GDP growth, unemployment, PCE inflation, federal funds rate (2012-present) |
| **Freshness** | Quarterly (4 FOMC meetings per year with projections) |
| **Est. Records** | ~500 (small but extremely high-value) |
| **Effort** | **Easy** — same FRED pipeline, just add series IDs |
| **Desks Benefiting** | Market (rate expectations), Credit (rate environment), Portfolio (asset allocation), Research (macro outlook) |
| **API Key Needed?** | ✅ Already have it |

**Series to Add:** GDPC1MD, UNRATMD, PCECTPIMD, FEDTARMD + central tendencies

**Why Critical:** Every market commentary and rate analysis references FOMC projections. This is a trivial add to our existing FRED pipeline with outsized impact.

---

### 14. SBA Loan & Small Business Data

**Priority: 🟢 LOW — Phase 3**

| Field | Detail |
|-------|--------|
| **API Endpoint** | `https://data.sba.gov/` (CKAN-based) |
| **Authentication** | None |
| **Rate Limits** | Public |
| **Data Provided** | SBA 7(a) and 504 loan data, small business size standards by NAICS, PPP loan data, small business statistics |
| **Freshness** | Quarterly/annual |
| **Est. Records** | ~200,000 |
| **Effort** | **Easy** — structured CSV/JSON downloads |
| **Desks Benefiting** | Credit (small business lending), PEVC (lower middle market), Wealth (business owner clients) |
| **API Key Needed?** | ❌ No |

---

### 15. SEC Company Tickers/CIK Master File

**Priority: 🟢 LOW — Phase 1 (Quick win)**

| Field | Detail |
|-------|--------|
| **Source** | `https://www.sec.gov/files/company_tickers.json` and `company_tickers_exchange.json` |
| **Authentication** | None |
| **Rate Limits** | None (static file) |
| **Data Provided** | Complete CIK → ticker → company name → exchange mapping for all SEC filers |
| **Freshness** | Daily updates |
| **Est. Records** | ~12,000 (all publicly traded companies) |
| **Effort** | **Easy** — single JSON file download, direct insert |
| **Desks Benefiting** | All desks (company resolution, ticker lookups) |
| **API Key Needed?** | ❌ No |

**Why Critical:** Foundational reference data. Ensures Clay can resolve any ticker to CIK and vice versa — needed for cross-referencing across all data sources.

---

## Prioritized Ingestion Roadmap

### Phase 1: Highest Value + Easiest (Week 1-2)
*Focus: Data that skills already reference + quick wins*

| # | Source | Est. Records | Effort | API Key Needed | Dependencies |
|---|--------|-------------|--------|----------------|--------------|
| 1 | BLS (CPI, NFP, JOLTS, PPI) | 800,000 | Easy | ✅ Register free | None |
| 2 | Damodaran Industry Data | 15,000 | Easy | ❌ | None |
| 3 | Fama-French Factors | 50,000 | Easy | ❌ | None |
| 4 | FINRA Short Interest | 500,000 | Medium | ❌ | None |
| 5 | CFTC Commitments of Traders | 300,000 | Easy | ❌ | None |
| 6 | FOMC Projections (FRED add-on) | 500 | Easy | ✅ Already have | Existing FRED pipeline |
| 7 | SEC Company Tickers Master | 12,000 | Easy | ❌ | None |

**Phase 1 Total: ~1,677,500 new records**  
**Cumulative Total: ~6.27M records**

### Phase 2: High Value + Medium Effort (Week 3-5)
*Focus: Deep industry data, international coverage, fund holdings*

| # | Source | Est. Records | Effort | API Key Needed | Dependencies |
|---|--------|-------------|--------|----------------|--------------|
| 8 | Census Bureau Economic Data | 2,000,000 | Medium | ✅ Register free | NAICS code mapping |
| 9 | PatentsView | 1,500,000 | Medium | ✅ Register free | Company-assignee mapping |
| 10 | World Bank Indicators | 500,000 | Easy | ❌ | None |
| 11 | IMF Data (WEO, IFS) | 300,000 | Medium | ❌ | SDMX parsing |
| 12 | SEC N-PORT (top 500 funds) | 500,000 | Hard | ❌ | XML parsing pipeline |

**Phase 2 Total: ~4,800,000 new records**  
**Cumulative Total: ~11.07M records**

### Phase 3: Nice to Have (Week 6-8)
*Focus: Specialized datasets for specific verticals*

| # | Source | Est. Records | Effort | API Key Needed | Dependencies |
|---|--------|-------------|--------|----------------|--------------|
| 13 | USAspending.gov | 500,000 | Medium | ❌ | Company-recipient mapping |
| 14 | OECD Data | 200,000 | Medium | ❌ | SDMX parsing |
| 15 | SBA Loan Data | 200,000 | Easy | ❌ | None |

**Phase 3 Total: ~900,000 new records**  
**Cumulative Total: ~11.97M records**

---

## API Keys Required (Action Items)

| Source | Registration URL | Status |
|--------|-----------------|--------|
| **BLS v2** | https://data.bls.gov/registrationEngine/ | 🔲 Need to register |
| **Census Bureau** | https://api.census.gov/data/key_signup.html | 🔲 Need to register |
| **PatentsView** | https://patentsview.org/apis/api-key-request | 🔲 Need to register |
| **FRED** | Already have | ✅ Done |

All registrations are free and instant. No payment information required.

---

## Database Schema Considerations

### New Tables Needed

```
bls_observations        — series_id, date, value, period, footnotes
damodaran_industry      — industry, metric, region, year, value
fama_french_factors     — date, factor, value, frequency (daily/monthly)
finra_short_interest    — symbol, settlement_date, short_interest, days_to_cover, avg_volume
cftc_cot_positions      — report_date, contract, trader_category, long, short, spreading
census_cbp              — year, state_fips, county_fips, naics, establishments, employment, payroll
patents                 — patent_id, assignee, title, cpc_class, grant_date, claims_count
world_bank_indicators   — country_code, indicator_id, year, value
imf_weo                 — country_code, indicator, year, value, estimate_flag
nport_holdings          — fund_cik, report_date, security_name, cusip, value, quantity
usa_spending_awards     — award_id, recipient, amount, agency, naics, start_date, end_date
sec_company_tickers     — cik, ticker, company_name, exchange
```

### Indexing Strategy
- All tables: composite index on primary lookup columns
- Time series tables: BRIN index on date columns for range queries
- Text columns: GIN index for full-text search where applicable
- Consider partitioning `bls_observations` and `census_cbp` by year

---

## Effort Estimates by Skill Level

| Task | Estimated Hours | Skills Needed |
|------|----------------|---------------|
| BLS pipeline (Phase 1) | 8-12 hrs | Python, BLS API, Supabase |
| Damodaran scraper | 4-6 hrs | Python, Excel parsing |
| Fama-French loader | 3-4 hrs | Python, CSV parsing |
| FINRA pipeline | 8-10 hrs | Python, REST API, pagination |
| CFTC COT pipeline | 6-8 hrs | Python, Socrata API |
| FOMC addition to FRED | 1-2 hrs | Extend existing pipeline |
| SEC tickers loader | 1-2 hrs | Python, JSON, Supabase |
| Census Bureau pipeline | 16-20 hrs | Python, Census API, NAICS mapping |
| PatentsView pipeline | 12-16 hrs | Python, new API format, entity resolution |
| World Bank pipeline | 6-8 hrs | Python, REST API |
| IMF pipeline | 10-12 hrs | Python, SDMX parsing |
| N-PORT pipeline | 20-24 hrs | Python, XML parsing, large files |

**Total: ~96-124 hours of development across all phases**

---

## Impact on Clay's 15 Desks

| Desk | Current Data Sources | New Sources (Phase 1-2) | Skills Unblocked |
|------|---------------------|------------------------|-----------------|
| **Market** | FRED, SEC | BLS, CFTC, FOMC | economic-calendar, positioning analysis |
| **Research** | SEC, XBRL | BLS, Census, Damodaran, PatentsView | industry-deep-dive, patent-intelligence |
| **Modeling** | XBRL, SEC | Damodaran | model-scaffold, fairness-opinion-support |
| **Deal** | SEC, XBRL | Census, PatentsView | due-diligence-checklist, IP analysis |
| **Portfolio** | FRED | Fama-French, FINRA, N-PORT | factor attribution, short monitoring |
| **AltData** | SEC (Form 4, 13-F) | FINRA, PatentsView, CFTC | short-interest-monitor, patent-intelligence |
| **Credit** | FRED, FDIC, SEC | BLS, IMF, World Bank | macro overlays, sovereign analysis |
| **Wealth** | FRED, XBRL | Fama-French, BLS, World Bank | performance attribution, inflation analysis |
| **PEVC** | SEC, XBRL | Census, PatentsView | industry analysis, IP due diligence |
| **Accounting** | XBRL, SEC | Damodaran | cost of capital references |
| **Client** | — | All (indirect) | Better data = better deliverables |
| **Judgment** | — | All (indirect) | Compliance checks with more data |
| **Connectors** | SEC | SEC tickers | Universal company resolution |

---

## Competitive Analysis: Data Coverage vs. Competitors

| Data Source | Klade (Current) | Klade (After L2) | ROGO | AlphaSense |
|------------|----------------|-------------------|------|------------|
| SEC Filings | ✅ | ✅ | ✅ | ✅ |
| XBRL Fundamentals | ✅ | ✅ | ✅ | ⚠️ |
| FRED Macro | ✅ | ✅ | ⚠️ | ❌ |
| BLS Labor/Inflation | ❌ | ✅ | ❌ | ❌ |
| Industry Betas/ERP | ❌ | ✅ | ❌ | ❌ |
| Fama-French Factors | ❌ | ✅ | ❌ | ❌ |
| Short Interest | ❌ | ✅ | ❌ | ⚠️ |
| Patent Intelligence | ❌ | ✅ | ❌ | ⚠️ |
| Census Industry Data | ❌ | ✅ | ❌ | ❌ |
| COT Positioning | ❌ | ✅ | ❌ | ❌ |
| Fund Holdings (N-PORT) | ❌ | ✅ | ⚠️ | ❌ |
| World Bank/IMF | ❌ | ✅ | ❌ | ❌ |
| Gov't Contracts | ❌ | ✅ | ❌ | ❌ |
| **Total Records** | **4.59M** | **~12M** | **~5M est.** | **~3M est.** |

**Key Insight:** After Layer 2, Clay would have broader free-data coverage than both ROGO and AlphaSense. Our competitors focus on proprietary/premium data (expert transcripts, broker research). Our moat is the depth and breadth of FREE public data — pre-loaded, instantly queryable, with full historical depth. This is a fundamentally different strategy: they charge for access to premium sources, we charge for intelligence on top of comprehensive free data.

---

## Risk Factors

1. **API Rate Limits:** BLS (500/day) and Census (500/day) limit ingestion speed. Plan multi-day campaigns similar to Layer 1
2. **Data Quality:** Census and BLS data can have revisions. Need to handle upserts, not just inserts
3. **Schema Changes:** PatentsView recently overhauled their API (2026). Monitor for breaking changes
4. **Storage Costs:** 12M records on Supabase Pro is well within limits, but monitor IOPS during ingestion
5. **Damodaran Data:** Excel files on personal faculty page — no SLA. Consider caching/archiving
6. **N-PORT Files:** 400-450 MB ZIPs per quarter — need adequate disk space for processing

---

## Next Steps

1. **Immediately:** Register for BLS, Census, and PatentsView API keys (free, instant)
2. **This week:** Build BLS pipeline (reuse FRED pipeline pattern), ingest Damodaran + Fama-French (small, quick wins)
3. **Next week:** FINRA short interest + CFTC COT pipelines
4. **Week 3-4:** Census Bureau + PatentsView pipelines
5. **Week 5+:** World Bank, IMF, N-PORT

---

*This document is the source of truth for Layer 2 data expansion planning. Update as sources are ingested and validated.*
