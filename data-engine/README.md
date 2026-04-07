# Klade Data Engine

The Data Engine is Klade's proprietary financial data infrastructure — the foundation that powers AI-driven SEC filing analysis, market intelligence, and institutional-grade financial queries.

## What Is This?

This directory contains the **orchestration layer** for building and maintaining Klade's data moat. It doesn't contain the ingestion scripts themselves (those live in `startup/klade/scripts/`), but rather the control plane that manages multi-day data loading campaigns.

## Layer 1 — Scope & Goals

**Layer 1** is the foundational data layer: raw SEC filings, XBRL financial facts, FRED macro data, and other public financial datasets loaded into Supabase (pgvector).

### Goals
- **4.6M+ records** across all data sources
- **S&P 500 complete coverage**: 10-K, 10-Q, 8-K filings with full-text chunks + embeddings
- **XBRL facts**: Structured financial data (revenue, EPS, assets) for all public companies
- **FRED macro data**: 200+ economic series (GDP, employment, rates, housing, trade)
- **Alternative data**: 13-F holdings, Form 4 insider trades, FDIC bank data, Treasury data
- **Quality validated**: Null audits, duplicate detection, cross-source reconciliation

### Current State (as of 2026-03-27)
| Source | Records | Status |
|--------|---------|--------|
| SEC 10-K chunks | 82,372 | ~499 companies |
| XBRL facts | 359,661 | Complete bulk load |
| FRED observations | 248,273 | 44 series loaded |
| **Total** | **690,306** | 15% of target |

## How Orchestration Works

The overhaul runs on a **leader–worker** pattern using OpenClaw subagents:

1. **Leader agent** (main session or heartbeat) reads `day-tracker.json`
2. Leader identifies the current day's tasks and their status
3. For each `not-started` task, leader **spawns a worker subagent** with:
   - A descriptive label (e.g., `10q-batch1-ingest`)
   - The target pipeline script
   - Expected record counts for validation
4. Worker runs the pipeline, writes to Supabase, reports results
5. Leader updates `day-tracker.json` with:
   - `status`: `complete` / `failed`
   - `actualRecords`: count returned by worker
   - Any blockers encountered
6. Leader updates `layer1-orchestrator.md` (the human-readable tracker)

### Failure Handling
- Failed tasks get logged with blocker details
- Leader retries once automatically
- If retry fails, task is escalated to Arjun via Telegram
- No task is marked `complete` without verified record counts

## How to Check Progress

### Quick check
```bash
cat startup/klade/data-engine/day-tracker.json | jq '.stats.current'
```

### Detailed view
Open [`layer1-orchestrator.md`](./layer1-orchestrator.md) for the full day-by-day breakdown with status, record counts, blockers, and script references.

### Dashboard
The Founder Console task board tracks the overhaul as a top-level active task. Individual day completions update there as well.

## Pipeline Script Locations

| Pipeline | Script | Data Source |
|----------|--------|-------------|
| SEC 10-K filings | `startup/klade/scripts/sec_10k_pipeline.py` | SEC EDGAR EFTS API |
| XBRL bulk facts | `startup/klade/scripts/xbrl_pipeline.py` | SEC EDGAR companyfacts.zip |
| FRED macro data | `startup/klade/scripts/fred_pipeline.py` | FRED API (St. Louis Fed) |
| 10-Q filings | TBD (Day 2) | SEC EDGAR EFTS API |
| 8-K filings | TBD (Day 3) | SEC EDGAR EFTS API |
| 13-F holdings | TBD (Day 4) | SEC EDGAR 13-F XML |
| Form 4 insider | TBD (Day 5) | SEC EDGAR Form 4 XML |
| FDIC bank data | TBD (Day 5) | FDIC BankFind API |
| Treasury data | TBD (Day 6) | Treasury.gov API |

## Directory Structure

```
startup/klade/data-engine/
├── README.md                  ← You are here
├── layer1-orchestrator.md     ← Master plan + day-by-day tracker
└── day-tracker.json           ← Machine-readable state (read by agents)
```

## Key Principles

- **Infrastructure, not execution** — this directory manages work, scripts live elsewhere
- **Single source of truth** — `day-tracker.json` is the canonical state; everything else mirrors it
- **Idempotent pipelines** — every script can be re-run safely (upsert, not insert)
- **Verified completion** — no task is done until record counts are confirmed in Supabase
