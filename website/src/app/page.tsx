"use client";

import { CountUp, FadeIn, ProgressBar, SpotlightCard, StaggerContainer, StaggerItem } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

/* ===== DATA ===== */

type LeadForm = {
  name: string;
  company: string;
  email: string;
  teamSize: string;
  role: string;
  bottleneck: string;
  website: string;
  startedAt: string;
};

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

const createInitialForm = (): LeadForm => ({
  name: "", company: "", email: "", teamSize: "", role: "", bottleneck: "", website: "", startedAt: String(Date.now()),
});

const requiredFields: Array<keyof Pick<LeadForm, "name" | "company" | "email" | "teamSize" | "role" | "bottleneck">> = [
  "name", "company", "email", "teamSize", "role", "bottleneck",
];

const trustTickerItems = [
  "One bot, many specialists",
  "Models & valuations",
  "Research & memos",
  "PowerPoint-ready output",
  "Workflow automation",
  "Operations support",
  "Data organization",
  "Custom business tasks",
  "Built around your workflow",
  "Founder-led onboarding",
  "Enterprise-grade security",
  "24/7 execution coverage",
];

const capabilities = [
  { title: "Financial Models", desc: "DCFs, LBOs, comps tables — structured and cited.", icon: "📊" },
  { title: "Presentations", desc: "PowerPoint-ready decks from data to narrative.", icon: "📑" },
  { title: "Research & Memos", desc: "Deep-dive research with sources and analysis.", icon: "🔍" },
  { title: "Internal Reports", desc: "Automated reporting for stakeholders and teams.", icon: "📋" },
  { title: "Workflow Automation", desc: "Recurring processes systematized and executed.", icon: "⚙️" },
  { title: "Data Organization", desc: "Structure, clean, and surface insights from data.", icon: "🗃️" },
  { title: "Operations Support", desc: "Process management, coordination, logistics.", icon: "🔗" },
  { title: "Custom Tasks", desc: "Anything your team needs — Clay adapts.", icon: "🎯" },
];

const orchestrationSteps = [
  { label: "You ask Clay", desc: "Natural language request through one interface." },
  { label: "Clay routes", desc: "Work is dispatched to the right specialist agent." },
  { label: "Specialists execute", desc: "Dedicated sub-agents handle the task with precision." },
  { label: "Output delivered", desc: "Structured, cited, ready-to-use deliverables returned." },
];

const roiCards = [
  { title: "Less repetitive load", desc: "Free your team from rebuilding the same models, reports, and decks every week." },
  { title: "Faster turnaround", desc: "Deliverables in minutes, not days. Research, analysis, and presentations on demand." },
  { title: "Lower cost per output", desc: "Dramatically cheaper than additional headcount for recurring analytical work." },
  { title: "Consistent quality", desc: "Structured, cited, format-compliant output every time — no variance." },
];

const useCases = [
  { title: "Research & Due Diligence", desc: "Company screening, market analysis, competitive intelligence." },
  { title: "Financial Analysis", desc: "Valuation models, earnings summaries, sector deep-dives." },
  { title: "Reporting & Dashboards", desc: "Recurring reports, KPI tracking, stakeholder updates." },
  { title: "Deck & Presentation Creation", desc: "IC decks, board materials, client presentations." },
  { title: "Operations & Process", desc: "Workflow coordination, data pipeline management, internal tooling." },
  { title: "Custom Internal Tasks", desc: "Whatever your team needs — Clay molds to the workflow." },
];

const metrics = [
  { value: 24, suffix: "/7", label: "execution coverage" },
  { value: 10, suffix: "x", label: "output expansion" },
  { value: 70, suffix: "%", label: "less repetitive load" },
  { value: 15, suffix: "min", label: "to first draft" },
];

const founders = [
  { name: "Adam Benoit", role: "Co-Founder", focus: "Economics, financial markets, and investment research workflows.", email: "adam@kladeai.com", image: "/founders/adam.jpg" },
  { name: "Arjun Rath", role: "Co-Founder", focus: "Product + infrastructure systems that turn analyst workflows into reliable execution.", email: "arjun@kladeai.com", image: "/founders/arjun.jpg" },
  { name: "Gavin Kim", role: "Co-Founder", focus: "Quantitative systems design and structured decision-support outputs.", email: "gavin@kladeai.com", image: "/founders/gavin.jpg" },
];

function trackEvent(eventName: string, payload?: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
}

declare global {
  interface Window { dataLayer?: Array<Record<string, string>>; }
}

/* ===== COMPONENTS ===== */

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <div className="video-container aspect-video">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster="/brand/clay-avatar.jpg"
        className="h-full w-full object-cover"
      >
        <source src="/video/klade-launch.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-[#080c1a]/60 via-transparent to-transparent" />
    </div>
  );
}

/* ===== PAGE ===== */

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<LeadForm>(() => createInitialForm());
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const completedFields = useMemo(
    () => requiredFields.filter((key) => form[key].trim().length > 0).length,
    [form]
  );
  const completion = Math.round((completedFields / requiredFields.length) * 100);

  useEffect(() => { trackEvent("landing_view", { source: "homepage_v3" }); }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("form_submit_attempt", { source: "homepage_v3" });
    setStatus("submitting");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("submit-failed");
      setStatus("success");
      setForm(createInitialForm());
      trackEvent("qualified_lead", { source: "homepage_v3" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <SiteShell>
      {/* ===== HERO ===== */}
      <Section className="pt-2 md:pt-4">
        <div className="relative overflow-hidden rounded-xl border border-white/8 bg-gradient-to-b from-[#0d1225] to-[#080c1a] px-5 py-8 md:px-8 md:py-10">
          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-[#4FD1FF]/8 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-[#7A5CFF]/8 blur-3xl" />

          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4FD1FF]/25 bg-[#4FD1FF]/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#4FD1FF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1FF] animate-pulse" />
              Private Beta
            </div>
            <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-[1.05] text-white md:text-6xl lg:text-7xl">
              One AI teammate.<br />
              <span className="klade-gradient-text">Many specialists behind the scenes.</span>
            </h1>
            <p className="mt-5 max-w-3xl text-lg text-[#b3bedf] md:text-xl">
              Clay is your moldable AI operator — one interface backed by many specialized agents.
              Models, decks, research, workflows, and more. Shaped around how your team actually works.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#lead-form" eventName="hero_cta_click" eventPayload={{ placement: "hero", cta: "join_beta" }}>
                Join Private Beta
              </Button>
              <Button href="#meet-clay" variant="secondary" eventName="hero_cta_click" eventPayload={{ placement: "hero", cta: "meet_clay" }}>
                Meet Clay ↓
              </Button>
            </div>

            {/* Capability chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["Models & Valuations", "Research & Memos", "Presentations", "Workflow Automation", "Operations", "Custom Tasks"].map((chip) => (
                <span key={chip} className="rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs text-[#9aa4cb]">
                  {chip}
                </span>
              ))}
            </div>
          </FadeIn>

          {/* Hero video + Clay workspace preview */}
          <FadeIn delay={0.1} className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
            <div id="meet-clay" className="scroll-mt-28">
              <HeroVideo />
            </div>
            <div className="space-y-3">
              <div className="klade-gradient-border rounded-2xl bg-[#080c1a] p-4 text-sm text-[#d8def5]">
                <div className="flex items-center gap-2">
                  <Image src="/brand/clay-avatar.jpg" alt="Clay" width={24} height={24} className="rounded-full" />
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#9aa4cb]">Clay workspace</p>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="ml-auto max-w-lg rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90">
                    Build a DCF model for NVIDIA and flag key growth drivers.
                  </p>
                  <p className="max-w-xl rounded-xl border border-[#4FD1FF]/20 bg-[#4FD1FF]/8 px-3 py-2 text-[#d8def5]">
                    ✓ DCF complete with cited assumptions, risk table, and deck-ready summary.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Research", detail: "Company deep-dive" },
                  { label: "Memo", detail: "Investment thesis" },
                  { label: "Deck", detail: "8-slide summary" },
                ].map((card) => (
                  <div key={card.label} className="surface-glass rounded-xl px-3 py-2.5 text-center">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#9aa4cb]">{card.label}</p>
                    <p className="mt-0.5 text-xs text-[#d8def5]">{card.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* ===== TRUST TICKER ===== */}
      <Section className="py-2">
        <div className="rounded-2xl border border-white/6 bg-white/3 p-3">
          <div className="ticker-row">
            <div className="ticker-track">
              {[...trustTickerItems, ...trustTickerItems].map((item, i) => (
                <span key={`${item}-${i}`} className="ticker-pill">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ===== HOW CLAY WORKS — ORCHESTRATION ===== */}
      <Section id="how-it-works" className="pt-4">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">How Clay works</p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-5xl">
            One interface. Many agents behind it.
          </h2>
          <p className="mt-3 max-w-3xl text-[#9aa4cb]">
            Clay receives your request, routes it to the right specialist sub-agent, and delivers structured output — all through a single, seamless experience.
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {orchestrationSteps.map((step, i) => (
            <FadeIn key={step.label} delay={i * 0.06}>
              <div className="surface-card rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#4FD1FF]/25 bg-[#4FD1FF]/10 text-sm font-semibold text-[#4FD1FF]">
                  {i + 1}
                </div>
                <p className="mt-3 text-sm font-medium text-white">{step.label}</p>
                <p className="mt-1.5 text-xs text-[#9aa4cb]">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ===== CAPABILITIES ===== */}
      <Section id="capabilities" className="pt-6">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">Capabilities</p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-5xl">
            One bot. Many specialists.
          </h2>
          <p className="mt-3 max-w-3xl text-[#9aa4cb]">
            Clay orchestrates specialized agents across every function your team needs. Not a single-purpose tool — a moldable system that adapts to your workflows.
          </p>
        </FadeIn>
        <StaggerContainer className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap) => (
            <StaggerItem key={cap.title}>
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
                className="surface-card rounded-2xl p-5 transition-all duration-300"
              >
                <span className="text-2xl">{cap.icon}</span>
                <p className="mt-2 text-sm font-medium text-white">{cap.title}</p>
                <p className="mt-1.5 text-xs text-[#9aa4cb]">{cap.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      {/* ===== USE CASES ===== */}
      <Section className="pt-6">
        <FadeIn>
          <div className="rounded-3xl border border-white/8 bg-white/3 p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">Use cases</p>
            <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
              Klade molds to the company. Not the other way around.
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-[#9aa4cb]">
              One system, many specialists — shaped around the way your business actually operates.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {useCases.map((uc) => (
                <div key={uc.title} className="rounded-xl border border-white/8 bg-white/4 p-4 transition-colors hover:border-white/12">
                  <p className="text-sm font-medium text-white">{uc.title}</p>
                  <p className="mt-1.5 text-xs text-[#9aa4cb]">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ===== ROI ===== */}
      <Section id="roi-estimator" className="pt-6 scroll-mt-28">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">ROI</p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-5xl">
            Why teams switch to Klade.
          </h2>
          <p className="mt-3 max-w-3xl text-[#9aa4cb]">
            Replace repetitive analytical headcount with adaptable AI support that scales across functions.
          </p>
        </FadeIn>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {/* Before / After */}
          <FadeIn className="rounded-2xl border border-white/8 bg-white/3 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#9aa4cb]">Without Klade</p>
            <ul className="mt-3 space-y-2 text-sm text-[#b3bedf]">
              <li className="flex items-start gap-2"><span className="mt-0.5 text-red-400">✕</span> Hours spent on repetitive models and reports</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-red-400">✕</span> Bandwidth ceiling from finite headcount</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-red-400">✕</span> Inconsistent deliverable quality</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-red-400">✕</span> One tool per function, constant switching</li>
            </ul>
          </FadeIn>
          <FadeIn delay={0.05} className="rounded-2xl border border-[#4FD1FF]/20 bg-[#4FD1FF]/5 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#4FD1FF]">With Klade</p>
            <ul className="mt-3 space-y-2 text-sm text-[#d8def5]">
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#4FD1FF]">✓</span> Deliverables in minutes, not days</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#4FD1FF]">✓</span> Scales across functions without new hires</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#4FD1FF]">✓</span> Structured, cited, format-compliant every time</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#4FD1FF]">✓</span> One AI teammate handles it all</li>
            </ul>
          </FadeIn>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {roiCards.map((card) => (
            <FadeIn key={card.title} className="surface-card rounded-xl p-4">
              <p className="text-sm font-medium text-white">{card.title}</p>
              <p className="mt-1.5 text-xs text-[#9aa4cb]">{card.desc}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ===== METRICS ===== */}
      <Section className="py-3">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <FadeIn key={metric.label} className="rounded-2xl border border-white/8 bg-white/4 p-5 text-center">
              <CountUp value={metric.value} suffix={metric.suffix} className="text-4xl font-semibold text-white" />
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#9aa4cb]">{metric.label}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ===== COMPARISON ===== */}
      <Section className="pt-4">
        <FadeIn>
          <div className="rounded-3xl border border-white/8 bg-white/3 p-6 md:p-8">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Traditional headcount vs Clay.</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#9aa4cb]">Traditional hire</p>
                <ul className="mt-3 space-y-2 text-sm text-[#b3bedf]">
                  <li>• ~$150,000+ annual compensation</li>
                  <li>• Limited working hours</li>
                  <li>• One person&apos;s bandwidth ceiling</li>
                  <li>• Manual workflow switching</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-[#4FD1FF]/25 bg-gradient-to-br from-[#3C5BFF]/12 to-[#7A5CFF]/12 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#4FD1FF]">Clay — your AI teammate</p>
                <ul className="mt-3 space-y-2 text-sm text-[#d8def5]">
                  <li>• Dramatically lower cost-per-output</li>
                  <li>• 24/7 execution coverage</li>
                  <li>• Parallel workflows, no burnout</li>
                  <li>• One interface for every function</li>
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ===== SECURITY ===== */}
      <Section id="security" className="pt-4">
        <FadeIn>
          <div className="rounded-3xl border border-white/8 bg-white/3 p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">Security</p>
            <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Built for teams that care about control.</h2>
            <p className="mt-3 max-w-3xl text-sm text-[#9aa4cb]">Secure-by-design architecture, workflow-scoped access, and visibility-first deployment posture from day one.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                "Least-privilege integration model",
                "No client-side secrets",
                "Audit-log ready event patterns",
                "Founder-led deployment accountability",
              ].map((item) => (
                <p key={item} className="rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[#d8def5]">{item}</p>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ===== FOUNDERS ===== */}
      <Section id="founders" className="pt-6">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">Founding team</p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-5xl">Built by operators, not outsiders.</h2>
          <p className="mt-3 max-w-3xl text-[#9aa4cb]">
            Three founders operating inside the workflows we&apos;re automating. Founder-led through every step of onboarding and deployment.
          </p>
        </FadeIn>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {founders.map((f, i) => (
            <FadeIn key={f.name} delay={i * 0.05}>
              <div className="group rounded-2xl border border-white/8 bg-white/4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#4FD1FF]/25">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/8">
                  <Image
                    src={f.image}
                    alt={`${f.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-[#9aa4cb]">{f.role}</p>
                <h3 className="mt-1 text-xl font-semibold text-white">{f.name}</h3>
                <p className="mt-2 text-sm text-[#b3bedf]">{f.focus}</p>
                <Link href={`mailto:${f.email}`} className="mt-3 inline-block text-sm text-[#4FD1FF] transition-colors hover:text-white">
                  {f.email} →
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ===== CTA BANNER ===== */}
      <Section className="py-3">
        <FadeIn>
          <div className="rounded-3xl border border-[#4FD1FF]/15 bg-gradient-to-r from-[#0a0f2c] via-[#10162f] to-[#0a0f2c] p-8 text-center">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Ready to meet your AI teammate?</h2>
            <p className="mt-3 text-[#b3bedf]">Private beta. Founder-led onboarding. Fast response.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="#lead-form" eventName="cta_click" eventPayload={{ placement: "banner", cta: "join_beta" }}>
                Join Private Beta
              </Button>
              <Button href="mailto:arjun@kladeai.com" variant="secondary" eventName="cta_click" eventPayload={{ placement: "banner", cta: "email_founder" }}>
                Email a Founder
              </Button>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ===== LEAD FORM ===== */}
      <Section id="lead-form" className="scroll-mt-28 pt-4">
        <FadeIn>
          <div className="rounded-3xl border border-white/8 bg-white/4 p-6 md:p-8">
            <h2 className="text-3xl font-semibold text-white">Tell us about your team.</h2>
            <p className="mt-2 text-sm text-[#9aa4cb]">Share your bottleneck and we&apos;ll return a practical rollout plan.</p>

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit} aria-busy={status === "submitting"}>
              <fieldset className="contents" disabled={status === "submitting"}>
                <label className="hidden" aria-hidden="true">
                  Website
                  <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} />
                </label>
                <input type="hidden" name="startedAt" value={form.startedAt} readOnly />

                {[
                  { key: "name" as const, label: "Name", type: "text" },
                  { key: "company" as const, label: "Company", type: "text" },
                  { key: "email" as const, label: "Work Email", type: "email" },
                ].map((field) => (
                  <label key={field.key} className="grid gap-2 text-sm text-[#b3bedf]">
                    {field.label}
                    <input
                      required
                      type={field.type}
                      value={form[field.key]}
                      onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition-colors focus:border-[#4FD1FF]/50 placeholder:text-[#5a6a8a]"
                    />
                  </label>
                ))}

                <label className="grid gap-2 text-sm text-[#b3bedf]">
                  Team Size
                  <select
                    required
                    value={form.teamSize}
                    onChange={(e) => setForm((p) => ({ ...p, teamSize: e.target.value }))}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition-colors focus:border-[#4FD1FF]/50"
                  >
                    <option value="">Select</option>
                    <option value="1-5">1-5</option>
                    <option value="6-15">6-15</option>
                    <option value="16-40">16-40</option>
                    <option value="41-100">41-100</option>
                    <option value="100+">100+</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm text-[#b3bedf] md:col-span-2">
                  Role
                  <input
                    required
                    value={form.role}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition-colors focus:border-[#4FD1FF]/50"
                  />
                </label>

                <label className="grid gap-2 text-sm text-[#b3bedf] md:col-span-2">
                  What does your team need help with?
                  <textarea
                    required
                    rows={4}
                    value={form.bottleneck}
                    onChange={(e) => setForm((p) => ({ ...p, bottleneck: e.target.value }))}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition-colors focus:border-[#4FD1FF]/50"
                  />
                </label>

                <div className="md:col-span-2">
                  <div className="rounded-xl border border-white/8 bg-white/3 p-3">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#9aa4cb]">
                      <span>Form completion</span>
                      <span>{completion}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#4FD1FF] via-[#3C5BFF] to-[#7A5CFF]"
                        initial={{ width: 0 }}
                        animate={{ width: `${completion}%` }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={status === "submitting" || completion < 100}
                    className="cta-glow inline-flex items-center justify-center rounded-xl border border-[#4FD1FF]/30 bg-gradient-to-r from-[#4FD1FF] via-[#3C5BFF] to-[#7A5CFF] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === "submitting" ? "Submitting..." : "Submit request"}
                  </button>
                </div>

                <div className="md:col-span-2" role="status" aria-live="polite">
                  {status === "success" && <p className="text-sm text-emerald-400">Request submitted. A founder will follow up within 24 hours.</p>}
                  {status === "error" && <p className="text-sm text-rose-400">Something failed. Please email arjun@kladeai.com directly.</p>}
                </div>
              </fieldset>
            </form>

            {/* Founder contact strip */}
            <div className="mt-6 flex flex-wrap gap-4 border-t border-white/8 pt-4">
              {founders.map((f) => (
                <Link key={f.name} href={`mailto:${f.email}`} className="text-sm text-[#9aa4cb] transition-colors hover:text-[#4FD1FF]">
                  {f.email}
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>
    </SiteShell>
  );
}
