# Cadre — Architecture Plan (Control-Tower)

## What we're building
Cadre is a managed AI staffing + infrastructure company.

We deploy OpenClaw-style agentic employees into client businesses, pre-configured and production-managed by Cadre. Clients buy operational outcomes, not DIY setup burden.

## First Employee: Jarvis (Executive Assistant Baseline)

### Day-one capabilities
1. **Slack integration** — joins client workspace as a bot user, responds to DMs and channel mentions
2. **Calendar management** — reads/creates/modifies Google Calendar events via API
3. **Email drafting** — drafts emails for review, sends on approval (Gmail API)
4. **Research** — web search, summarization, competitive intel gathering
5. **Document drafting** — meeting notes, agendas, briefs, memos
6. **Task tracking** — maintains a to-do list per client, sends reminders

### Architecture

```
┌─────────────────────────────────────┐
│           Cadre Platform            │
├─────────────────────────────────────┤
│  Client Onboarding                  │
│  ├─ Slack OAuth install             │
│  ├─ Google Workspace OAuth          │
│  └─ Preferences questionnaire       │
├─────────────────────────────────────┤
│  Jarvis Runtime (Baseline)          │
│  ├─ Message router (Slack events)   │
│  ├─ Intent classifier               │
│  ├─ Tool executor                   │
│  │   ├─ calendar_read/write         │
│  │   ├─ email_draft/send            │
│  │   ├─ web_search                  │
│  │   ├─ doc_create                  │
│  │   └─ task_manage                 │
│  ├─ Context memory (per-client)     │
│  └─ Approval gate (sensitive acts)  │
├─────────────────────────────────────┤
│  LLM Layer (model-agnostic)         │
│  ├─ Primary: Claude/GPT latest      │
│  ├─ Fallback: cheaper model         │
│  └─ Router picks best per task      │
├─────────────────────────────────────┤
│  Data Layer                         │
│  ├─ Supabase (clients, logs, state) │
│  ├─ pgvector (client context/memory)│
│  └─ Upstash Redis (caching)        │
├─────────────────────────────────────┤
│  Deployment                         │
│  ├─ Vercel (web app + API routes)   │
│  └─ Vercel Cron (scheduled tasks)   │
└─────────────────────────────────────┘
```

### Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (Postgres + Auth + pgvector)
- **Cache:** Upstash Redis
- **Deployment:** Vercel
- **Slack SDK:** @slack/bolt
- **Google APIs:** googleapis npm package
- **LLM:** Model-agnostic via API (start with OpenAI/Anthropic)
- **Styling:** Tailwind CSS + shadcn/ui

### Build Order (Current)
1. Harden Jarvis as a reusable baseline employee runtime
2. Standardize connector layer for multi-industry deployment
3. Ship managed onboarding + approval workflows for non-technical operators
4. Expand specialized role templates beyond EA
5. Package Cadre-managed deployment/ops layer as the default customer experience

### Long-Term Defensibility
- Cadre-managed infra + operations (not just software license)
- Repeatable role blueprints that compound over deployments
- Multi-agent orchestration with human approval and auditability
- Fast deployment for non-technical client teams
- Outcome data loops that improve role performance over time
