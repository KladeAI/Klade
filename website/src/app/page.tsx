"use client";

import { CountUp, FadeIn, SpotlightCard, StaggerContainer, StaggerItem } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";
import { motion } from "framer-motion";

const capabilities = [
  "Executive inbox + Slack triage",
  "Meeting orchestration + follow-ups",
  "Market and account intelligence",
  "Memo + deck draft generation",
  "Pipeline and task operating cadence",
  "Automated cross-tool workflows",
];

const socialProof = [
  ["68%", "Reduction in operating overhead"],
  ["3.1x", "Faster prep-to-decision cycles"],
  ["99.9%", "Workflow task completion reliability"],
];

const trustStrip = ["VC-backed teams", "RevOps leaders", "Founder offices", "Portfolio operators", "Growth-stage SaaS"];

export default function HomePage() {
  return (
    <SiteShell>
      <Section className="pt-18 md:pt-28">
        {/* V1.2 hero system: animated gradient + premium glass frame */}
        <div className="hero-shell relative overflow-hidden rounded-3xl px-6 py-14 md:px-12 md:py-18">
          <motion.div
            className="pointer-events-none absolute -left-24 -top-14 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, 24, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -right-16 -bottom-20 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"
            animate={{ x: [0, -32, 0], y: [0, -20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />

          <FadeIn>
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-300">
              Founding cohort now open
            </p>
            <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-white md:text-7xl lg:text-8xl leading-[0.98]">
              <span className="bg-gradient-to-r from-white via-blue-200 to-violet-200 bg-clip-text text-transparent">AI employees</span> for
              high-output teams.
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-zinc-300 md:text-xl">
              Klade deploys reliable AI operators into your workflows—communication, planning, research, and execution—so your team ships faster without scaling headcount.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="mailto:beta@kladeai.com">Request Early Access</Button>
              <Button href="mailto:beta@kladeai.com?subject=Request%20Demo" variant="secondary">Book Demo</Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-indigo-300/20 bg-[#080a13]/85 p-5 shadow-[0_0_60px_-34px_rgba(129,140,248,0.7)]">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Live workspace simulation</p>
              <div className="mt-3 space-y-3 text-sm">
                <p className="ml-auto max-w-md rounded-2xl bg-zinc-800/80 px-4 py-3 text-zinc-100">Prepare tomorrow's board update and sync investor follow-ups.</p>
                <p className="max-w-xl rounded-2xl border border-indigo-300/20 bg-zinc-900/80 px-4 py-4 text-zinc-200">Done. Board narrative drafted, KPI changes summarized, and follow-ups assigned with deadlines across Slack + calendar.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">SLA snapshot</p>
              <p className="mt-3 text-4xl font-semibold text-white">&lt;60s</p>
              <p className="text-sm text-zinc-400">response on priority requests</p>
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section className="py-8">
        <div className="grid gap-3 rounded-2xl border border-zinc-900 bg-zinc-950/55 p-4 md:grid-cols-5">
          {trustStrip.map((item) => (
            <p key={item} className="text-center text-xs uppercase tracking-[0.14em] text-zinc-400">{item}</p>
          ))}
        </div>
      </Section>

      <Section id="proof" className="pt-10">
        {/* V1.2 social proof: premium metrics + testimonial emphasis */}
        <FadeIn>
          <h2 className="text-4xl font-semibold text-white md:text-6xl">Trusted by teams that execute at founder speed.</h2>
        </FadeIn>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {socialProof.map(([value, label]) => (
            <FadeIn key={String(value)} className="rounded-2xl border border-zinc-800 bg-zinc-950/75 p-6">
              <p className="text-4xl font-semibold text-white">{value}</p>
              <p className="mt-2 text-sm text-zinc-400">{label}</p>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.1} className="mt-5 rounded-2xl border border-indigo-300/20 bg-gradient-to-r from-zinc-900 via-indigo-950/30 to-zinc-950 p-6">
          <p className="text-zinc-200 md:text-lg">“Klade feels like adding a world-class operator overnight. We execute more, miss less, and move with confidence.”</p>
          <p className="mt-2 text-sm text-zinc-400">— Chief of Staff, growth-stage SaaS company</p>
        </FadeIn>
      </Section>

      <Section id="capabilities">
        <FadeIn>
          <h2 className="mb-6 text-4xl font-semibold text-white md:text-5xl">Core capabilities</h2>
        </FadeIn>
        <StaggerContainer className="grid gap-4 md:grid-cols-3">
          {capabilities.map((feature) => (
            <StaggerItem key={feature}>
              <SpotlightCard className="text-zinc-200">{feature}</SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            [10, "x", "Output potential"],
            [24, "/7", "Availability"],
            [5, "m", "To deliverables"],
            [70, "%", "Lower cost per task"],
          ].map(([a, suffix, b]) => (
            <FadeIn key={String(b)} className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-5 text-center transition-transform duration-300 hover:-translate-y-1">
              <CountUp value={Number(a)} suffix={String(suffix)} className="text-4xl font-semibold text-white" />
              <p className="mt-1 text-zinc-400">{b}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        {/* V1.2 CTA: high-contrast conversion block */}
        <FadeIn>
          <div className="rounded-2xl border border-indigo-300/25 bg-gradient-to-r from-zinc-900 via-indigo-950/35 to-zinc-950 p-8 text-center">
            <h2 className="text-4xl font-semibold text-white md:text-5xl">Deploy your first AI employee this month.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-300">Founding clients receive white-glove setup and direct product collaboration with the Klade team.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button href="mailto:beta@kladeai.com">Request Early Access</Button>
              <Button href="mailto:beta@kladeai.com?subject=Request%20Demo" variant="secondary">Request Demo</Button>
            </div>
          </div>
        </FadeIn>
      </Section>
    </SiteShell>
  );
}
