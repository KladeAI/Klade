"use client";

import { FadeIn } from "@/components/animated";
import { DocsCallout, DocsHeading, DocsSubheading, DocsText, ProcessStep, TableOfContents } from "@/components/docs";
import { Button } from "@/components/ui";

const tocItems = [
  { id: "step-1", label: "Step 1: We Learn Your Workflow" },
  { id: "step-2", label: "Step 2: Clay Is Configured" },
  { id: "step-3", label: "Step 3: Start Working" },
  { id: "what-to-expect", label: "What to Expect" },
];

export default function QuickstartPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4fd1ff]">Getting Started</p>
          <DocsHeading className="mt-4">Three Steps to Clay</DocsHeading>
          <DocsText className="mt-4 text-lg">
            From first conversation to live deployment in days — not months. Founder-led onboarding
            means you talk to the people who built Clay, not a sales team.
          </DocsText>
        </FadeIn>

        <FadeIn delay={0.05}>
          <DocsSubheading id="step-1">Step 1: We Learn Your Workflow</DocsSubheading>
          <DocsText>
            Every engagement starts with a focused discovery session. We map your team&apos;s analytical
            workflows, recurring deliverables, and pain points. This isn&apos;t a generic demo — it&apos;s a
            technical assessment of where Clay can create the most leverage.
          </DocsText>
          <DocsCallout type="info">
            Discovery sessions are led directly by Klade&apos;s founders. We understand the work because
            we&apos;ve done the work.
          </DocsCallout>
        </FadeIn>

        <FadeIn delay={0.1}>
          <DocsSubheading id="step-2">Step 2: Clay Is Configured for Your Team</DocsSubheading>
          <DocsText>
            Based on discovery, Clay is configured with the specialist desks, output formats, and
            data connections your team needs. Each deployment is isolated — your Clay instance is yours
            alone.
          </DocsText>
          <div className="mt-6 space-y-4">
            <ProcessStep number={1} title="Desk activation" description="We enable the specialist desks aligned to your workflows — valuation, research, risk, or all of them." />
            <ProcessStep number={2} title="Output calibration" description="Clay is tuned to produce deliverables in your preferred formats, structure, and level of detail." />
            <ProcessStep number={3} title="Integration setup" description="Connect Clay to your team's communication platform — Slack, Discord, or Telegram." />
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <DocsSubheading id="step-3">Step 3: Start Working with Clay</DocsSubheading>
          <DocsText>
            Once configured, Clay is live. Your team can start making requests immediately through
            your chosen platform. Clay handles the routing, execution, and delivery — your team just
            asks for what they need.
          </DocsText>
          <DocsCallout type="tip">
            Most teams are live within days of first contact. No lengthy implementation cycles,
            no training programs, no change management consultants.
          </DocsCallout>
        </FadeIn>

        <FadeIn delay={0.2}>
          <DocsSubheading id="what-to-expect">What to Expect</DocsSubheading>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Time to live", value: "Days, not months" },
              { label: "Onboarding style", value: "Founder-led, technical" },
              { label: "Setup required", value: "Minimal — we handle it" },
              { label: "Ongoing support", value: "Direct founder access" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/8 bg-white/4 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[#9aa4cb]">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-white">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/#lead-form">Start the Conversation →</Button>
          </div>
        </FadeIn>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
}
