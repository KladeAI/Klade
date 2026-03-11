"use client";

import { FadeIn, SpotlightCard, StaggerContainer, StaggerItem, TypingText } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

type LeadForm = {
  name: string;
  company: string;
  email: string;
  teamSize: string;
  role: string;
  bottleneck: string;
};

const initialForm: LeadForm = {
  name: "",
  company: "",
  email: "",
  teamSize: "",
  role: "",
  bottleneck: "",
};

const metrics = ["24/7 analysis", "Minutes to deliverables", "Fraction of analyst cost", "Built for finance teams"];

const trustSignals = [
  "Founder-led implementation and direct technical access",
  "Security + architecture review packet shared on first call",
  "No client-side secrets, scoped access design by default",
  "Private beta onboarding with limited finance-team slots",
];

const workflowPain = [
  "Reading filings and earnings transcripts",
  "Reviewing CIMs and investment materials",
  "Screening sectors for conviction signals",
  "Building memos, decks, and internal updates",
  "Summarizing live market moves for partners",
  "Re-answering repeat research requests",
];

const features = [
  "AI document analysis",
  "Sector screening",
  "Investment thesis generation",
  "Automated deliverables (PowerPoints, memos, reports)",
  "Earnings call summaries",
  "Workflow deployment",
];

const analystTraits = ["SEC + transcript grounded", "Evidence-cited outputs", "Partner-ready in minutes", "Built for high-trust finance teams"];

const founderCards = [
  {
    name: "Adam Benoit",
    role: "Co-Founder",
    blurb: "Economics-focused operator with a deep focus on market structure and investment research workflows.",
    image: "/founders/adam.svg",
  },
  {
    name: "Arjun Rath",
    role: "Co-Founder",
    blurb: "Builds the product and infrastructure stack that turns analyst workflows into reliable systems.",
    image: "/founders/arjun.svg",
  },
  {
    name: "Gavin Kim",
    role: "Co-Founder",
    blurb: "Leads quantitative systems design to keep outputs structured, defensible, and useful in live decisions.",
    image: "/founders/gavin.svg",
  },
];

function trackEvent(eventName: string, payload?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const event = { event: eventName, ...payload };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, string>>;
  }
}

export default function HomePage() {
  const [form, setForm] = useState<LeadForm>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("form_submit_attempt");
    setStatus("submitting");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed");

      setStatus("success");
      setForm(initialForm);
      trackEvent("form_submit");
      trackEvent("qualified_lead", { source: "homepage" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <SiteShell>
      <Section className="pt-20 md:pt-28">
        <div className="hero-shell relative overflow-hidden rounded-3xl px-6 py-14 md:px-12 md:py-18">
          <motion.div
            className="pointer-events-none absolute -left-20 -top-16 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl"
            animate={{ x: [0, 28, 0], y: [0, 18, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-violet-500/25 blur-3xl"
            animate={{ x: [0, -28, 0], y: [0, -16, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />

          <FadeIn>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-300">
                <span className="relative h-5 w-5 overflow-hidden rounded-full border border-indigo-300/40">
                  <Image src="/brand/klade-logo-draft.jpg" alt="Klade draft logo" fill sizes="20px" className="object-cover" />
                </span>
                Private beta · limited institutional cohort
              </div>
              <p className="rounded-full border border-indigo-300/25 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-100">
                Character-led analyst UX
              </p>
            </div>
            <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-white md:text-7xl lg:text-8xl leading-[0.98]">
              AI analysts for financial intelligence.
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-zinc-300 md:text-xl">
              Klade creates AI analysts that research companies, screen sectors, digest filings, and generate
              investment-grade deliverables in minutes.
            </p>
            <p className="mt-3 text-sm text-zinc-400">Founder team replies in under 24 hours. No spam. No long sales cycle.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#lead-form">Request Early Access</Button>
              <Button href="#lead-form" variant="secondary">Book a 20-min workflow teardown</Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-10 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
            <div className="rounded-2xl border border-indigo-300/20 bg-[#080a13]/85 p-5 shadow-[0_0_60px_-34px_rgba(129,140,248,0.7)]">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Live analyst workspace</p>
              <div className="mt-3 space-y-3 text-sm">
                <p className="ml-auto max-w-lg rounded-2xl bg-zinc-800/80 px-4 py-3 text-zinc-100">
                  Screen semiconductor suppliers with margin compression risk and summarize implications for FY guidance.
                </p>
                <p className="max-w-xl rounded-2xl border border-indigo-300/20 bg-zinc-900/80 px-4 py-4 text-zinc-200">
                  Done. 11 companies screened, risk-ranked table generated, and a 1-page investment memo drafted with source-cited filing notes.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Current output</p>
              <p className="mt-3 text-4xl font-semibold text-white">6 deliverables</p>
              <p className="text-sm text-zinc-400">before first analyst handoff of the day</p>
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section className="py-8">
        <div className="grid gap-3 rounded-2xl border border-zinc-900 bg-zinc-950/55 p-4 md:grid-cols-4">
          {metrics.map((item) => (
            <p key={item} className="text-center text-xs uppercase tracking-[0.14em] text-zinc-400">{item}</p>
          ))}
        </div>
      </Section>

      <Section className="pt-4 md:pt-8">
        <FadeIn>
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/5 p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Trust-ready from day one</p>
              <Button href="#security" variant="secondary">Review security posture</Button>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {trustSignals.map((signal) => (
                <p key={signal} className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-200">{signal}</p>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="text-4xl font-semibold text-white md:text-6xl">The workflow is familiar. The drag is expensive.</h2>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Your team is not short on talent. It is short on hours. Klade removes repetitive analysis load so top talent
            spends time on judgment, not manual compilation.
          </p>
        </FadeIn>
        <StaggerContainer className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflowPain.map((pain) => (
            <StaggerItem key={pain}>
              <SpotlightCard className="text-zinc-200">{pain}</SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      <Section>
        <FadeIn>
          <div className="rounded-2xl border border-indigo-300/25 bg-gradient-to-r from-zinc-900 via-indigo-950/35 to-zinc-950 p-6 md:p-8">
            <h2 className="text-3xl font-semibold text-white md:text-5xl">Traditional analyst capacity vs Klade AI analyst capacity</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-5">
                <p className="text-sm uppercase tracking-[0.16em] text-zinc-500">Traditional analyst</p>
                <ul className="mt-3 space-y-2 text-zinc-300">
                  <li>• ~$150K+ annual cost</li>
                  <li>• Limited working hours</li>
                  <li>• Manual prep across tools</li>
                  <li>• Throughput bottlenecks during live cycles</li>
                </ul>
              </div>
              <div className="rounded-xl border border-indigo-300/30 bg-indigo-500/10 p-5">
                <p className="text-sm uppercase tracking-[0.16em] text-indigo-200">Klade AI analyst</p>
                <ul className="mt-3 space-y-2 text-zinc-100">
                  <li>• Dramatically lower cost-per-output</li>
                  <li>• 24/7 execution reliability</li>
                  <li>• Instant task start + structured outputs</li>
                  <li>• Scales across concurrent workstreams</li>
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="text-4xl font-semibold text-white md:text-5xl">Scale your analyst team without scaling headcount.</h2>
        </FadeIn>
        <div className="mt-7 grid gap-4 md:grid-cols-4">
          {[
            "More throughput per week",
            "Faster turnarounds for partners",
            "Lower total research cost",
            "Always-on execution coverage",
          ].map((item) => (
            <FadeIn key={item} className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 text-zinc-200">
              {item}
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section id="capabilities">
        <FadeIn>
          <h2 className="mb-6 text-4xl font-semibold text-white md:text-5xl">Capability stack</h2>
        </FadeIn>
        <StaggerContainer className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <StaggerItem key={feature}>
              <SpotlightCard className="text-zinc-200">{feature}</SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      <Section>
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-indigo-300/25 bg-gradient-to-br from-zinc-950 via-indigo-950/25 to-zinc-900 p-6 md:p-8">
            <motion.div
              className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl"
              animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">Financial Analyst Avatar Concept</p>
                <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">Meet Kade — your on-screen AI financial analyst.</h2>
                <p className="mt-4 max-w-2xl text-zinc-300">
                  Emoji-human warmth with analyst-grade rigor. Kade reads filings, tracks deltas, and returns clear conviction calls that still feel conversational.
                </p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {analystTraits.map((trait) => (
                    <div key={trait} className="rounded-lg border border-zinc-800 bg-zinc-900/75 px-3 py-2 text-sm text-zinc-200">{trait}</div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-indigo-300/30 bg-zinc-950/85 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Avatar preview</p>
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                  <p className="text-4xl">🧑🏽‍💼</p>
                  <TypingText text="Kade is analyzing macro pressure across SaaS + semis now." className="mt-2 text-sm text-zinc-300" />
                  <div className="mt-3 rounded-lg border border-indigo-300/25 bg-indigo-500/10 p-3 text-sm text-indigo-100">💻 “3 risk deltas surfaced. Memo + slide shipped.”</div>
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-md border border-indigo-300/40">
                    <Image src="/brand/klade-logo-draft.jpg" alt="Klade badge" fill sizes="32px" className="object-cover" />
                  </div>
                  <p className="text-sm text-zinc-300">Branded persona anchored to Klade trust cues.</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="text-4xl font-semibold text-white md:text-5xl">Product outputs your team can use immediately</h2>
        </FadeIn>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Company research summary",
            "Sector breakdown with ranked signals",
            "Earnings call summary with key deltas",
            "PowerPoint preview for IC meeting",
            "Investment memo with cited evidence",
            "Analyst chat response with next actions",
          ].map((output) => (
            <FadeIn key={output} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-zinc-200">
              {output}
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <FadeIn>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-7">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Works where your team already works</h2>
            <p className="mt-3 max-w-3xl text-zinc-300">Deploy into Slack, Microsoft Teams, or your internal platform.</p>
            <div className="mt-6 rounded-xl border border-indigo-300/20 bg-zinc-900/80 p-4 text-sm text-zinc-200">
              <p className="text-zinc-400">Example interaction:</p>
              <p className="mt-2">User: “What changed in NVIDIA earnings vs prior quarter?”</p>
              <p className="mt-2 text-zinc-100">
                Klade: “Revenue beat consensus by 4.2%. Gross margin guidance tightened by 60 bps due to mix shift.
                Data center backlog remains the primary upside driver. I generated a 5-point risk brief and attached a
                slide for the Monday IC review.”
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section id="how-it-works">
        <FadeIn>
          <h2 className="text-4xl font-semibold text-white md:text-5xl">How Klade works</h2>
        </FadeIn>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            "Klade configures your financial AI analyst",
            "We connect it to your workflow stack",
            "Your team assigns research and execution tasks",
            "Structured outputs ship instantly",
          ].map((step, index) => (
            <FadeIn key={step} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Step {index + 1}</p>
              <p className="mt-2 text-zinc-100">{step}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <FadeIn>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">AI analysts tailored to your workflow</h2>
            <p className="mt-3 text-zinc-300">
              Consultation → workflow analysis → custom design → deployment → iteration.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {["Deal research", "Sector intelligence", "Investment memo production", "Reporting automation", "Earnings monitor", "Internal Q&A desk"].map((item) => (
                <div key={item} className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-200">{item}</div>
              ))}
            </div>
            <div className="mt-6">
              <Button href="#lead-form">Schedule a consultation</Button>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["10x", "Output expansion"],
            ["24/7", "Availability"],
            ["Minutes", "To deliverables"],
            ["Lower", "Cost per insight"],
          ].map(([value, label]) => (
            <FadeIn key={label} className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-5 text-center">
              <p className="text-3xl font-semibold text-white">{value}</p>
              <p className="mt-1 text-zinc-400">{label}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <FadeIn>
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-8">
            <h2 className="text-3xl font-semibold text-white">Pricing preview</h2>
            <p className="mt-3 max-w-3xl text-zinc-300">Usage-based credit packs + recurring subscriptions + enterprise deployments for custom environments.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/pricing">View full pricing</Button>
              <Button href="#lead-form" variant="secondary">Discuss enterprise options</Button>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div className="rounded-2xl border border-indigo-300/25 bg-indigo-500/10 p-8">
            <h2 className="text-3xl font-semibold text-white">Be among the first teams using AI analysts.</h2>
            <p className="mt-3 max-w-3xl text-zinc-300">Private beta is limited to a small number of finance teams for high-touch implementation support.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="#lead-form">Request Early Access</Button>
              <Button href="mailto:beta@kladeai.com" variant="secondary">beta@kladeai.com</Button>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section id="lead-form" className="scroll-mt-28">
        <FadeIn>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-3xl font-semibold text-white">Tell us about your team.</h2>
            <p className="mt-2 text-zinc-400">You’ll leave with a concrete automation plan, even if we don’t work together.</p>

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit} onFocus={() => trackEvent("form_start")}>
              <label className="grid gap-2 text-sm text-zinc-300">
                Name
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-400"
                />
              </label>
              <label className="grid gap-2 text-sm text-zinc-300">
                Company
                <input
                  required
                  value={form.company}
                  onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-400"
                />
              </label>
              <label className="grid gap-2 text-sm text-zinc-300">
                Work Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-400"
                />
              </label>
              <label className="grid gap-2 text-sm text-zinc-300">
                Team Size
                <input
                  required
                  value={form.teamSize}
                  onChange={(event) => setForm((prev) => ({ ...prev, teamSize: event.target.value }))}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-400"
                />
              </label>
              <label className="grid gap-2 text-sm text-zinc-300 md:col-span-2">
                Role
                <input
                  required
                  value={form.role}
                  onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-400"
                />
              </label>
              <label className="grid gap-2 text-sm text-zinc-300 md:col-span-2">
                What does your team need help with?
                <textarea
                  required
                  rows={4}
                  value={form.bottleneck}
                  onChange={(event) => setForm((prev) => ({ ...prev, bottleneck: event.target.value }))}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-400"
                />
              </label>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center justify-center rounded-xl border border-indigo-300/20 bg-gradient-to-r from-white to-indigo-100 px-5 py-3 text-sm font-semibold text-black shadow-[0_0_24px_rgba(99,102,241,0.35)] transition-all duration-300 hover:scale-[1.03] disabled:opacity-60"
                >
                  {status === "submitting" ? "Submitting..." : "Submit Request"}
                </button>
                {status === "success" && <p className="mt-3 text-sm text-emerald-300">Request submitted. We’ll follow up shortly.</p>}
                {status === "error" && <p className="mt-3 text-sm text-rose-300">Something broke. Please email beta@kladeai.com.</p>}
                <p className="mt-3 text-xs text-zinc-500">No spam. Founder-led responses only.</p>
              </div>
            </form>

            <div className="mt-8 grid gap-2 text-sm text-zinc-400 md:grid-cols-3">
              <Link href="mailto:adam@kladeai.com" className="hover:text-white">adam@kladeai.com</Link>
              <Link href="mailto:arjun@kladeai.com" className="hover:text-white">arjun@kladeai.com</Link>
              <Link href="mailto:gavin@kladeai.com" className="hover:text-white">gavin@kladeai.com</Link>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Not ready to book yet?</h2>
            <p className="mt-3 text-zinc-300">Review a sample workflow and see what a full cycle looks like in practice.</p>
            <div className="mt-6">
              <Button href="/sample-workflow">See sample workflow</Button>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section id="security">
        <FadeIn>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/85 p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold text-white">Security and trust posture</h2>
                <p className="mt-3 max-w-3xl text-zinc-300">
                  Every deployment starts with a workflow + access review. You get a clear architecture brief, risk boundaries,
                  and a scoped rollout plan before production use.
                </p>
              </div>
              <Button href="#lead-form" variant="secondary">Get security review packet</Button>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                "Least-privilege access controls and workflow-scoped permissions",
                "No client-side secrets or exposed credentials",
                "Secure deployment patterns aligned to enterprise review expectations",
                "Founder-led implementation with direct technical oversight",
              ].map((item) => (
                <div key={item} className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-200">{item}</div>
              ))}
            </div>
            <p className="mt-5 text-sm text-zinc-400">Typical first-call output: data-flow map, permission model, and rollout checklist your security reviewer can evaluate quickly.</p>
          </div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="text-4xl font-semibold text-white md:text-5xl">Founders in the build loop</h2>
        </FadeIn>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {founderCards.map((founder) => (
            <FadeIn key={founder.name} className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/40 hover:shadow-[0_20px_45px_-30px_rgba(99,102,241,0.8)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-zinc-800">
                <Image src={founder.image} alt={`${founder.name} profile photo`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <p className="mt-4 text-sm text-zinc-400">{founder.role}</p>
              <p className="text-xl font-semibold text-white">{founder.name}</p>
              <p className="mt-2 text-sm text-zinc-300">{founder.blurb}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <FadeIn>
          <div className="rounded-2xl border border-indigo-300/25 bg-gradient-to-r from-zinc-900 via-indigo-950/35 to-zinc-950 p-8 text-center">
            <h2 className="text-4xl font-semibold text-white md:text-5xl">Hire your first AI analyst.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-300">
              High-output teams are using Klade to expand capacity, move faster, and make better-informed decisions.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="#lead-form">Request Early Access</Button>
              <Button href="#lead-form" variant="secondary">Request Demo</Button>
            </div>
          </div>
        </FadeIn>
      </Section>
    </SiteShell>
  );
}
