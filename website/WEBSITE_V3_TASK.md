# Website V3 — Billion-Dollar Level Upgrade

## CRITICAL CONTEXT
You are upgrading the existing Klade website (Next.js + Tailwind + Framer Motion) to V3. This is NOT a full redesign — it's a premium evolution of the existing site. Read every file in `src/` before changing anything.

## ASSET LOCATIONS (already in public/)
- `/brand/clay-avatar.jpg` — Clay character (chrome robot, cyan eyes, black suit, K badge)
- `/brand/klade-wordmark.jpg` — Full "K KLADE" wordmark (silver/white)
- `/brand/klade-kmark.jpg` — Standalone K mark icon (white/light)
- `/brand/klade-logo-draft.jpg` — Old logo (REPLACE all usages with new assets above)
- `/founders/adam.jpg` — Adam Benoit headshot (real photo now)
- `/founders/arjun.jpg` — Arjun Rath headshot (real photo now)
- `/founders/gavin.jpg` — Gavin Kim headshot (real photo now)
- `/video/klade-launch.mp4` — Founding/launch video ("Meet Clay" video)

## THE CORE PRODUCT TRUTH TO COMMUNICATE
- **Klade** = the company/platform
- **Clay** = the main AI teammate/operator the customer interacts with
- Clay is NOT just a chatbot, NOT just a financial analyst
- Clay is ONE main AI teammate that orchestrates MANY specialized sub-agents behind the scenes
- "One bot, many specialists" — customer interacts with one unified interface, Clay routes work to the right specialist automatically
- The "clay" metaphor: flexible, shapeable, moldable, adaptive, tailored to each company
- Position as: moldable AI agents, AI consulting meets execution, customizable AI support for modern teams

## BRAND EVOLUTION (Video-Aligned)
Current site is light-themed with blue/purple accents. V3 must evolve to:
- **Dark luxury B2B AI aesthetic** — deep black/navy foundations
- Chrome/silver Clay character in tailored black suit
- Cyan glowing eyes and subtle cyan interface accents
- White/silver logo treatment with soft blue-violet glow
- Futuristic but restrained — premium, sharp, executive, intentional
- Keep blue/purple as part of identity but add stronger deep navy/black foundations
- Do NOT overuse gradients or glows — let typography and spacing carry the design

## REQUIRED CHANGES (implement ALL)

### 1. HERO SECTION
- Embed the "Meet Clay" video (`/video/klade-launch.mp4`) prominently in the hero
- Use new Klade wordmark in hero branding
- Headline must communicate: Clay = adaptable AI teammate, not narrow analyst
- Copy direction: "One AI teammate, backed by many specialists" / "Moldable AI support shaped to your company"
- Add subtle premium UI elements: restrained glows, floating chips, clean glass panels
- Add private beta pill, capability chips
- Reduce emptiness without making it noisy

### 2. NAVBAR
- Replace old `klade-logo-draft.jpg` with new K mark + wordmark lockup
- More premium feel
- Updated nav items: Meet Clay, Capabilities, ROI, Pricing, Email a Founder, Book a Demo / Join Private Beta
- No dead links. Mobile nav must remain clean.

### 3. ROI SECTION (NEW — currently broken/missing)
- Create a real anchored ROI section (id="roi-estimator")
- Core messages: less repetitive work, faster turnaround, lower cost than headcount, consistent output, adaptable across functions
- Layouts: ROI cards, before/after comparison, cost/time efficiency blocks
- Use qualitative/directional language (no fake numbers)

### 4. CAPABILITIES SECTION (MAJOR UPGRADE)
- Show Clay has MANY capabilities and is NOT rigid
- Visual showing Clay routing work to specialized sub-agents
- Dark premium orchestration visual with cyan signals/paths
- Capabilities: models, PowerPoints, research, reports, workflow automation, data org, finance, ops, custom tasks
- "Clay receives → routes to specialist → user gets seamless output"

### 5. USE CASES
- Show Klade adapts to many company needs
- Clusters: research, reporting, workflow automation, financial analysis, ops, decks, data org, custom tasks
- Reinforce: one system, many specialists, shaped around the business

### 6. FILL BLANK SPACES
- Audit every section for dead zones, oversized whitespace, weak transitions
- Fill intelligently with workflow cards, orchestration diagrams, metrics strips, supporting labels
- Tighten vertical whitespace, improve visual rhythm

### 7. READABILITY FIXES
- Fix all contrast/readability issues especially in Pricing and Founder sections
- All text must be clearly readable at a glance on dark backgrounds

### 8. FOUNDER SECTION (MAJOR UPGRADE)
- Real founder photos are now available — USE THEM
- Premium dark surfaces, clean text contrast, polished image framing
- Personal, trustworthy, balanced with rest of site
- Structure: photo, name, title, short bio, email, specialty tags

### 9. CONTACT
- Remove beta@kladeai.com as primary
- Replace with direct founder contact pathways
- Founder contact cards with direct mailto CTAs
- More personal and credible

### 10. FOOTER
- Use new Klade wordmark/K mark
- Premium brand moment, not afterthought
- Clear navigation, founder contact paths, final CTA

### 11. PRICING PAGE
- Dark aesthetic consistent with main page
- Fix readability on dark backgrounds
- Premium card styling

### 12. TEAM PAGE
- Use new real founder photos
- Dark premium styling consistent with V3

## POSITIONING RULES
**DO use:** one bot many specialists, customizable AI agents, AI support shaped around your company, moldable AI analysts, built around your workflow, AI consulting meets execution
**DO NOT use:** AI-powered solutions, next-generation intelligence, revolutionizing productivity, "financial analyst replacement" as main frame, anything that sounds like generic chatbot startup

## COPY TONE
Sharp, premium, clear, modern, founder-led, confident, B2B credible, not bloated, not cheesy, not overhyped

## TECHNICAL REQUIREMENTS
- Works on desktop, tablet, mobile
- Performant animations (subtle, purposeful)
- Accessible (contrast, focus states, reduced motion)
- No broken CTAs or dead links
- Responsive — no awkward spacing gaps on mobile

## COLOR PALETTE FOR V3
- Primary background: deep navy `#0A0F1A` to `#0D1117`
- Secondary: `#10162F`
- Accent cyan: `#4FD1FF` (Clay eyes, interface accents — use sparingly)
- Accent purple: `#7A5CFF` (secondary accent)
- Electric blue: `#3C5BFF` (CTAs)
- Text primary: `#FFFFFF` / `#F0F4FF`
- Text secondary: `#9AA4CB` / `#B3BEDF`
- Card surfaces: `rgba(255,255,255,0.04)` to `rgba(255,255,255,0.08)`
- Borders: `rgba(255,255,255,0.10)` to `rgba(255,255,255,0.20)`

## FILE STRUCTURE
Edit these files:
- `src/app/page.tsx` — Main landing page (BIGGEST changes)
- `src/app/globals.css` — Global styles (dark theme evolution)
- `src/components/navigation.tsx` — Navbar
- `src/components/footer.tsx` — Footer
- `src/components/ui.tsx` — Shared UI components
- `src/components/animated.tsx` — Animation components
- `src/components/site-shell.tsx` — Shell wrapper
- `src/app/team/page.tsx` — Team page
- `src/app/pricing/page.tsx` — Pricing page
- `src/app/layout.tsx` — Root layout (if needed)

## SUCCESS = the site immediately communicates:
1. What Klade does (moldable AI agents)
2. Who Clay is (one AI teammate orchestrating many specialists)
3. Why Clay is different (not a chatbot, not narrow)
4. How Clay adapts (moldable to different business needs)
5. Why trust Klade (real founders, real video, premium execution)
6. What to do next (clear CTAs throughout)

Make it feel like a billion-dollar startup's website. Premium, restrained, cinematic, intentional. Every pixel matters.
