# Klade AI — Tool & Service Tracker
**Last updated:** 2026-04-03  
**Purpose:** Live inventory of all tools, services, API keys, and expenses

---

## Active Paid Services

| Service | Plan | Cost | Billing Email | Status | What It Does |
|---------|------|------|---------------|--------|--------------|
| **Claude Max (Anthropic)** | Max subscription | $200/mo | arjun@kladeai.com | ✅ Active | Dev's primary model (Opus 4.6) |
| **OpenAI Max** | Max subscription | $200/mo | arjun@kladeai.com | ✅ Active | Codex, GPT-5, deep research for execution tasks |
| **Supabase Pro** | Pro (Micro) | ~$25/mo | dev@kladeai.com | ✅ Active | Database (klade-analyst-mvp), pgvector |
| **Obsidian Sync Plus** | Sync Plus | $10/mo | arjun@kladeai.com | ✅ Active | Shared vault sync (klade-vault) |
| **Google Workspace** | Business (?) | $?/mo | arjun@kladeai.com | ⚠️ VERIFY | Email (kladeai.com), Drive, Calendar, Docs |
| **Domain (kladeai.com)** | Annual | $?/yr | ? | ⚠️ VERIFY | Domain registration — which registrar? |
| **Vercel** | Free (?) or Pro | $?/mo | ? | ⚠️ VERIFY | Website + klade-analyst deployment |
| **Slack** | Free or Pro | $?/mo | ? | ⚠️ VERIFY | Team comms, task management |
| **Instantly.ai** | ? | $?/mo | dev@kladeai.com | ⚠️ VERIFY — may not be active | Cold email outreach (was being set up) |
| **Typefully** | ? | $?/mo | ? | ⚠️ VERIFY — may not be active | Social content scheduling |
| **Notion** | Free (3 members) | $0 | arjun@kladeai.com | ✅ Free tier | Founder OS task board |

## Free Services (No Cost)

| Service | Plan | What It Does |
|---------|------|--------------|
| **GitHub** | Free (KladeAI org) | Source code, repos |
| **HubSpot** | Free CRM | Lead tracking, pipeline |
| **Apollo.io** | Free (75 credits/mo) | Company enrichment |
| **Tailscale** | Free | VPN/secure networking |
| **Perplexity (via OpenRouter)** | Included in OpenClaw | Web search |
| **Brave Search API** | Pay-per-use ($5/1K searches) | Web search fallback |

## API Keys Inventory

| Key | Location | Status |
|-----|----------|--------|
| Supabase service role | klade-analyst/.env | ✅ Active |
| OpenAI API key | klade-analyst/.env | ✅ Active |
| FRED API key | klade-analyst/.env | ✅ Active |
| BLS API key | klade-analyst/.env | ✅ Active (new 2026-04-03) |
| Census Bureau API key | klade-analyst/.env | ✅ Active (new 2026-04-03) |
| Massive.com (Polygon) API key | Clay agent skills | ✅ Active (free tier) |
| Notion API key | TOOLS.md | ✅ Active |
| Apollo.io API key | memory | ✅ Active (free tier) |
| Perplexity API key | openclaw.json | ✅ Active |
| Slack bot token | openclaw.json + memory | ✅ Active |
| PatentsView / USPTO ODP | — | ⏸️ Pending (portal migrating) |

## Infrastructure

| Resource | Details | Cost |
|----------|---------|------|
| **VPS (srv1398696)** | Linux, Node 22 | $?/mo — VERIFY |
| **Supabase project** | humaesmbiarcqtpdwldg, us-east-2 | Included in Pro |
| **GCP project** | klade-gws (OAuth app) | $0 (free tier, NO purchases allowed) |

## Monthly Cost Estimate

| Category | Estimated Monthly |
|----------|------------------|
| AI Models (Claude + OpenAI Max) | $400 |
| Supabase Pro | $25 |
| Obsidian Sync | $10 |
| Google Workspace | $? |
| VPS | $? |
| Domain | ~$1-2 (annual amortized) |
| Other (Vercel, Slack, Instantly, Typefully) | $? |
| **KNOWN TOTAL** | **$435+** |
| **ESTIMATED TOTAL (with unknowns)** | **$500-700/mo** |

---

## Items Needing Arjun Verification

1. ❓ Google Workspace — what plan? Monthly cost?
2. ❓ Domain registrar — who holds kladeai.com? Annual cost?
3. ❓ VPS provider and plan — what do we pay for srv1398696?
4. ❓ Vercel — free or Pro? Any charges?
5. ❓ Slack — free plan or paid?
6. ❓ Instantly.ai — did we ever activate a paid plan? Or just signed up?
7. ❓ Typefully — same question, paid or just signed up?
8. ❓ Any credit cards being charged that we're not tracking?
9. ❓ 1Password — about to set up, what plan?

---

*This is a living document. Update whenever a service is added, removed, or billing changes.*
