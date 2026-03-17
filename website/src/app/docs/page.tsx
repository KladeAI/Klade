"use client";

import { FadeIn } from "@/components/animated";
import { DocsCallout, DocsHeading, DocsSubheading, DocsText, FeatureCard, TableOfContents } from "@/components/docs";
import { Button } from "@/components/ui";
import Link from "next/link";

const tocItems = [
  { id: "what-is-clay", label: "What is Clay?" },
  { id: "specialist-desks", label: "14 Specialist Desks" },
  { id: "get-started", label: "Get Started" },
];

const deskCategories = [
  { icon: "📊", title: "Valuation & Modeling", desc: "DCFs, LBOs, comps, and scenario analysis with cited assumptions." },
  { icon: "🔍", title: "Research & Analysis", desc: "Company deep-dives, sector screening, and competitive intelligence." },
  { icon: "📋", title: "Accounting & FP&A", desc: "Financial statement analysis, KPI tracking, and budget modeling." },
  { icon: "⚖️", title: "Wealth & Risk Management", desc: "Portfolio analytics, risk assessment, and allocation optimization." },
  { icon: "🤝", title: "Deal Execution", desc: "IC memo support, transaction screening, and deal flow management." },
  { icon: "📡", title: "Market Intelligence", desc: "Earnings monitoring, macro analysis, and real-time market briefs." },
];

export default function DocsLandingPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1">
        <FadeIn>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4fd1ff]/25 bg-[#4fd1ff]/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#4fd1ff]">
            Documentation
          </div>
          <DocsHeading className="mt-6">Welcome to Klade</DocsHeading>
          <DocsText className="mt-4 text-lg">
            Meet Clay, your AI financial analyst. Clay isn&apos;t a chatbot. It&apos;s a structured analytical engine
            with 14 specialist desks covering everything from valuation modeling to portfolio risk.
          </DocsText>
        </FadeIn>

        <FadeIn delay={0.05}>
          <DocsSubheading id="what-is-clay">What is Clay?</DocsSubheading>
          <DocsText>
            Clay is Klade&apos;s AI analyst — a single interface backed by specialized agents that execute
            structured financial work. When you ask Clay a question, it doesn&apos;t generate a wall of text.
            It routes your request to the right specialist desk, executes rigorous analysis, and returns
            a deliverable you can use immediately.
          </DocsText>
          <DocsText className="mt-4">
            Think of Clay as the analyst who never sleeps, never forgets a source, and can run
            parallel workstreams across valuation, research, risk, and operations simultaneously.
          </DocsText>
          <DocsCallout type="tip">
            Clay produces investment-grade deliverables — not chat responses. Every output is structured,
            sourced, and formatted for professional use.
          </DocsCallout>
        </FadeIn>

        <FadeIn delay={0.1}>
          <DocsSubheading id="specialist-desks">14 Specialist Desks</DocsSubheading>
          <DocsText>
            Each desk is a purpose-built analytical engine focused on a specific domain of financial work.
            Clay automatically routes your requests to the right desk — or coordinates across multiple desks
            for complex tasks.
          </DocsText>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {deskCategories.map((desk) => (
              <FeatureCard key={desk.title} icon={desk.icon} title={desk.title} description={desk.desc} />
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <DocsSubheading id="get-started">Get Started</DocsSubheading>
          <DocsText>
            Ready to see what Clay can do for your team? Start with our quickstart guide for a walkthrough
            of the onboarding process, or explore how Clay works under the hood.
          </DocsText>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/docs/quickstart">Getting Started →</Button>
            <Button href="/docs/how-clay-works" variant="secondary">How Clay Works →</Button>
          </div>
        </FadeIn>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
}
