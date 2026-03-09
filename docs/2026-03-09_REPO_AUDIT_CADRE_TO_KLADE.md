# Klade Repo Audit — Cadre → AI Financial Analyst Scaffold

Date: 2026-03-09 (UTC)
Workspace scanned:
- `/home/Arjun/.openclaw/workspace/startup/klade`
- `/home/Arjun/.openclaw/workspace/startup/founder-os`
- workspace root git repo

## 1) Current repo state (high signal)

### A. `startup/klade` (remote still points to `cadre.git`)
- Remote: `https://github.com/arjundrath-star/cadre.git`
- Branch: `main`
- Notable files:
  - `README.md` is mostly rebranded to **Klade** and **AI Financial Analyst** vision.
  - `ARCHITECTURE.md` still titled/positioned as **Cadre** + “Jarvis (EA baseline)”.
  - `BARBARA_SPEC.md` is still an **Executive Assistant** spec (legacy product direction).
  - `app/README.md` is default Next.js boilerplate.
  - `app/` includes local build artifacts/deps (`.next`, `node_modules`) present on disk (ignored by `.gitignore`).

### B. `startup/founder-os`
- Remote: `https://github.com/arjundrath-star/founder-os.git`
- Active internal planning docs exist (execution board, decisions log, cost ledger).
- Useful as operating system, but not product repo.

### C. Workspace root git
- Contains OpenClaw workspace + many local skill additions.
- Not suitable as customer product source-of-truth repo.

---

## 2) Missing Cadre-era artifact cleanup (what’s inconsistent / missing)

## Legacy artifacts still present (should migrate or archive)
1. `ARCHITECTURE.md` (Cadre + Jarvis framing) — not aligned to current AI Financial Analyst wedge.
2. `BARBARA_SPEC.md` (EA persona) — not aligned with finance analyst product.
3. GitHub remote name/path still `cadre.git` — brand drift persists.
4. `app/README.md` boilerplate — no product-specific setup/runbook.

## Missing for a clean AI Financial Analyst repo
1. Product docs for **financial analyst role** (scope, guardrails, deliverables, acceptance criteria).
2. Skill contract docs for the “10 core skills” in executable/spec form.
3. Evaluation harness docs (task suite, quality rubric, latency/cost targets).
4. Connector + approval matrix (Slack/GWS + sensitive action gates).
5. Ops docs: env contract, local/dev/prod runbooks, incident playbook.
6. Structured repo layout separating:
   - product spec,
   - runtime code,
   - skills/prompts,
   - evals,
   - deployment infra.
7. Basic CI policy docs (lint/typecheck/test/build gates).

---

## 3) Proposed clean repo scaffold (AI Financial Analyst)

Recommended repo name: `klade-ai-financial-analyst`

```text
klade-ai-financial-analyst/
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── package.json
├── pnpm-workspace.yaml
├── docs/
│   ├── PRODUCT_PRD.md
│   ├── ROLE_SPEC_FINANCIAL_ANALYST.md
│   ├── APPROVAL_GATES.md
│   ├── CONNECTORS.md
│   ├── ARCHITECTURE.md
│   ├── BILLING_METERING.md
│   ├── SECURITY_MODEL.md
│   ├── OPERATIONS_RUNBOOK.md
│   └── MIGRATION_FROM_CADRE.md
├── apps/
│   ├── analyst-control-plane/        # Next.js app (ops/config/tenant mgmt)
│   └── analyst-runtime/              # service receiving Slack events + orchestrating tasks
├── packages/
│   ├── core-agent/                   # planning/execution abstractions
│   ├── connectors-slack/
│   ├── connectors-google/
│   ├── skills-finance/               # DCF/LBO/comps/memo flows
│   ├── prompts/
│   ├── evals/                        # eval datasets + graders
│   ├── billing/
│   └── shared-types/
├── scripts/
│   ├── dev.sh
│   ├── test.sh
│   └── seed-demo-tenant.ts
├── infra/
│   ├── vercel/
│   ├── supabase/
│   └── terraform/                    # optional, if infra grows
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
└── examples/
    ├── sample-client-prompts/
    └── demo-output/
```

Design intent:
- Keep **role-specific IP** (`skills-finance`, evals, prompts) isolated and versioned.
- Make customer-facing reliability measurable via `packages/evals`.
- Keep connector logic modular for future vertical expansion.

---

## 4) Migration steps (safe, low-friction)

1. **Freeze legacy naming**
   - Mark Cadre-era files as legacy with banner notes.
   - Preserve history; do not delete immediately.

2. **Create migration docs + new role spec**
   - Draft `ROLE_SPEC_FINANCIAL_ANALYST.md`, `APPROVAL_GATES.md`, `CONNECTORS.md`, `MIGRATION_FROM_CADRE.md`.

3. **Carve code into scaffold directories**
   - Move current Next app into `apps/analyst-control-plane`.
   - Introduce `apps/analyst-runtime` for Slack event/runtime loop.

4. **Replace legacy EA artifacts**
   - Convert `BARBARA_SPEC.md` into archived reference (`docs/archive/BARBARA_SPEC_LEGACY.md`).
   - Replace `ARCHITECTURE.md` with analyst-first architecture.

5. **Install quality gates**
   - Add CI: lint + typecheck + test + build on PR.
   - Add minimal eval smoke tests for top 3 analyst tasks first.

6. **Rename/align repo branding**
   - Update GitHub repo naming/description when authorized.
   - Ensure all docs and package names use Klade + AI Financial Analyst terminology.

7. **Ship v0.1 milestone**
   - Working Slack analyst loop for: company research, memo drafting, comp table stub generation.
   - Approval gates enforced for external communications/actions.

---

## 5) Immediate next actions (tonight)

1. Approve scaffold layout and README draft.
2. Create new repo (or branch cut) with this structure.
3. Move existing app into `apps/analyst-control-plane`.
4. Replace legacy architecture/spec docs in first commit.
5. Add CI + first eval pack in second commit.
