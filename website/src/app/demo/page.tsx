"use client";

import { FadeIn } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/* ===== WORKFLOW STEPS ===== */
const workflowSteps = [
  {
    number: 1,
    title: "You ask Clay",
    desc: "Submit a natural language request — no special syntax, no forms, no learning curve.",
    icon: "💬",
    color: "#4fd1ff",
    example: "\"Build a DCF for NVIDIA with bear/base/bull scenarios.\"",
  },
  {
    number: 2,
    title: "Clay interprets & routes",
    desc: "Clay analyzes your request and identifies the right specialist desks for the job.",
    icon: "🧠",
    color: "#3c5bff",
    example: "Routes to: Valuation Desk, Research Desk, Risk Desk",
  },
  {
    number: 3,
    title: "Specialists execute",
    desc: "Dedicated analytical agents work in parallel — each expert in their domain.",
    icon: "⚡",
    color: "#7a5cff",
    example: "3 desks executing simultaneously with cross-referencing",
  },
  {
    number: 4,
    title: "Output delivered",
    desc: "Structured, sourced, professional-grade deliverable — ready to use immediately.",
    icon: "📊",
    color: "#4fd1ff",
    example: "Complete DCF model with sensitivity analysis and executive summary",
  },
];

/* ===== USE CASE TABS ===== */
const useCaseTabs = [
  {
    label: "Financial Analysis",
    input: "\"Build a three-statement model for Stripe's IPO valuation with peer comparables and sensitivity analysis on revenue growth assumptions.\"",
    process: ["Valuation Desk builds DCF + comps framework", "Research Desk gathers peer data and market context", "Risk Desk models bear/base/bull scenarios"],
    output: "Complete three-statement model with peer comp table, DCF with WACC sensitivity, bull/base/bear scenarios, and 2-page executive summary — all sourced and formatted.",
  },
  {
    label: "Research & Due Diligence",
    input: "\"Run due diligence on Acme Corp for potential acquisition. Focus on business model sustainability, competitive moat, financial health, and key risks.\"",
    process: ["Research Desk executes company deep-dive", "Accounting Desk analyzes financial statements", "Risk Desk identifies and quantifies key risks"],
    output: "Due diligence package: business overview, competitive analysis, 3-year financial trend analysis, risk matrix with probability/impact scoring, and investment recommendation with thesis.",
  },
  {
    label: "Operations & Reporting",
    input: "\"Generate our Q1 portfolio performance report with attribution analysis, sector exposure breakdown, and rebalancing recommendations.\"",
    process: ["Wealth Desk calculates performance attribution", "Risk Desk analyzes concentration and exposure", "Market Intelligence provides benchmark context"],
    output: "Quarterly report: returns by position and sector, benchmark comparison, attribution waterfall, exposure heatmap, and 5 specific rebalancing recommendations with rationale.",
  },
  {
    label: "Executive Prep",
    input: "\"Prepare board materials for next Tuesday. Include Q4 financial performance, 2026 budget variance, market competitive update, and strategic outlook.\"",
    process: ["FP&A Desk compiles financial performance + variances", "Research Desk builds competitive landscape update", "Valuation Desk models forward projections"],
    output: "Board deck content: 12-slide package covering P&L summary, KPI dashboard with YoY trends, budget vs. actual analysis, competitive positioning map, and 2026 strategic priorities.",
  },
];

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SiteShell>
      {/* ===== HERO ===== */}
      <Section className="pt-16 md:pt-20">
        <FadeIn>
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4fd1ff]/25 bg-[#4fd1ff]/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#4fd1ff]">
              Product Demo
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white md:text-6xl">
              See Clay in Action
            </h1>
            <p className="mt-5 text-lg text-[#b3bedf] md:text-xl">
              Watch how Clay transforms natural language requests into structured, professional-grade
              financial deliverables — in minutes, not days.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="https://calendly.com/arjun-kladeai/30min" eventName="demo_cta_click" eventPayload={{ placement: "demo_hero", cta: "book_demo" }}>
                Book a Live Demo
              </Button>
              <Button href="#workflow" variant="secondary">
                See How It Works ↓
              </Button>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ===== WORKFLOW VISUALIZATION ===== */}
      <Section id="workflow" className="scroll-mt-20">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4fd1ff]">The Process</p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-5xl">
            From question to deliverable
          </h2>
          <p className="mt-3 max-w-3xl text-[#9aa4cb]">
            Every Clay request follows the same disciplined process — route, execute, deliver.
            Here&apos;s what happens under the hood.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative rounded-2xl border border-white/8 bg-white/4 p-6 transition-all duration-300 hover:border-white/14"
              >
                {/* Connection line on desktop */}
                {i < workflowSteps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-white/20 to-transparent lg:block" />
                )}
                
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full border text-xl"
                  style={{ borderColor: `${step.color}40`, backgroundColor: `${step.color}12` }}
                >
                  {step.icon}
                </div>
                <p className="mt-4 text-sm font-semibold text-white">{step.title}</p>
                <p className="mt-2 text-xs text-[#9aa4cb]">{step.desc}</p>
                <div className="mt-3 rounded-lg border border-white/6 bg-white/3 px-3 py-2">
                  <p className="text-[11px] text-[#b3bedf] italic">{step.example}</p>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ===== USE CASE TABS ===== */}
      <Section className="pt-6">
        <FadeIn>
          <div className="rounded-3xl border border-white/8 bg-white/3 p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#4fd1ff]">Scenarios</p>
            <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
              Clay across financial workflows
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-[#9aa4cb]">
              Toggle between scenarios to see how Clay handles different types of financial work.
            </p>

            {/* Tab buttons */}
            <div className="mt-6 flex flex-wrap gap-2">
              {useCaseTabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className={`rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
                    activeTab === i
                      ? "bg-[#3c5bff]/20 text-white border border-[#3c5bff]/40 font-medium"
                      : "text-[#9aa4cb] border border-white/8 bg-white/4 hover:text-white hover:bg-white/6"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-6 space-y-4"
              >
                {/* Input */}
                <div className="rounded-xl border border-white/8 bg-white/4 p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#9aa4cb]">Request</p>
                  <p className="mt-2 text-sm text-white italic">{useCaseTabs[activeTab].input}</p>
                </div>

                {/* Process */}
                <div className="rounded-xl border border-[#3c5bff]/20 bg-[#3c5bff]/5 p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#4fd1ff]">Clay&apos;s Execution</p>
                  <div className="mt-3 space-y-2">
                    {useCaseTabs[activeTab].process.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#4fd1ff]/25 bg-[#4fd1ff]/10 text-[10px] font-bold text-[#4fd1ff]">
                          {i + 1}
                        </div>
                        <p className="text-sm text-[#d8def5]">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Output */}
                <div className="rounded-xl border border-[#4fd1ff]/20 bg-[#4fd1ff]/5 p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#4fd1ff]">Deliverable</p>
                  <p className="mt-2 text-sm text-[#d8def5]">{useCaseTabs[activeTab].output}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </FadeIn>
      </Section>

      {/* ===== FINAL CTA ===== */}
      <Section className="py-10 md:py-14">
        <FadeIn>
          <div className="rounded-3xl border border-[#4fd1ff]/15 bg-gradient-to-r from-[#0a0f2c] via-[#10162f] to-[#0a0f2c] p-8 md:p-12 text-center">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Ready to see Clay work on your data?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-[#b3bedf]">
              Book a live demo and we&apos;ll show you exactly how Clay handles your team&apos;s workflows.
              Or explore the documentation to learn more.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="https://calendly.com/arjun-kladeai/30min" eventName="demo_cta_click" eventPayload={{ placement: "demo_footer", cta: "book_demo" }}>
                Book a Live Demo
              </Button>
              <Button href="mailto:arjun@kladeai.com" variant="secondary" eventName="demo_cta_click" eventPayload={{ placement: "demo_footer", cta: "talk_founders" }}>
                Talk to the Founders
              </Button>
              <Button href="/docs" variant="secondary" eventName="demo_cta_click" eventPayload={{ placement: "demo_footer", cta: "explore_docs" }}>
                Explore Documentation
              </Button>
            </div>
          </div>
        </FadeIn>
      </Section>
    </SiteShell>
  );
}
