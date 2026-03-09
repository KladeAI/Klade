# Klade AI Financial Analyst

Deploy a production-grade AI Financial Analyst into client Slack workspaces as a managed service.

## What this repo is

This repository contains the product code and operating docs for Klade’s first role-specific AI employee: **Financial Analyst**.

It includes:
- runtime orchestration for analyst workflows,
- Slack + Google Workspace integrations,
- skill packs for core analyst tasks (modeling, research, comps, memos),
- evaluation harnesses for quality, cost, and latency,
- control-plane tooling for onboarding, approvals, and observability.

## Product scope (v0.1)

Target users: MD/VP teams in PE, IB, HF, and consulting.

Initial workflows:
1. Company/industry research synthesis
2. Investment memo drafting
3. Comparable company table generation
4. KPI/portfolio update summaries

## Safety and approvals

High-risk actions require explicit approval:
- Sending external emails
- Editing external-facing calendar events
- Sharing documents outside tenant boundary
- Any payment/financial execution action

All actions are audit-logged per tenant.

## Architecture at a glance

- **Control Plane (Next.js):** onboarding, tenant config, approval inbox, usage visibility
- **Runtime Service:** Slack event ingestion, intent routing, task planning/execution
- **Skill Layer:** finance-specific prompt/tool bundles
- **Eval Layer:** regression suites + quality rubrics
- **Data Layer:** tenant state, task logs, memory, usage metering

See `docs/ARCHITECTURE.md` and `docs/ROLE_SPEC_FINANCIAL_ANALYST.md` for details.

## Monorepo layout

```text
apps/
  analyst-control-plane/
  analyst-runtime/
packages/
  core-agent/
  connectors-slack/
  connectors-google/
  skills-finance/
  prompts/
  evals/
  billing/
  shared-types/
docs/
infra/
scripts/
```

## Local development

```bash
# 1) install
pnpm install

# 2) set environment
cp .env.example .env

# 3) run apps
pnpm dev
```

## Quality gates

Before merge:
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- eval smoke suite for top workflows

## Migration note

This codebase is the continuation of the earlier Cadre-era experiments.
Migration details and legacy mapping are documented in `docs/MIGRATION_FROM_CADRE.md`.

## Status

- [ ] Scaffold finalized
- [ ] Runtime + connector baseline wired
- [ ] Analyst v0.1 workflows live
- [ ] CI + eval baseline enabled
