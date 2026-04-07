# Layer 1 Overhaul — Master Orchestrator

**Plan:** 7-Day Layer 1 Database Overhaul  
**Start:** 2026-03-27 | **End:** 2026-04-03  
**Target:** 690K → 4.6M records  
**Tracker:** [`day-tracker.json`](./day-tracker.json)

---

## Current Database Stats

| Metric | Baseline | Current | Target |
|--------|----------|---------|--------|
| Companies | 472 | 499 | 500+ |
| Filings | 480 | 480 | 5,000+ |
| Chunks | 82,372 | 82,372 | 500K+ |
| XBRL facts | 0 | 359,661 | 1M+ |
| FRED observations | 248,273 | 248,273 | 750K+ |
| **Total records** | **330,645** | **690,306** | **4,600,000** |

*Last updated: 2026-03-27 18:31 UTC*

---

## Day-by-Day Task Tracker

### Day 1 — 2026-03-27 (TODAY)

| Task | Status | Subagent | Est. Records | Actual | Notes |
|------|--------|----------|-------------|--------|-------|
| Complete S&P 500 10-K ingestion | 🔄 in-progress | `sp500-status-finish` | 50,000 | — | Finishing remaining ~28 companies from S&P 500 list |
| XBRL bulk download + ingestion | ✅ complete | `xbrl-pipeline-build` | 350,000 | 359,661 | SEC EDGAR XBRL companyfacts bulk zip → Supabase |

### Day 2 — 2026-03-28

| Task | Status | Subagent | Est. Records | Actual | Notes |
|------|--------|----------|-------------|--------|-------|
| 10-Q ingestion batch 1 (250 companies) | ⬜ not-started | — | 200,000 | — | Quarterly filings, most recent 4 quarters |
| 10-Q ingestion batch 2 (250 companies) | ⬜ not-started | — | 200,000 | — | Remaining S&P 500 companies |

### Day 3 — 2026-03-29

| Task | Status | Subagent | Est. Records | Actual | Notes |
|------|--------|----------|-------------|--------|-------|
| 8-K material events (last 12 months) | ⬜ not-started | — | 500,000 | — | Material events: earnings, M&A, leadership changes |

### Day 4 — 2026-03-30

| Task | Status | Subagent | Est. Records | Actual | Notes |
|------|--------|----------|-------------|--------|-------|
| FRED expansion (44→200 series) | ⬜ not-started | — | 500,000 | — | Macro indicators: employment, housing, trade, commodities |
| 13-F institutional ownership | ⬜ not-started | — | 400,000 | — | Top fund holdings from SEC 13-F filings |

### Day 5 — 2026-03-31

| Task | Status | Subagent | Est. Records | Actual | Notes |
|------|--------|----------|-------------|--------|-------|
| Form 4 insider trades | ⬜ not-started | — | 600,000 | — | Officer/director buy/sell from SEC Form 4 |
| FDIC bank financials | ⬜ not-started | — | 300,000 | — | Call report data for US banks |

### Day 6 — 2026-04-01

| Task | Status | Subagent | Est. Records | Actual | Notes |
|------|--------|----------|-------------|--------|-------|
| Historical 10-K depth (3 years) | ⬜ not-started | — | 500,000 | — | Extend 10-K coverage to 2023, 2022, 2021 filings |
| Treasury.gov data | ⬜ not-started | — | 300,000 | — | Treasury rates, auctions, fiscal data |

### Day 7 — 2026-04-02

| Task | Status | Subagent | Est. Records | Actual | Notes |
|------|--------|----------|-------------|--------|-------|
| Data quality validation sprint | ⬜ not-started | — | 0 | — | Cross-check counts, null audits, duplicate detection |
| Data Moat Inventory document | ⬜ not-started | — | 0 | — | Comprehensive catalog of all data assets |

---

## Blockers & Fixes Log

| Date | Task | Blocker | Resolution | Impact |
|------|------|---------|------------|--------|
| 2026-03-27 | xbrl-ingest | SEC bulk zip 1.2GB download | Used companyfacts.zip endpoint | Resolved — 359K facts loaded |
| — | — | — | — | — |

---

## Script & Pipeline Locations

| Pipeline | Script / Location | Source |
|----------|-------------------|--------|
| S&P 500 10-K | `startup/klade/scripts/sec_10k_pipeline.py` | SEC EDGAR full-text search API |
| XBRL bulk ingest | `startup/klade/scripts/xbrl_pipeline.py` | SEC EDGAR companyfacts bulk zip |
| 10-Q ingest | TBD | SEC EDGAR EFTS |
| 8-K ingest | TBD | SEC EDGAR EFTS |
| FRED expansion | `startup/klade/scripts/fred_pipeline.py` | FRED API |
| 13-F ingest | TBD | SEC EDGAR 13-F filings |
| Form 4 ingest | TBD | SEC EDGAR Form 4 XML |
| FDIC bank data | TBD | FDIC BankFind API |
| 10-K historical | TBD (extend existing 10-K pipeline) | SEC EDGAR EFTS |
| Treasury.gov | TBD | Treasury.gov API |

---

## Orchestration Protocol

1. **Leader agent** reads `day-tracker.json` to determine current day and pending tasks
2. For each pending task, leader **spawns a worker subagent** with the appropriate label
3. Worker executes the pipeline script, writes results to Supabase
4. Worker reports back with record counts and any errors
5. Leader **updates `day-tracker.json`** with actual counts and status
6. Leader **updates this document** with current stats and blocker notes
7. If a task fails, leader logs the blocker and either retries or escalates

---

## Progress Summary

- **Records loaded:** 690,306 / 4,600,000 (15.0%)
- **Days elapsed:** 1 / 7
- **Tasks complete:** 1 / 13
- **Tasks in progress:** 1 / 13
- **On track:** ✅ Yes (Day 1 XBRL delivered ahead of estimate)
