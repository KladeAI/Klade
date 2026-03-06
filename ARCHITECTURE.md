# Cadre — Architecture Plan (Opus)

## What we're building
An AI staffing company. Businesses rent AI employees that plug into their existing tools (Slack, email, calendar) and work like real team members.

## First Employee: Barbara (Executive Assistant)

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
│  Barbara Runtime                    │
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

### Build Order (Tonight)
1. New repo scaffold: `cadre/` with Next.js + TypeScript
2. Landing page with the quote + waitlist signup
3. Slack bot scaffold (event listener, message handler)
4. Barbara's core brain (system prompt + tool definitions)
5. Client dashboard (see Barbara's activity, approve actions)

### What makes this defensible
- Per-client memory that improves over time
- Multi-tool orchestration (not just chat)
- Approval gates build trust
- Team hierarchy (future: multiple AI employees per client)
