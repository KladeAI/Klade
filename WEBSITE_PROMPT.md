# Klade Website Build Instructions

## IMPORTANT DOMAIN CHANGE
- The company website domain is **kladeai.com** (NOT klade.com)
- All email addresses use @kladeai.com:
  - adam@kladeai.com
  - arjun@kladeai.com  
  - gavin@kladeai.com
  - beta@kladeai.com

## Task
Build a premium, conversion-focused website for Klade — an AI analyst startup for financial institutions.

## Tech Stack
- Next.js 14+ (App Router)
- React
- TailwindCSS
- TypeScript

## Pages to Build
1. Homepage (all 15 sections from spec below)
2. Pricing page
3. Founding Team page
4. Shared nav + footer

## Design Direction
- Dark background (black / charcoal / deep gray)
- Premium typography (Inter or Geist)
- Subtle gradients, soft-glow elements
- Generous whitespace
- Smooth but restrained animations (use framer-motion)
- Must feel like a top-tier AI infrastructure startup
- Conversion-focused: clear CTAs, lead capture forms
- Mobile responsive

## Homepage Sections (in order)

### 1. Hero
- Strong headline: "AI analysts for financial intelligence."
- Sub: "Klade creates AI analysts that research companies, screen sectors, digest filings, and generate investment-grade deliverables in minutes."
- CTAs: "Request Early Access" + "Request Demo"
- Premium product visualization (mock UI showing financial analysis, chat interactions, document summaries)

### 2. Trust/Value Bar
- Compact metric strip: 24/7 analysis | Minutes to deliverables | Fraction of analyst cost | Built for finance teams

### 3. Problem Section
- Finance teams spend huge time on repetitive work: reading filings, reviewing CIMs, summarizing earnings, screening sectors, building decks, writing memos
- Make readers think "Yes, this is exactly our workflow"

### 4. Cost/Output Comparison
- Traditional analyst: ~$150K+ annual, limited hours, manual, slow, capacity bottlenecks
- Klade AI analyst: dramatically lower cost, 24/7, instant, scalable, consistent
- This section should visually stand out — make it bold

### 5. Scale Your Team
- "Scale your analyst team without scaling headcount."
- More throughput, faster turnaround, lower cost, always-on

### 6. Feature Grid (cards)
- AI Document Analysis
- Sector Screening
- Investment Thesis Generation
- Automated Deliverables (PowerPoints, memos, reports)
- Earnings Call Summaries
- Workflow Deployment

### 7. Product Demo / Outputs
- Mock outputs: company research summary, sector breakdown, earnings call summary, PowerPoint preview, investment memo, analyst chat response

### 8. Works Where Your Team Works
- Deploys into Slack, Microsoft Teams, internal platforms
- Show example chat interaction (user asks about NVIDIA earnings, analyst responds with structured analysis)

### 9. How Klade Works
- Step 1: Klade configures a financial AI analyst
- Step 2: Connect to your workflow
- Step 3: Team assigns research tasks
- Step 4: Structured outputs instantly

### 10. Custom Analysts / Consulting
- "AI analysts tailored to your workflow."
- Consultation → Workflow analysis → Custom design → Deployment → Iteration
- Examples: Deal research, Sector intelligence, Investment memo, Reporting, Earnings monitor
- CTA: "Schedule a Consultation"

### 11. Metrics / Impact
- 10x output, 24/7 availability, minutes to deliverables, dramatically lower cost

### 12. Pricing Preview
- Usage-based (credit packs) + Subscription (monthly/yearly)
- Enterprise tier for custom deployments
- Link to full pricing page

### 13. Private Beta / Early Access
- "Be among the first teams using AI analysts."
- Exclusive, high-touch, limited firms
- CTA: "Request Early Access" → beta@kladeai.com

### 14. Contact / Lead Form
- "Tell us about your team."
- Fields: Name, Company, Work Email, Team Size, What does your team need help with?
- Button: "Submit Request"
- Also show: adam@kladeai.com, arjun@kladeai.com, gavin@kladeai.com

### 15. Final CTA
- "Hire your first AI analyst."
- Buttons: Request Early Access + Request Demo

## Pricing Page
- Expanded pricing with credit-based and subscription options
- Enterprise/contact CTA
- FAQ section
- Premium, enterprise-ready feel

## Founding Team Page
- Title: "Founding Team"
- Intro: "Klade was founded by three students at Haverford College who share a passion for technology, finance, and building powerful tools. All three founders are also members of the Haverford lacrosse team, where they developed a strong culture of discipline, collaboration, and execution."
- Cards (all Co-Founder):
  - Adam Benoit — Economics, financial markets & investment research. adam@kladeai.com
  - Arjun Rath — Computer Science, intelligent systems & software infrastructure. arjun@kladeai.com
  - Gavin Kim — Mathematics, quantitative systems & data-driven tools. gavin@kladeai.com
- Present as collaborative co-founders, not siloed roles

## Copy Guidelines
- Premium, crisp, intelligent, sharp, persuasive
- Institutional enough for finance buyers
- Startup-native for VC aesthetics
- No cheesy AI marketing buzzwords
- Don't say "replace employees" — use "scale your team", "expand capacity", "increase output"

## Code Quality
- Clean component structure with reusable components
- Proper TypeScript types
- Well-organized file structure
- Production-ready code, not prototype quality

When completely finished, run this command to notify me:
openclaw system event --text "Done: Klade website V1 built - Homepage, Pricing, Team pages complete with dark premium theme" --mode now
