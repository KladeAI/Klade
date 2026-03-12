"use client";

import { CountUp, FadeIn, ProgressBar, SpotlightCard, StaggerContainer, StaggerItem } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

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
  name: "",
  company: "",
  email: "",
  teamSize: "",
  role: "",
  bottleneck: "",
  website: "",
  startedAt: String(Date.now()),
});

const trustTickerOne = [
  "24/7 analysis",
  "Earnings call summaries",
  "Sector screening",
  "Memo drafting",
  "PowerPoint-ready output",
  "Works in Slack + Teams",
  "Built for financial intelligence",
];

const trustTickerTwo = [
  "Evidence-cited responses",
  "Workflow-scoped permissions",
  "Enterprise deployment posture",
  "Founder-led onboarding",
  "Fast pilot activation",
  "Control + visibility by default",
];

const pains = [
  "Filings and transcripts consume hours of senior analyst time.",
  "CIM reviews and memo drafting create repeatable manual load.",
  "Sector screens and updates are rebuilt from scratch every week.",
  "Deliverables arrive late when teams are overloaded.",
];

const capabilities = [
  "AI document analysis",
  "Earnings call summaries",
  "Sector screening",
  "Investment memo generation",
  "PowerPoint-ready output",
  "Chat-based analyst workflows",
  "Custom analyst deployment",
  "Workflow-specific automation",
];

const integrations = ["Slack", "Microsoft Teams", "Internal Chat", "Research Portals", "CRM/Deal Systems", "Knowledge Bases"];

const premiumSignals = [
  {
    title: "Clarity in 5–10 seconds",
    body: "Headline + product proof communicate what Klade is, who it’s for, and what action to take immediately.",
  },
  {
    title: "Motion with purpose",
    body: "Ambient motion, line reveals, and microinteractions guide attention without distracting from trust and readability.",
  },
  {
    title: "Conversion without friction",
    body: "Persistent Join Beta paths, strong social proof language, and low-friction lead capture keep momentum high.",
  },
];

const metrics = [
  { value: 24, suffix: "/7", label: "analysis coverage" },
  { value: 10, suffix: "x", label: "output expansion" },
  { value: 70, suffix: "%", label: "less repetitive load" },
  { value: 15, suffix: "min", label: "to first draft" },
];

const heroCards = [
  { title: "Live filing ingest", body: "10-Q + call transcript parsed with cited deltas.", rotate: -4 },
  { title: "Memo draft", body: "Investment memo + risk table generated in minutes.", rotate: 3 },
  { title: "Deck preview", body: "PowerPoint-ready summary with key growth drivers.", rotate: -2 },
];

const requiredFields: Array<keyof Pick<LeadForm, "name" | "company" | "email" | "teamSize" | "role" | "bottleneck">> = [
  "name",
  "company",
  "email",
  "teamSize",
  "role",
  "bottleneck",
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

function IntroReveal() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(!reduceMotion);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setTimeout(() => setVisible(false), 1300);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0A0F2C]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.9, duration: 0.35, ease: "easeOut" }}
    >
      <div className="relative flex flex-col items-center gap-6">
        <motion.div
          className="absolute h-52 w-52 rounded-full bg-[#4FD1FF]/35 blur-3xl"
          initial={{ scale: 0.65, opacity: 0.2 }}
          animate={{ scale: 1.05, opacity: 0.7 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <svg width="220" height="78" viewBox="0 0 220 78" className="relative z-10">
          <path className="line-draw" d="M8 58C42 24 72 16 116 24C153 31 180 47 212 22" stroke="#4FD1FF" strokeWidth="2" fill="none" />
        </svg>
        <motion.div
          className="relative z-10 flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.35 }}
        >
          <Image src="/brand/klade-logo-draft.jpg" alt="Klade" width={28} height={28} className="rounded-full" />
          <span className="tracking-[0.22em] text-xs uppercase">Klade</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function DemoPanel() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-3 rounded-2xl border border-[#2c3a66]/20 bg-[#0A0F2C]/95 p-5">
        <div className="h-4 w-32 animate-pulse rounded bg-white/20" />
        <div className="h-20 animate-pulse rounded-xl bg-white/10" />
        <div className="grid gap-2 md:grid-cols-2">
          <div className="h-24 animate-pulse rounded-xl bg-white/10" />
          <div className="h-24 animate-pulse rounded-xl bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="space-y-3 rounded-2xl border border-[#2c3a66]/20 bg-[#0A0F2C]/95 p-5 text-[#d8def5]"
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#9aa4cb]">Live proof</p>
      <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
        <span className="text-[#9aa4cb]">Prompt:</span> Summarize NVIDIA’s latest earnings call and highlight the main growth drivers.
      </p>
      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
        <p className="font-medium text-white">Structured response</p>
        <ul className="mt-2 space-y-1 text-[#d8def5]">
          <li>• Data center demand remained the primary growth engine.</li>
          <li>• Gross margin outlook tightened due to mix and supply timing.</li>
          <li>• Management highlighted enterprise AI pipeline acceleration.</li>
        </ul>
      </div>
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-[#4FD1FF]/35 bg-[#4FD1FF]/10 p-3 text-sm">
        Citations attached: 8-K transcript + Q filing references
      </motion.div>
      <div className="grid gap-2 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
          Memo preview loaded
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
          Deck preview rendered
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<LeadForm>(() => createInitialForm());
  const [status, setStatus] = useState<SubmissionStatus>("idle");

  const completedFields = useMemo(
    () => requiredFields.filter((key) => form[key].trim().length > 0).length,
    [form]
  );
  const completion = Math.round((completedFields / requiredFields.length) * 100);

  useEffect(() => {
    trackEvent("landing_view", { source: "homepage_v2_1" });
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("form_submit_attempt", { source: "homepage_v2_1" });
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
      trackEvent("qualified_lead", { source: "homepage_v2_1" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <SiteShell>
      <IntroReveal />

      <Section className="pt-20 md:pt-28">
        <div className="hero-shell premium-sheen relative overflow-hidden rounded-3xl px-6 py-14 md:px-12 md:py-16">
          <div className="hero-grid pointer-events-none absolute inset-0 opacity-45" />
          <motion.div
            className="pointer-events-none absolute -left-16 -top-12 h-64 w-64 rounded-full bg-[#4FD1FF]/30 blur-3xl"
            animate={reduceMotion ? { opacity: 0.65 } : { x: [0, 26, 0], y: [0, 18, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -right-24 -bottom-16 h-80 w-80 rounded-full bg-[#7A5CFF]/35 blur-3xl"
            animate={reduceMotion ? { opacity: 0.65 } : { x: [0, -24, 0], y: [0, -14, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />

          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#d9e2ff]">
              <span className="relative h-5 w-5 overflow-hidden rounded-full border border-white/30">
                <Image src="/brand/klade-logo-draft.jpg" alt="Klade" fill sizes="20px" className="object-cover" />
              </span>
              Private beta · finance teams only
            </div>
            <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.96] text-white md:text-7xl lg:text-8xl">
              Scale your analyst team without scaling headcount.
            </h1>
            <p className="mt-5 max-w-3xl text-lg text-[#d8def5] md:text-xl">
              Klade builds AI analysts that review filings, summarize earnings calls, screen sectors, draft investment memos,
              and generate partner-ready deliverables in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#lead-form" eventName="hero_cta_click" eventPayload={{ placement: "hero", cta: "join_beta" }}>
                Join Beta
              </Button>
              <Button
                href="#lead-form"
                variant="secondary"
                eventName="hero_cta_click"
                eventPayload={{ placement: "hero", cta: "book_demo" }}
              >
                Book Demo
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="klade-gradient-border rounded-2xl bg-[#0A0F2C] p-4 text-sm text-[#d8def5]">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#9aa4cb]">Clay workspace</p>
              <div className="mt-3 space-y-2">
                <p className="ml-auto max-w-lg rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-white">
                  Summarize NVIDIA’s latest earnings call and flag growth drivers + downside risks.
                </p>
                <p className="max-w-xl rounded-xl border border-[#4FD1FF]/30 bg-[#4FD1FF]/10 px-3 py-2">
                  Completed with citations, risk table, and a deck-ready summary card.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {heroCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  className="surface-glass rounded-xl px-4 py-3 text-[#dbe3ff]"
                  animate={
                    reduceMotion
                      ? { opacity: 1 }
                      : { y: [0, -4, 0], rotate: [card.rotate, card.rotate + 0.6, card.rotate], x: [0, index % 2 ? 2 : -2, 0] }
                  }
                  transition={{ duration: 7 + index, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-[#9aa4cb]">{card.title}</p>
                  <p className="mt-1 text-sm">{card.body}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section className="py-8">
        <div className="space-y-2 rounded-2xl border border-[#1f2b53]/10 bg-white/75 p-4">
          <div className="ticker-row">
            <div className="ticker-track">
              {[...trustTickerOne, ...trustTickerOne].map((item, index) => (
                <span key={`${item}-${index}`} className="ticker-pill">{item}</span>
              ))}
            </div>
          </div>
          <div className="ticker-row">
            <div className="ticker-track reverse">
              {[...trustTickerTwo, ...trustTickerTwo].map((item, index) => (
                <span key={`${item}-${index}`} className="ticker-pill">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-8">
        <FadeIn>
          <div className="rounded-3xl border border-[#1f2b53]/12 bg-white p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#5A6175]">Premium website signals</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#10162F] md:text-4xl">Built like premium AI infrastructure, not a generic template.</h2>
            <p className="mt-3 max-w-3xl text-sm text-[#4B5578]">
              We optimize first impression, motion clarity, and conversion flow so users understand value quickly and act.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {premiumSignals.map((signal) => (
                <motion.div
                  key={signal.title}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  className="rounded-xl border border-[#1f2b53]/12 bg-[#f4f7ff] p-4"
                >
                  <p className="text-sm font-semibold text-[#10162F]">{signal.title}</p>
                  <p className="mt-2 text-xs text-[#4B5578]">{signal.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="pt-8">
        <FadeIn>
          <h2 className="text-4xl font-semibold text-[#10162F] md:text-6xl">Where finance teams lose time</h2>
          <p className="mt-3 max-w-3xl text-[#4B5578]">Scroll through the workflow drag points. Klade removes this repeatable load while keeping analyst-grade quality and control.</p>
        </FadeIn>
        <div className="mt-8 grid gap-4 md:grid-cols-[160px_1fr]">
          <div className="relative hidden md:block">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#3C5BFF]/20 via-[#7A5CFF]/40 to-transparent" />
            <motion.div
              className="absolute left-1/2 top-0 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-[#4FD1FF] to-[#3C5BFF]"
              initial={{ y: 0 }}
              whileInView={{ y: 320 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
          </div>
          <StaggerContainer className="grid gap-4">
            {pains.map((pain) => (
              <StaggerItem key={pain}>
                <SpotlightCard className="surface-light text-[#10162F]">
                  <p className="text-sm font-medium">{pain}</p>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      <Section className="pt-6 md:pt-10">
        <FadeIn>
          <div className="rounded-3xl border border-[#1f2b53]/12 bg-[#10162F] p-6 md:p-8">
            <h2 className="text-3xl font-semibold text-white md:text-5xl">Traditional analyst vs Klade AI analyst</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-white/12 bg-white/5 p-5 text-[#d8def5]">
                <p className="text-xs uppercase tracking-[0.16em] text-[#9aa4cb]">Traditional analyst</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>• ~$150,000+ annual compensation</li>
                  <li>• Limited working hours</li>
                  <li>• Manual workflow switching</li>
                  <li>• One person’s bandwidth ceiling</li>
                </ul>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-[#4FD1FF]/35 bg-gradient-to-br from-[#3C5BFF]/24 to-[#7A5CFF]/24 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.16em] text-[#d8def5]">Klade AI analyst</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>• Dramatically lower cost-per-output</li>
                  <li>• 24/7 execution coverage</li>
                  <li>• Structured deliverables in minutes</li>
                  <li>• Parallel workflows without burnout</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section id="capabilities" className="pt-10">
        <FadeIn>
          <h2 className="text-4xl font-semibold text-[#10162F] md:text-5xl">Product capabilities</h2>
        </FadeIn>
        <StaggerContainer className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability) => (
            <StaggerItem key={capability}>
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
                className="surface-light rounded-2xl p-5 transition-shadow hover:shadow-[0_20px_45px_-28px_rgba(60,91,255,0.5)]"
              >
                <div className="mb-3 h-8 w-8 rounded-lg bg-gradient-to-br from-[#4FD1FF] to-[#7A5CFF]" />
                <p className="text-sm font-medium text-[#10162F]">{capability}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="text-4xl font-semibold text-[#10162F] md:text-5xl">Product proof</h2>
        </FadeIn>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
          <DemoPanel />
          <FadeIn className="rounded-2xl border border-[#1f2b53]/12 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#5a6175]">Outputs synchronized</p>
            <div className="mt-3 space-y-2">
              <p className="rounded-xl border border-[#1f2b53]/12 bg-[#f2f6ff] px-3 py-2 text-sm text-[#22305a]">Research memo · version 1.4</p>
              <p className="rounded-xl border border-[#1f2b53]/12 bg-[#f2f6ff] px-3 py-2 text-sm text-[#22305a]">IC deck draft · 8 slides</p>
              <p className="rounded-xl border border-[#1f2b53]/12 bg-[#f2f6ff] px-3 py-2 text-sm text-[#22305a]">Risk appendix · cited sources</p>
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section id="how-it-works">
        <FadeIn>
          <h2 className="text-4xl font-semibold text-[#10162F] md:text-5xl">How it works</h2>
        </FadeIn>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            "Klade creates your AI analyst",
            "We map your workflow and permission boundaries",
            "Your team assigns work in chat or platform",
            "Clay returns structured research + deliverables",
          ].map((step, index) => (
            <FadeIn key={step} className="surface-light rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-[#5A6175]">Step {index + 1}</p>
              <p className="mt-2 text-sm font-medium text-[#10162F]">{step}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <FadeIn>
          <div className="rounded-3xl border border-[#1f2b53]/12 bg-white p-6 md:p-8">
            <h2 className="text-3xl font-semibold text-[#10162F] md:text-4xl">Works where your team works</h2>
            <p className="mt-3 max-w-3xl text-sm text-[#4B5578]">Not just logo rows. Inputs route into Klade, outputs route back into the systems your team already runs on.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration}
                  className="rounded-xl border border-[#1f2b53]/12 bg-[#f3f7ff] px-4 py-3 text-sm text-[#22305a]"
                  animate={reduceMotion ? undefined : { y: [0, index % 2 ? -3 : 3, 0] }}
                  transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
                >
                  {integration}
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section id="security" className="pt-4">
        <FadeIn>
          <div className="rounded-3xl border border-[#1f2b53]/12 bg-[#F8FAFF] p-6 md:p-8">
            <h2 className="text-3xl font-semibold text-[#10162F] md:text-4xl">Built for teams that care about control.</h2>
            <p className="mt-3 max-w-3xl text-[#4B5578]">Secure-by-design architecture, workflow-scoped access, and visibility-first deployment posture from day one.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                "Least-privilege integration model",
                "No client-side secrets",
                "Audit-log ready event patterns",
                "Founder-led deployment accountability",
              ].map((item) => (
                <p key={item} className="rounded-xl border border-[#1f2b53]/12 bg-white px-4 py-3 text-sm text-[#22305a]">{item}</p>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <FadeIn key={metric.label} className="rounded-2xl border border-[#1f2b53]/12 bg-[#10162F] p-5 text-center text-white">
              <CountUp value={metric.value} suffix={metric.suffix} className="text-4xl font-semibold" />
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#b3bedf]">{metric.label}</p>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="mt-4 rounded-2xl border border-[#1f2b53]/12 bg-white p-5">
          <h3 className="text-lg font-semibold text-[#10162F]">Launch readiness</h3>
          <div className="mt-4 space-y-4">
            <ProgressBar label="Workflow onboarding" value={92} className="text-[#10162F]" />
            <ProgressBar label="Security packet completeness" value={96} className="text-[#10162F]" />
            <ProgressBar label="Deliverable quality" value={94} className="text-[#10162F]" />
          </div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div className="rounded-3xl border border-[#3C5BFF]/20 bg-gradient-to-r from-[#0A0F2C] via-[#10162F] to-[#0A0F2C] p-8 text-white">
            <h2 className="text-3xl font-semibold md:text-5xl">Be among the first teams using AI analysts.</h2>
            <p className="mt-3 max-w-3xl text-[#cad4f8]">Private beta. Limited onboarding. Founder collaboration. Fast response.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="#lead-form" eventName="proof_cta_click" eventPayload={{ placement: "beta_banner", cta: "join_beta" }}>
                Join Beta
              </Button>
              <Button
                href="#lead-form"
                variant="secondary"
                eventName="proof_cta_click"
                eventPayload={{ placement: "beta_banner", cta: "tell_us_about_team" }}
              >
                Tell us about your team
              </Button>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section id="lead-form" className="scroll-mt-28 pt-8">
        <FadeIn>
          <div className="rounded-3xl border border-[#1f2b53]/12 bg-white p-6 md:p-8">
            <h2 className="text-3xl font-semibold text-[#10162F]">Tell us about your team.</h2>
            <p className="mt-2 text-sm text-[#4B5578]">Share your bottleneck and we’ll return a practical rollout plan.</p>

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit} aria-busy={status === "submitting"}>
              <fieldset className="contents" disabled={status === "submitting"}>
                <label className="hidden" aria-hidden="true">
                  Company Website
                  <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))} />
                </label>
                <input type="hidden" name="startedAt" value={form.startedAt} readOnly />

                <label className="grid gap-2 text-sm text-[#22305a]">
                  Name
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="rounded-lg border border-[#1f2b53]/18 bg-[#f4f7ff] px-3 py-2 text-[#10162F] outline-none focus:border-[#3C5BFF]"
                  />
                </label>

                <label className="grid gap-2 text-sm text-[#22305a]">
                  Company
                  <input
                    required
                    value={form.company}
                    onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
                    className="rounded-lg border border-[#1f2b53]/18 bg-[#f4f7ff] px-3 py-2 text-[#10162F] outline-none focus:border-[#3C5BFF]"
                  />
                </label>

                <label className="grid gap-2 text-sm text-[#22305a]">
                  Work Email
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="rounded-lg border border-[#1f2b53]/18 bg-[#f4f7ff] px-3 py-2 text-[#10162F] outline-none focus:border-[#3C5BFF]"
                  />
                </label>

                <label className="grid gap-2 text-sm text-[#22305a]">
                  Team Size
                  <select
                    required
                    value={form.teamSize}
                    onChange={(event) => setForm((prev) => ({ ...prev, teamSize: event.target.value }))}
                    className="rounded-lg border border-[#1f2b53]/18 bg-[#f4f7ff] px-3 py-2 text-[#10162F] outline-none focus:border-[#3C5BFF]"
                  >
                    <option value="">Select team size</option>
                    <option value="1-5">1-5</option>
                    <option value="6-15">6-15</option>
                    <option value="16-40">16-40</option>
                    <option value="41-100">41-100</option>
                    <option value="100+">100+</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm text-[#22305a] md:col-span-2">
                  Role
                  <input
                    required
                    value={form.role}
                    onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                    className="rounded-lg border border-[#1f2b53]/18 bg-[#f4f7ff] px-3 py-2 text-[#10162F] outline-none focus:border-[#3C5BFF]"
                  />
                </label>

                <label className="grid gap-2 text-sm text-[#22305a] md:col-span-2">
                  What does your team need help with?
                  <textarea
                    required
                    rows={4}
                    value={form.bottleneck}
                    onChange={(event) => setForm((prev) => ({ ...prev, bottleneck: event.target.value }))}
                    className="rounded-lg border border-[#1f2b53]/18 bg-[#f4f7ff] px-3 py-2 text-[#10162F] outline-none focus:border-[#3C5BFF]"
                  />
                </label>

                <div className="md:col-span-2">
                  <div className="rounded-xl border border-[#1f2b53]/14 bg-[#f4f7ff] p-3">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#5A6175]">
                      <span>Form completion</span>
                      <span>{completion}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
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
                    className="cta-glow inline-flex items-center justify-center rounded-xl border border-[#3C5BFF]/35 bg-gradient-to-r from-[#4FD1FF] via-[#3C5BFF] to-[#7A5CFF] px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting" ? "Submitting..." : "Submit request"}
                  </button>
                  <Link href="mailto:beta@kladeai.com" className="inline-flex items-center rounded-xl border border-[#1f2b53]/20 px-4 py-3 text-sm text-[#22305a]">
                    beta@kladeai.com
                  </Link>
                </div>

                <div className="md:col-span-2" role="status" aria-live="polite">
                  {status === "success" && <p className="text-sm text-emerald-600">Request submitted. We’ll follow up shortly.</p>}
                  {status === "error" && <p className="text-sm text-rose-600">Something failed. Please email beta@kladeai.com.</p>}
                </div>
              </fieldset>
            </form>

            <div className="mt-6 grid gap-2 text-xs text-[#5A6175] md:grid-cols-3">
              <Link href="mailto:adam@kladeai.com" className="hover:text-[#10162F]">adam@kladeai.com</Link>
              <Link href="mailto:arjun@kladeai.com" className="hover:text-[#10162F]">arjun@kladeai.com</Link>
              <Link href="mailto:gavin@kladeai.com" className="hover:text-[#10162F]">gavin@kladeai.com</Link>
            </div>
          </div>
        </FadeIn>
      </Section>
    </SiteShell>
  );
}
