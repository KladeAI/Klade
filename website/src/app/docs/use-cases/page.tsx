"use client";

import { FadeIn } from "@/components/animated";
import { DocsCallout, DocsHeading, DocsSubheading, DocsText, TableOfContents } from "@/components/docs";
import { Button } from "@/components/ui";

const tocItems = [
  { id: "pe-due-diligence", label: "PE Firm Due Diligence" },
  { id: "hedge-fund-brief", label: "Hedge Fund Morning Brief" },
  { id: "family-office", label: "Family Office Review" },
  { id: "startup-board", label: "Startup Board Prep" },
  { id: "ib-pitch", label: "Investment Banking Pitch" },
];

const useCases = [
  {
    id: "pe-due-diligence",
    title: "PE Firm Due Diligence",
    scenario: "A private equity associate needs to evaluate a potential acquisition target before the Monday IC meeting.",
    howClayHelps: "Clay runs parallel analysis across multiple desks: company deep-dive from Research, DCF and LBO from Valuation, financial statement analysis from Accounting, and risk assessment from the Risk desk. The associate receives a complete due diligence package — not raw data, but structured analysis with sourced assumptions.",
    output: "Complete due diligence package: business overview, financial analysis, valuation range (DCF + comps + LBO), key risks, and investment recommendation — ready for IC review.",
    time: "Minutes instead of a weekend",
  },
  {
    id: "hedge-fund-brief",
    title: "Hedge Fund Morning Brief",
    scenario: "A portfolio manager needs a comprehensive market brief every morning before the 8 AM meeting, covering overnight developments, portfolio-relevant events, and actionable intelligence.",
    howClayHelps: "Clay's Market Intelligence desk generates a systematic morning brief: overnight market moves, earnings results, macro developments, and events relevant to existing positions. The brief is delivered automatically through Teams before the meeting starts.",
    output: "Daily morning brief: market summary, overnight developments, earnings highlights, macro indicators, and position-specific alerts with context and analysis.",
    time: "Automated daily delivery",
  },
  {
    id: "family-office",
    title: "Family Office Portfolio Review",
    scenario: "A family office CIO needs quarterly portfolio analytics covering allocation, performance attribution, risk exposure, and rebalancing recommendations.",
    howClayHelps: "Clay coordinates across the Wealth & Risk desk for portfolio analytics and the Research desk for position-level analysis. The result is a comprehensive quarterly review that would typically require a full analyst team to produce.",
    output: "Quarterly portfolio review: performance attribution, sector/geographic exposure analysis, concentration risk assessment, and rebalancing recommendations with rationale.",
    time: "Hours instead of days",
  },
  {
    id: "startup-board",
    title: "Startup Board Prep",
    scenario: "A CFO needs to prepare board materials including financial performance, KPI tracking, market context, and forward-looking projections for next week's board meeting.",
    howClayHelps: "Clay pulls from the FP&A desk for financial analysis and KPIs, Market Intelligence for competitive context, and the Valuation desk for updated company projections. Materials are formatted for board presentation.",
    output: "Board package: financial performance summary, KPI dashboard with variance analysis, competitive landscape update, and forward guidance with scenario modeling.",
    time: "Hours instead of a week",
  },
  {
    id: "ib-pitch",
    title: "Investment Banking Pitch Support",
    scenario: "A VP needs to prepare a pitch deck for a potential sell-side mandate, requiring market analysis, comparable transactions, and preliminary valuation work.",
    howClayHelps: "Clay coordinates across Research (market analysis), Valuation (comps and preliminary valuation), and Deal Execution (transaction rationale and process overview). Output is structured for deck integration — not raw analysis, but slide-ready content.",
    output: "Pitch materials: market overview, transaction rationale, comparable analysis (trading and precedent), preliminary valuation range, and suggested process timeline.",
    time: "Hours instead of days",
  },
];

export default function UseCasesPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4fd1ff]">Real Scenarios</p>
          <DocsHeading className="mt-4">Use Cases</DocsHeading>
          <DocsText className="mt-4 text-lg">
            Clay is designed for teams that produce analytical deliverables under time pressure.
            Here&apos;s how real financial teams use Clay to accelerate their work.
          </DocsText>
        </FadeIn>

        {useCases.map((uc, i) => (
          <FadeIn key={uc.id} delay={i * 0.05}>
            <DocsSubheading id={uc.id}>{uc.title}</DocsSubheading>
            
            <div className="space-y-4">
              <div className="rounded-xl border border-white/8 bg-white/4 p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-[#9aa4cb]">The scenario</p>
                <p className="mt-2 text-sm text-[#b3bedf]">{uc.scenario}</p>
              </div>

              <div className="rounded-xl border border-[#3c5bff]/20 bg-[#3c5bff]/5 p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-[#4fd1ff]">How Clay helps</p>
                <p className="mt-2 text-sm text-[#d8def5]">{uc.howClayHelps}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/8 bg-white/4 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#9aa4cb]">Output</p>
                  <p className="mt-2 text-sm text-[#b3bedf]">{uc.output}</p>
                </div>
                <div className="rounded-xl border border-[#4fd1ff]/20 bg-[#4fd1ff]/5 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#4fd1ff]">Time savings</p>
                  <p className="mt-2 text-sm font-medium text-white">{uc.time}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}

        <FadeIn delay={0.3}>
          <DocsCallout type="tip">
            These are just starting points. Clay adapts to your specific workflows — tell us what your team
            needs and we&apos;ll show you how Clay handles it.
          </DocsCallout>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/demo">See Clay in Action →</Button>
            <Button href="/#lead-form" variant="secondary">Talk to a Founder →</Button>
          </div>
        </FadeIn>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
}
