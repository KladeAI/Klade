# Klade

> **AI employees for finance.**  
> Deploy a Klade of AI analysts into your Slack. They do the work. You run the firm.

Klade builds and deploys AI employees — starting with Financial Analysts — as a managed service. Clients get a Slack bot that does real analyst work. We handle everything behind the curtain.

**Klade** (noun): a group of AI employees sharing common intelligence, working as one unit. Inspired by biological *clade* — organisms descending from a common ancestor.

---

## Vision

Every MD, VP, and partner at a finance firm has junior analysts doing repetitive busy work — building models, pulling comps, writing memos, formatting decks, updating trackers. That's $80-120K/yr per head for work that's structured and repeatable.

Klade replaces that with AI analysts that live in your Slack, cost a fraction, and never sleep.

Long term: Klade expands beyond finance into every role where AI employees can deliver real business output.

---

## How It Works

The client experience is dead simple:

1. **Backend:** OpenClaw powers the agent runtime (client never sees this)
2. **Agent:** We build a preconfigured AI Financial Analyst with skills baked in
3. **Delivery:** Client gets a Slack bot invite — they add it to their workspace
4. **Infrastructure:** The bot connects back to our servers running OpenClaw
5. **Experience:** Client talks to their analyst in Slack. That's it. No APIs, no code, no setup.

The client sees a smart employee in their Slack. We handle everything behind the curtain.

---

## First Product: AI Financial Analyst

**Target buyer:** MDs and VPs at PE firms, investment banks, hedge funds, consulting firms.

**10 core skills:**

1. **Financial modeling** — build and update DCFs, LBOs, comparable company analysis
2. **Company research** — pull financials, summarize 10-Ks/10-Qs, earnings transcripts
3. **Comp tables** — build and maintain comparable company/transaction tables
4. **Pitch deck drafting** — create slides from templates with data and narratives
5. **Memo writing** — investment memos, deal summaries, IC materials
6. **Data room organization** — sort, label, and summarize due diligence documents
7. **Market research** — industry sizing, trend analysis, competitive landscapes
8. **Portfolio monitoring** — track KPIs, flag changes, produce update reports
9. **Email drafting** — LP updates, deal correspondence, meeting follow-ups
10. **Calendar & scheduling** — manage deal timelines, set up calls, track deadlines

---

## Product Architecture

Built on **OpenClaw** as the core runtime, with specialized role layers on top:

- **Core Runtime (OpenClaw)**
  - orchestration
  - memory/context
  - approvals + guardrails
  - connector framework (Slack, Google Workspace, etc.)
  - activity/audit visibility

- **Role Layers**
  - function-specific skills and behaviors
  - toolpacks and workflows
  - outcome-specific execution standards

---

## What We Sell

1. **AI Staffing** — role-specific AI employees, specialized by function and industry
2. **Managed Infrastructure** — we run deployment, integration, reliability, and maintenance

This is not DIY software. This is managed capability.

---

## Monetization

### Pricing Options
1. **Monthly Plan** — defined pool of agent-hours per month
2. **Yearly Plan** — larger annual pool, better effective pricing
3. **Billable-Hour Plan** — usage billed per agent-hour (higher unit rate to incentivize subscriptions)

### Metering
- Usage tracked in tokens/events internally, converted to **agent-hours** for billing
- Familiar staffing-style pricing model for clients

### Billing
- Stripe for subscriptions, metered usage, invoicing, and payment collection

---

## Legal & Licensing

- **OpenClaw:** MIT licensed — commercial use allowed, no restrictions
- **OpenAI API:** terms allow building and selling products using their models
- **Anthropic API:** same — can resell output as part of product
- **Rule:** we're built ON their tech, not claiming to BE their tech

---

## Why This Wins

1. **Clear buyer, high willingness to pay** — finance firms already spend enormous money on analyst labor
2. **Well-defined work** — analyst tasks are structured and repeatable, easier to build reliable skills
3. **Volume play** — one MD might want 3-5 AI analysts
4. **Managed service moat** — we own deployment quality, operations, and iteration speed
5. **Plug-and-play** — business teams buy outcomes, not integration pain

---

## Company Priorities

1. Build a product that works in the real world
2. Sign and retain paying clients
3. Expand specialized agent coverage by role and industry

We optimize for execution and outcomes — not fundraising theater.

---

## Domain & IP Status

- **klade.com** — for sale (can be acquired)
- **klade.ai** — check availability
- **USPTO trademark "Klade"** — no existing AI/tech trademark found
- **Recommendation:** file trademark application for "Klade" in software/AI services (Class 42) ASAP

---

## Build Standard

- Move fast
- Stay clean
- Keep systems auditable
- Design for scale from day one
