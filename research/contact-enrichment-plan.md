# Contact Enrichment Plan — Klade International Leads

**Date:** March 26, 2026  
**Spreadsheet:** [International Leads](https://docs.google.com/spreadsheets/d/1GLJoFyOgqSgCqpi834eucMQ4kth3vsctCBfQ4FatAMs)

---

## 1. Current Data Quality Analysis

### Summary

| Metric | Count | % |
|--------|------:|--:|
| **Total Leads** | 500 | 100% |
| ✅ Real person emails | 0 | 0% |
| ⚠️ Generic emails (info@, contact@) | 24 | 5% |
| ❌ LinkedIn references only (no email) | 476 | 95% |
| **Needs enrichment** | **500** | **100%** |

**Verdict:** Every single lead needs enrichment. Zero usable decision-maker emails exist.

### Per-Country Breakdown

| Country | Total | Generic Email | LinkedIn Only |
|---------|------:|-------------:|--------------:|
| UAE (Dubai) | 50 | 16 | 34 |
| UK (London) | 50 | 6 | 44 |
| Singapore | 50 | 0 | 50 |
| Hong Kong | 50 | 0 | 50 |
| Canada (Toronto) | 50 | 1 | 49 |
| Australia | 50 | 0 | 50 |
| Israel (Tel Aviv) | 50 | 0 | 50 |
| Switzerland | 50 | 1 | 49 |
| India (Mumbai) | 50 | 0 | 50 |
| South Africa | 50 | 0 | 50 |

**Pattern:** UAE and UK sheets have some info@ emails; all other countries are 100% LinkedIn-reference-only.

### What We Have to Work With

For each lead we have:
- **Company name** ✅
- **City** ✅
- **Firm type** (PE, IB, Family Office, etc.) ✅
- **Website domain** ✅ (this is the key input for enrichment tools)
- **LinkedIn reference** (company page name, not URL) — useful for manual lookup

---

## 2. Enrichment Tools — Detailed Evaluation

### Tier 1: Best Free Options (API-automatable)

#### 🏆 Hunter.io — RECOMMENDED FIRST

| Attribute | Detail |
|-----------|--------|
| **Free tier** | 50 credits/month |
| **What 1 credit gets** | 1 domain search (returns up to 10 emails) OR 1 email-finder lookup |
| **API access** | ✅ Yes, on free tier |
| **Rate limits** | 15 req/sec, 500/min |
| **Automation** | ✅ Fully automatable via REST API + Python |
| **Expected hit rate** | 40-80% for known company domains; lower for small/private firms |
| **Best for** | Domain search — input `alpencapital.com`, get all discoverable emails with job titles |

**How Dev automates it:**
```
For each lead:
  1. Extract website domain from column F
  2. Call Hunter domain-search API → get all emails + positions
  3. Filter for C-suite/senior titles (CEO, CFO, MD, Partner, Director)
  4. Write enriched email back to sheet
```

**Strategy:** With 50 credits/month, we can search 50 domains. Run one country per month, or prioritize the highest-value 50 leads across all countries.

**Upgrade path:** Starter plan ($34/mo annual) = 2,000 credits = enough for all 500 leads in one shot + verification.

---

#### 🥈 Snov.io

| Attribute | Detail |
|-----------|--------|
| **Free tier** | 50 credits/month (renewable trial) |
| **What 1 credit gets** | 1 email find or 1 email verification |
| **API access** | ✅ Yes, REST API on free tier |
| **Rate limits** | Standard API limits |
| **Automation** | ✅ Fully automatable via REST API |
| **Expected hit rate** | 50-70% for domain searches; 98% verification accuracy |
| **Best for** | Combined find + verify workflow |

**Advantage over Hunter:** Snov.io's domain search + verification in one tool. Also has a Chrome extension for LinkedIn scraping.

**Strategy:** Use as secondary tool after Hunter exhausts monthly credits.

---

#### 🥉 Skrapp.io

| Attribute | Detail |
|-----------|--------|
| **Free tier** | 100 credits/month |
| **API access** | ✅ Yes |
| **Expected hit rate** | 60-80%, 98% claimed accuracy |
| **Automation** | ✅ API + CSV bulk upload |
| **Best for** | Highest free credit count; good for bulk domain lookups |

**Strategy:** Best raw volume on free tier — 100 searches/month means 2 countries per month.

---

### Tier 2: Limited Free / Manual Only

#### Apollo.io

| Attribute | Detail |
|-----------|--------|
| **Free tier** | ~100 email credits/month |
| **API access** | ❌ NO API on free tier (requires Professional at $79/mo) |
| **Automation** | ❌ Manual only on free tier (web UI + Chrome extension) |
| **Expected hit rate** | 70-80% for well-known companies |
| **Best for** | Manual enrichment of high-priority leads via web interface |

**Verdict:** Good data but can't automate on free tier. Use manually for top-priority leads.

---

#### RocketReach

| Attribute | Detail |
|-----------|--------|
| **Free tier** | 5 lookups/month |
| **API access** | ❌ Requires Ultimate plan ($207/mo) |
| **Automation** | ❌ Not on free tier |
| **Best for** | Spot-checking specific high-value contacts |

**Verdict:** Too limited for our 500-lead volume. Skip.

---

#### Clearbit (now Breeze Intelligence / HubSpot)

| Attribute | Detail |
|-----------|--------|
| **Free tier** | ❌ Discontinued — now requires HubSpot subscription + $45/mo minimum |
| **API access** | Only via paid HubSpot |
| **Automation** | N/A |

**Verdict:** No longer viable as free tool. Skip entirely.

---

### Tier 3: Manual Research Methods (No-Cost, Labor-Intensive)

#### LinkedIn Sales Navigator Patterns
- **Cost:** Free LinkedIn allows ~100 profile views/month; Sales Navigator is $99/mo
- **Method:** Search company → find C-suite/Partners → note their name → use email pattern tools
- **Automatable by Dev:** Partially — can use the discovered names with Hunter's email-finder API
- **Hit rate:** High for finding names, then ~60-70% converting to emails via tools

#### Company Website Scraping
- **Method:** Visit company's "About Us" / "Team" / "Leadership" pages → extract names + sometimes emails
- **Automatable by Dev:** ✅ Yes — web scraping with BeautifulSoup/Playwright
- **Hit rate:** 30-50% (many mid-market firms don't list emails publicly)
- **Best for:** Family offices and boutique firms that list their team

#### Press Releases & Conference Speaker Lists
- **Method:** Search for "[Company Name] [Person Name] press release" or find industry conference agendas
- **Automatable by Dev:** Partially — can search programmatically but parsing is manual
- **Hit rate:** 20-30% for niche international firms
- **Best for:** Finding specific senior contacts at well-known firms

#### Email Pattern Guessing + Verification
- **Method:** Once you know a person's name + company domain, guess the email pattern:
  - `firstname@domain.com`
  - `firstname.lastname@domain.com`
  - `f.lastname@domain.com`
  - `flastname@domain.com`
- **Automatable by Dev:** ✅ Fully — generate permutations, verify with Hunter/Snov.io verifier
- **Hit rate:** 70-80% if you have the right name and the company uses standard patterns
- **Cost:** Verification credits only (not finder credits)

---

## 3. Recommended Execution Plan

### Phase 1: Automated Domain Search (Month 1)
**Goal:** Find all publicly discoverable emails for 500 company domains.

1. **Sign up for free tiers** (Arjun to create accounts — Dev will NOT sign up):
   - Hunter.io (50 credits)
   - Snov.io (50 credits)
   - Skrapp.io (100 credits)
   - **Total: 200 free searches/month**

2. **Dev builds enrichment script** that:
   - Reads all 500 leads from the Google Sheet
   - Extracts website domains (column F)
   - Queries Hunter → Snov.io → Skrapp.io APIs in sequence
   - Filters results for decision-maker titles (CEO, CFO, CIO, Managing Director, Partner, Head of, VP)
   - Writes enriched data back to a new column in the sheet
   - Tracks which leads were enriched and which need manual work

3. **Prioritization order** (highest-value markets first):
   - Month 1: UAE (50) + UK (50) + top 100 from other countries = 200 searches
   - Month 2: Remaining 300 with refreshed credits

**Expected outcome:** ~120-160 real decision-maker emails found (60-80% hit rate on domains with public email footprints).

### Phase 2: Name Discovery + Pattern Matching (Month 1-2, parallel)
**Goal:** For leads where domain search returned nothing, find the right person's name.

1. **Dev scrapes company websites** (Team/About pages) for leadership names
2. **Manual Apollo.io lookups** for top 20 highest-priority leads (Arjun does this in web UI)
3. **Once names found:** Use Hunter email-finder API (name + domain → email, 1 credit each)
4. **Pattern guessing:** Generate email permutations, verify with free verification credits

**Expected outcome:** Additional 50-80 contacts.

### Phase 3: Verification Pass (Month 2)
**Goal:** Verify all discovered emails before outreach.

1. Use Hunter + Snov.io email verification APIs (1 credit per verification)
2. Remove bounced/invalid emails
3. Flag "risky" emails for manual confirmation

**Expected outcome:** Clean list of 150-200+ verified decision-maker emails.

### Phase 4: Evaluate Paid Upgrade (Month 2-3)
**Goal:** If free tiers aren't enough, make an informed upgrade decision.

**Recommended paid option if needed:**
- **Hunter.io Starter** ($34/mo annual) = 2,000 credits/month
  - Enough to search all 500 domains + verify + re-search with different parameters
  - Best ROI of any tool for our use case
  - Can cancel after 1-2 months once enrichment is complete

---

## 4. What Dev Can Build Right Now (No Signups Needed)

Before any API keys are available, Dev can prepare:

1. **Enrichment automation script** — ready to plug in API keys
2. **Website scraper** — crawl all 500 company websites for team/leadership pages, extract names
3. **Email pattern generator** — given name + domain, generate all common email permutations
4. **Google Sheet integration** — read/write enriched data to/from the leads sheet
5. **Deduplication + quality scoring** — rank leads by enrichment completeness

---

## 5. Cost Summary

| Scenario | Monthly Cost | Leads Enrichable |
|----------|------------:|:----------------:|
| **Free tier only** (Hunter + Snov.io + Skrapp.io) | $0 | ~200/month |
| **Hunter Starter** (if free isn't enough) | $34/mo | 2,000/month |
| **Full enrichment one-time** (2 months free) | $0 | All 500 |

**Bottom line:** We can enrich all 500 leads for $0 over 2-3 months using staggered free tiers, or spend $34 once to do it all immediately with Hunter Starter.

---

## 6. Next Steps

- [ ] Arjun: Create free accounts on Hunter.io, Snov.io, Skrapp.io
- [ ] Arjun: Share API keys with Dev (store securely, not in memory files)
- [ ] Dev: Build enrichment automation pipeline
- [ ] Dev: Start website scraping for leadership names (no API key needed)
- [ ] Dev: Run Phase 1 domain searches once API keys are available
- [ ] Review results after first batch → decide on Phase 4 paid upgrade
