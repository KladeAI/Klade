# CLAUDE.md — Klade (startup/klade)

## What this is
The core Klade project repo. Contains the product codebase, data engine, deliverables, website, research, and plans for Clay — Klade's AI financial analyst.

## Product context
- **Clay** = AI financial analyst delivered via Slack/Teams
- **Target market** = mid-market finance (boutique banks, PE shops, family offices, wealth managers)
- **Pricing** = $2-5K/month (vs ROGO at $150K+/seat)
- **Core runtime** = OpenClaw (orchestration, memory, connectors, guardrails)

## Directory layout
- `website/` — Next.js marketing site (kladeai.com), deployed on Vercel
- `data-engine/` — orchestration layer for financial data ingestion (SEC, XBRL, FRED → Supabase/pgvector)
- `deliverables/` — client-facing sales materials (deployment packs, compliance explainers)
- `scripts/` — data pipeline scripts (SEC 10-K, XBRL, FRED)
- `research/` — market research and analysis
- `plans/` — product and go-to-market plans
- `docs/` — internal documentation

## Key systems
- **Supabase** (pgvector) = financial data store
- **Vercel** = website hosting
- **Slack/Teams** = Clay delivery surface
- **OpenClaw** = agent runtime

## Working rules
- Follow the parent workspace CLAUDE.md for all operating rules
- Data pipelines must be idempotent (upsert, not insert)
- No task is done until record counts are verified in Supabase
- Client deliverables must meet the standard: work a serious financial professional would trust
- Numbers and claims should be attributable to sources
