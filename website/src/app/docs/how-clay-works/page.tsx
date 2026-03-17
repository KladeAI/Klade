"use client";

import { FadeIn } from "@/components/animated";
import { DocsCallout, DocsHeading, DocsSubheading, DocsText, TableOfContents } from "@/components/docs";
import { motion } from "framer-motion";

const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "process-flow", label: "The Process Flow" },
  { id: "routing", label: "Intelligent Routing" },
  { id: "execution", label: "Specialist Execution" },
  { id: "output", label: "Structured Output" },
];

const processSteps = [
  {
    number: 1,
    title: "You ask Clay",
    desc: "Submit a natural language request through your team's connected platform. No special syntax, no forms — just describe what you need.",
    detail: "\"Build a DCF for NVIDIA with bear/base/bull scenarios and flag key growth drivers.\"",
    color: "#4fd1ff",
  },
  {
    number: 2,
    title: "Clay interprets & routes",
    desc: "Clay analyzes your request, identifies the required specialist desks, and constructs an execution plan. Complex requests are decomposed across multiple desks.",
    detail: "Routes to: Valuation Desk (DCF), Research Desk (growth drivers), Risk Desk (scenario analysis)",
    color: "#3c5bff",
  },
  {
    number: 3,
    title: "Specialists execute",
    desc: "Each specialist desk runs structured analysis independently and in parallel. Every step is sourced, every assumption is cited, every calculation is traceable.",
    detail: "Parallel execution across desks with cross-referencing and data validation",
    color: "#7a5cff",
  },
  {
    number: 4,
    title: "Output delivered",
    desc: "Results are synthesized into a structured, professional deliverable and returned through your connected platform. Ready to use — no reformatting needed.",
    detail: "Complete DCF model with assumptions table, sensitivity analysis, and executive summary",
    color: "#4fd1ff",
  },
];

export default function HowClayWorksPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4fd1ff]">Architecture</p>
          <DocsHeading className="mt-4">How Clay Works</DocsHeading>
          <DocsText className="mt-4 text-lg">
            When you ask Clay a question, it doesn&apos;t just generate text. Clay routes your request to the
            right specialist desk, executes structured analysis, and synthesizes results into a deliverable
            you can use immediately.
          </DocsText>
        </FadeIn>

        <FadeIn delay={0.05}>
          <DocsSubheading id="overview">Overview</DocsSubheading>
          <DocsText>
            Clay is an orchestration engine. Unlike single-purpose AI tools that try to do everything with
            one model, Clay maintains specialized analytical agents — each expert in a specific domain of
            financial work. When a request comes in, Clay determines the optimal routing, dispatches work
            to the right specialists, and assembles the final output.
          </DocsText>
          <DocsCallout type="info">
            This architecture means Clay doesn&apos;t trade off depth for breadth. Each specialist desk is
            purpose-built, so you get expert-level analysis across every domain.
          </DocsCallout>
        </FadeIn>

        <FadeIn delay={0.1}>
          <DocsSubheading id="process-flow">The Process Flow</DocsSubheading>
          
          {/* Visual process flow */}
          <div className="mt-8 space-y-4">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative"
              >
                <div className="flex gap-5">
                  {/* Step indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-sm font-bold"
                      style={{ borderColor: `${step.color}40`, backgroundColor: `${step.color}15`, color: step.color }}
                    >
                      {step.number}
                    </div>
                    {i < processSteps.length - 1 && (
                      <div className="mt-2 h-full w-px bg-gradient-to-b from-white/15 to-transparent" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-8">
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm text-[#b3bedf]">{step.desc}</p>
                    <div className="mt-3 rounded-lg border border-white/8 bg-white/4 px-4 py-3">
                      <p className="text-xs text-[#9aa4cb] italic">{step.detail}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <DocsSubheading id="routing">Intelligent Routing</DocsSubheading>
          <DocsText>
            Clay&apos;s routing engine understands financial context. It doesn&apos;t just match keywords — it
            interprets your intent, identifies the analytical domains involved, and constructs an
            execution plan that may span multiple specialist desks.
          </DocsText>
          <DocsText className="mt-4">
            For simple requests, this means instant routing to the right desk. For complex multi-step
            analyses, Clay decomposes the work and coordinates parallel execution across desks.
          </DocsText>
        </FadeIn>

        <FadeIn delay={0.2}>
          <DocsSubheading id="execution">Specialist Execution</DocsSubheading>
          <DocsText>
            Each specialist desk operates with domain-specific analytical frameworks. The Valuation Desk
            builds models differently than the Research Desk writes memos — because the work is different.
            This specialization is what allows Clay to produce professional-grade output across every domain.
          </DocsText>
        </FadeIn>

        <FadeIn delay={0.25}>
          <DocsSubheading id="output">Structured Output</DocsSubheading>
          <DocsText>
            Every Clay deliverable is structured, sourced, and formatted for professional use. No
            reformatting needed. Whether it&apos;s a DCF model, investment memo, or market brief — the
            output is ready to share with your team, your clients, or your investment committee.
          </DocsText>
          <DocsCallout type="tip">
            Clay&apos;s outputs cite their sources, show their assumptions, and maintain consistent formatting
            across every deliverable. Quality is systematic, not accidental.
          </DocsCallout>
        </FadeIn>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
}
