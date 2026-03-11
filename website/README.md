# Klade Website V2

Premium launch-preview build for Klade's institutional AI analyst landing experience.

## Focus Areas (current)
- High-trust conversion homepage
- Founder presence + premium visual polish
- Mobile-first navigation + sticky CTA
- Security-forward lead capture
- Strict origin hardening for lead API (same-host Vercel preview enforcement)
- Security review fast-lane conversion cues near primary form CTA
- Smart mobile sticky CTA (auto-hides near form + dismiss control)

## Local Development
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Morning Build / QA Checklist
Before sharing a preview URL:

1. **Run a production build**
   ```bash
   npm run build
   ```
2. **Spot-check key sections on desktop + mobile width**
   - Hero + CTA buttons
   - Mobile hamburger menu interactions
   - Security posture section
   - Founder cards
   - Lead form submit states
3. **Verify conversion polish components**
   - Credibility strip renders
   - FAQ accordion opens/closes cleanly
   - Mobile sticky CTA is visible and not blocking form submission
4. **Validate lead intake hardening**
   - `/api/lead` rejects invalid payloads
   - Honeypot field remains hidden
   - Rate limit returns 429 on burst attempts

## Deploy Preview (Vercel)
```bash
vercel
```

If `vercel` isn't installed:
```bash
npm i -g vercel
vercel login
vercel
```

## Production Deploy
```bash
vercel --prod
```

## Notes
- Founder visuals load from `public/founders/*.jpg` with `.svg` fallback support in homepage cards
- Lead form posts to `src/app/api/lead/route.ts`
- Global security headers + CSP configured in `next.config.ts`
- Homepage includes Organization schema (`application/ld+json`) for search trust signals
- Core homepage is `src/app/page.tsx`
