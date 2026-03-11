"use client";

import { CountUp, FadeIn, MarqueeStrip, ProgressBar, SpotlightCard, StaggerContainer, StaggerItem, TypingText } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

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

type RoiInputs = {
  analysts: number;
  repetitiveHoursPerWeek: number;
  blendedHourlyCost: number;
};

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

const requiredFormKeys: Array<keyof Pick<LeadForm, "name" | "company" | "email" | "teamSize" | "role" | "bottleneck">> = [
  "name",
  "company",
  "email",
  "teamSize",
  "role",
  "bottleneck",
];

const metrics = ["24/7 analysis", "Minutes to deliverables", "Fraction of analyst cost", "Built for finance teams"];
const pilotCapacity = { cohort: "Spring Cohort", slotsLeft: 7 };

const metricTiles = [
  { value: 24, suffix: "/7", label: "Analyst availability" },
  { value: 6, suffix: "x", label: "Faster first-draft output" },
  { value: 70, suffix: "%", label: "Lower repetitive analyst load" },
  { value: 48, suffix: "h", label: "Pilot activation target" },
];

const pilotMomentumTape = [
  "⚡ Founder reply target: <24h",
  "📄 Security packet shipped in kickoff week",
  "🧠 Evidence-cited deliverables by default",
  "🔐 Workflow-scoped permissions",
  "📈 Partner-ready memo quality in minutes",
  "🧪 Private beta with high-touch onboarding",
];

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
    specialties: ["Market structure", "Research workflows"],
    image: "/founders/adam.jpg",
    fallbackImage: "/founders/adam.svg",
  },
  {
    name: "Arjun Rath",
    role: "Co-Founder",
    blurb: "Builds the product and infrastructure stack that turns analyst workflows into reliable systems.",
    specialties: ["Product systems", "Infrastructure"],
    image: "/founders/arjun.jpg",
    fallbackImage: "/founders/arjun.svg",
  },
  {
    name: "Gavin Kim",
    role: "Co-Founder",
    blurb: "Leads quantitative systems design to keep outputs structured, defensible, and useful in live decisions.",
    specialties: ["Quant systems", "Decision support"],
    image: "/founders/gavin.jpg",
    fallbackImage: "/founders/gavin.svg",
  },
];

const trustSnapshotMetrics = [
  { label: "Founder response", value: "<24h" },
  { label: "Pilot security packet", value: "Week 1" },
  { label: "Workflow launch target", value: "48h" },
];

const founderPulse = [
  { name: "Adam Benoit", image: "/founders/adam.jpg", fallbackImage: "/founders/adam.svg" },
  { name: "Arjun Rath", image: "/founders/arjun.jpg", fallbackImage: "/founders/arjun.svg" },
  { name: "Gavin Kim", image: "/founders/gavin.jpg", fallbackImage: "/founders/gavin.svg" },
];

const faqs = [
  {
    question: "How quickly can we see value from Klade?",
    answer:
      "Most teams see usable output in the first week. We start with one workflow, map the data boundary, and deploy an analyst with a clear success metric.",
  },
  {
    question: "How do you handle confidentiality and security review?",
    answer:
      "Every pilot starts with a scoped access review, no client-side secrets, and least-privilege permissions. We deliver a security packet your reviewer can evaluate quickly.",
  },
  {
    question: "Do we need to replace our current tooling?",
    answer:
      "No. Klade is designed to layer into existing systems (Slack, Teams, internal dashboards) and produce outputs your team already consumes.",
  },
  {
    question: "What happens after the pilot?",
    answer:
      "We scale the workflows that convert into team throughput, lock in reliability targets, and expand analyst coverage where cost-per-output is strongest.",
  },
];

const credibilityStrip = ["Founder-led onboarding", "Security packet on first call", "Workflow-scoped permissions", "Private beta cohort"];

const trustArtifacts = [
  "Data-flow + permission model included in week-one packet",
  "Environment isolation with workflow-scoped integrations",
  "Founder-reviewed rollout checklist before production handoff",
  "SOC 2 readiness roadmap shared during pilot planning",
];

const trustBadges = ["TLS 1.3 transport", "Scoped access control", "Audit-log ready", "DPA + security review packet"];

const securityAssurancePoints = [
  "Least-privilege role model for every integration",
  "PII-safe prompt boundaries and data minimization defaults",
  "Environment isolation for pilot and production workflows",
  "Weekly founder-reviewed security checkpoint during onboarding",
];

const securityControlMatrix = [
  {
    control: "Access model",
    implementation: "Role-scoped permissions per workflow integration",
    status: "Implemented",
  },
  {
    control: "Data handling",
    implementation: "No client-side secrets + minimized payload boundaries",
    status: "Implemented",
  },
  {
    control: "Audit posture",
    implementation: "Audit-log ready event model in deployment packet",
    status: "In packet",
  },
  {
    control: "Incident response",
    implementation: "Founder escalation channel with same-day response commitment",
    status: "Operational",
  },
];

const trustResponseCommitments = [
  "Same-day founder response for security reviewer questions",
  "Architecture and data-flow diagram delivered before pilot launch",
  "Rollback + access revocation plan included in kickoff artifacts",
];

const launchReadiness = [
  { label: "Workflow onboarding completion", value: 92 },
  { label: "Security packet completeness", value: 96 },
  { label: "Partner-ready deliverable quality", value: 94 },
];

const onboardingFlow = [
  "Submit your workflow details",
  "Founder-led teardown call (20 min)",
  "Security + architecture packet delivered",
  "Pilot launch scope and 30-day KPI baseline",
];

const conversionAssurance = [
  "Reply SLA: under 24 hours from founder team",
  "No long contracts during pilot validation",
  "Clear KPI target before any rollout decision",
];

const idealForTeams = [
  "Investment teams handling high-volume filings, transcripts, and memo cycles",
  "Groups that need partner-ready output in hours, not days",
  "Operators who want founder-level implementation support during rollout",
];

const notIdealForTeams = [
  "Teams expecting a fully self-serve product with zero implementation collaboration",
  "Workflows that require open internet data sharing without permission boundaries",
  "Organizations without a clear owner for pilot KPI measurement",
];

const trustCenterHighlights = [
  { label: "Security review kickoff", detail: "Architecture + data-boundary packet delivered in week one." },
  { label: "Operational controls", detail: "Scoped permissions, least-privilege model, and audit-log ready posture." },
  { label: "Founder accountability", detail: "Direct founder channel during pilot with implementation ownership." },
];

const preSubmissionTrustChecks = [
  "Workflow + data-boundary review included before pilot launch",
  "Security packet + architecture map delivered in kickoff week",
  "Founder-owned rollout with direct technical accountability",
];

const roiDefaultInputs: RoiInputs = {
  analysts: 6,
  repetitiveHoursPerWeek: 10,
  blendedHourlyCost: 135,
};

const repetitiveLoadReduction = 0.7;

const pilotOutcomes = [
  {
    title: "Faster partner prep",
    detail: "Compress pre-meeting research into a same-hour cycle with cited outputs.",
  },
  {
    title: "Coverage without headcount shock",
    detail: "Run parallel workflows across sectors and live updates without analyst burnout.",
  },
  {
    title: "Trust-first deployment",
    detail: "Ship with architecture clarity, permission boundaries, and founder visibility from day one.",
  },
];

const logoSignals = ["Private Equity", "Hedge Funds", "RIA Teams", "Family Offices", "VC / Growth", "Corporate Strategy"];

const testimonialCards = [
  {
    quote:
      "Klade turned a 5-hour earnings prep cycle into something we can brief in under an hour, with citation confidence still intact.",
    person: "Pilot user · Mid-market investment team",
  },
  {
    quote:
      "The difference wasn't just speed — it was consistency. Every partner got the same high-signal memo quality, every time.",
    person: "Pilot user · Multi-strategy research desk",
  },
];

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Klade",
  url: "https://kladeai.com",
  description: "AI analysts for financial intelligence teams.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "beta@kladeai.com",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

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
  const [form, setForm] = useState<LeadForm>(() => createInitialForm());
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [founderImages, setFounderImages] = useState<Record<string, string>>(() =>
    Object.fromEntries(founderCards.map((founder) => [founder.name, founder.image]))
  );
  const [roiInputs, setRoiInputs] = useState<RoiInputs>(roiDefaultInputs);
  const [dismissedMobileStickyCta, setDismissedMobileStickyCta] = useState(false);
  const [showMobileStickyCta, setShowMobileStickyCta] = useState(true);
  const [hasTrackedFormComplete, setHasTrackedFormComplete] = useState(false);
  const leadFormObserverRef = useRef<IntersectionObserver | null>(null);
  const reduceMotion = useReducedMotion();
  const isSubmitting = status === "submitting";
  const completedFields = requiredFormKeys.filter((key) => form[key].trim().length > 0).length;
  const completionPercent = Math.round((completedFields / requiredFormKeys.length) * 100);
  const annualHoursRecovered = Math.round(
    roiInputs.analysts * roiInputs.repetitiveHoursPerWeek * 52 * repetitiveLoadReduction
  );
  const annualCostRecovered = annualHoursRecovered * roiInputs.blendedHourlyCost;
  const quarterlyCostRecovered = Math.round(annualCostRecovered / 4);

  useEffect(() => {
    if (dismissedMobileStickyCta) return;

    const media = window.matchMedia("(max-width: 767px)");
    if (!media.matches) {
      setShowMobileStickyCta(false);
      return;
    }

    const leadFormSection = document.getElementById("lead-form");
    if (!leadFormSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMobileStickyCta(!entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    leadFormObserverRef.current = observer;
    observer.observe(leadFormSection);

    return () => {
      observer.disconnect();
      leadFormObserverRef.current = null;
    };
  }, [dismissedMobileStickyCta]);

  useEffect(() => {
    trackEvent("landing_view", { source: "homepage" });
  }, []);

  useEffect(() => {
    if (completionPercent === 100 && !hasTrackedFormComplete) {
      trackEvent("form_completion_reached");
      setHasTrackedFormComplete(true);
    } else if (completionPercent < 100 && hasTrackedFormComplete) {
      setHasTrackedFormComplete(false);
    }
  }, [completionPercent, hasTrackedFormComplete]);

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
      setForm(createInitialForm());
      trackEvent("form_submit");
      trackEvent("qualified_lead", { source: "homepage" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      <Section className="pt-20 md:pt-28">
        <div className="hero-shell premium-sheen relative overflow-hidden rounded-3xl px-6 py-14 md:px-12 md:py-18">
          <motion.div
            className="pointer-events-none absolute -left-20 -top-16 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl"
            animate={reduceMotion ? { opacity: 0.75 } : { x: [0, 28, 0], y: [0, 18, 0] }}
            transition={reduceMotion ? { duration: 0 } : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-violet-500/25 blur-3xl"
            animate={reduceMotion ? { opacity: 0.75 } : { x: [0, -28, 0], y: [0, -16, 0] }}
            transition={reduceMotion ? { duration: 0 } : { duration: 14, repeat: Infinity, ease: "easeInOut" }}
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
            <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-100">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              {pilotCapacity.cohort}: {pilotCapacity.slotsLeft} onboarding slots left
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#lead-form" eventName="hero_cta_click" eventPayload={{ placement: "hero", cta: "request_early_access" }}>
                Request Early Access
              </Button>
              <Button
                href="#lead-form"
                variant="secondary"
                eventName="hero_cta_click"
                eventPayload={{ placement: "hero", cta: "book_teardown" }}
              >
                Book a 20-min workflow teardown
              </Button>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {conversionAssurance.map((item) => (
                <p key={item} className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                  {item}
                </p>
              ))}
            </div>
            <div className="mt-6 grid gap-3 lg:grid-cols-[1.25fr_1fr]">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/75 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Founder-led trust loop</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {founderPulse.map((founder) => (
                      <div key={founder.name} className="relative h-9 w-9 overflow-hidden rounded-full border border-zinc-800">
                        <Image
                          src={founderImages[founder.name] ?? founder.image}
                          alt={`${founder.name} profile photo`}
                          fill
                          sizes="36px"
                          className="object-cover"
                          onError={() =>
                            setFounderImages((prev) =>
                              prev[founder.name] === founder.fallbackImage ? prev : { ...prev, [founder.name]: founder.fallbackImage }
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-300">Founders stay in the deployment and security review loop from day one.</p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {trustSnapshotMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-zinc-800 bg-zinc-950/75 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">{metric.label}</p>
                    <p className="mt-1 text-sm font-semibold text-zinc-100">{metric.value}</p>
                  </div>
                ))}
              </div>
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
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {metricTiles.map((tile) => (
            <FadeIn key={tile.label} className="rounded-2xl border border-zinc-900 bg-zinc-950/65 p-4 text-center">
              <CountUp value={tile.value} suffix={tile.suffix} className="text-3xl font-semibold text-white" />
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-zinc-400">{tile.label}</p>
            </FadeIn>
          ))}
        </div>
        <div className="mt-3 grid gap-3 rounded-2xl border border-zinc-900 bg-zinc-950/55 p-4 md:grid-cols-4">
          {metrics.map((item) => (
            <p key={item} className="text-center text-xs uppercase tracking-[0.14em] text-zinc-400">{item}</p>
          ))}
        </div>
      </Section>

      <Section className="pt-0 pb-7 md:pb-8">
        <FadeIn>
          <div className="rounded-2xl border border-indigo-300/20 bg-gradient-to-r from-zinc-950 via-indigo-950/20 to-zinc-950 px-3 py-3 md:px-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-indigo-200">Pilot momentum</p>
              <p className="text-xs text-zinc-400">Conversion intent + trust cues in one strip</p>
            </div>
            <MarqueeStrip items={pilotMomentumTape} />
          </div>
        </FadeIn>
      </Section>

      <Section className="py-6 md:py-8">
        <FadeIn>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
            <p className="text-center text-xs uppercase tracking-[0.2em] text-zinc-500">Built for finance teams that cannot afford output drag</p>
            <div className="mt-4 grid gap-2 md:grid-cols-4">
              {credibilityStrip.map((item) => (
                <div key={item} className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-center text-sm text-zinc-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="pt-1 pb-6 md:pb-8">
        <FadeIn>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 md:p-5">
            <p className="text-center text-[11px] uppercase tracking-[0.2em] text-zinc-500">Designed for teams across</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {logoSignals.map((item) => (
                <div key={item} className="rounded-full border border-zinc-800 bg-zinc-900/75 px-3 py-1.5 text-xs text-zinc-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="pt-4 md:pt-8">
        <FadeIn>
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/5 p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Trust-ready from day one</p>
              <Button
                href="#security"
                variant="secondary"
                eventName="proof_cta_click"
                eventPayload={{ placement: "trust_strip", cta: "review_security_posture" }}
              >
                Review security posture
              </Button>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {trustSignals.map((signal) => (
                <p key={signal} className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-200">{signal}</p>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="py-8">
        <FadeIn>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Security packet artifacts</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {trustArtifacts.map((item) => (
                <div key={item} className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="pt-0 pb-8 md:pb-10">
        <FadeIn>
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/5 p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Enterprise assurance checklist</p>
              <p className="text-xs text-zinc-400">Security review artifacts available before pilot launch.</p>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {securityAssurancePoints.map((item) => (
                <p key={item} className="rounded-lg border border-zinc-800 bg-zinc-900/75 px-3 py-2 text-sm text-zinc-200">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="pt-2 pb-8 md:pb-10">
        <FadeIn>
          <div className="rounded-2xl border border-indigo-300/20 bg-gradient-to-r from-zinc-950 via-indigo-950/20 to-zinc-950 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.18em] text-indigo-200">Launch readiness snapshot</p>
              <p className="text-sm text-zinc-300">Premium pilot quality, founder-reviewed.</p>
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
              <div className="space-y-4">
                {launchReadiness.map((item) => (
                  <ProgressBar key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Trust badges</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {trustBadges.map((badge) => (
                    <span key={badge} className="rounded-full border border-zinc-700 bg-zinc-950/80 px-3 py-1 text-xs text-zinc-200">
                      {badge}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-zinc-300">Security + architecture packet is shared in the first founder call so technical reviewers can evaluate deployment risk immediately.</p>
              </div>
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

      <Section className="pt-6 md:pt-10">
        <FadeIn>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/85 p-6 md:p-8">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Who this pilot is for (and not for)</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-300/25 bg-emerald-500/10 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-100">Best fit</p>
                <ul className="mt-3 space-y-2 text-sm text-zinc-100">
                  {idealForTeams.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-zinc-700 bg-zinc-900/85 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Not a fit yet</p>
                <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                  {notIdealForTeams.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>
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
              animate={reduceMotion ? { opacity: 0.7 } : { y: [0, 12, 0], x: [0, -8, 0] }}
              transition={reduceMotion ? { duration: 0 } : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
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

      <Section className="py-6">
        <FadeIn>
          <div className="rounded-2xl border border-indigo-300/20 bg-indigo-500/5 p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-indigo-200">Pilot feedback snapshots</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {testimonialCards.map((item) => (
                <blockquote key={item.quote} className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-zinc-200">
                  <p>“{item.quote}”</p>
                  <footer className="mt-3 text-xs uppercase tracking-[0.12em] text-zinc-500">{item.person}</footer>
                </blockquote>
              ))}
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
              <Button
                href="#lead-form"
                eventName="proof_cta_click"
                eventPayload={{ placement: "consultation_block", cta: "schedule_consultation" }}
              >
                Schedule a consultation
              </Button>
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
              <Button href="/pricing" eventName="proof_cta_click" eventPayload={{ placement: "pricing_preview", cta: "view_pricing" }}>
                View full pricing
              </Button>
              <Button
                href="#lead-form"
                variant="secondary"
                eventName="proof_cta_click"
                eventPayload={{ placement: "pricing_preview", cta: "discuss_enterprise" }}
              >
                Discuss enterprise options
              </Button>
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
              <Button href="#lead-form" eventName="proof_cta_click" eventPayload={{ placement: "beta_banner", cta: "request_early_access" }}>
                Request Early Access
              </Button>
              <Button
                href="mailto:beta@kladeai.com"
                variant="secondary"
                eventName="proof_cta_click"
                eventPayload={{ placement: "beta_banner", cta: "email_beta" }}
              >
                beta@kladeai.com
              </Button>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="py-10">
        <FadeIn>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/85 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white md:text-3xl">What happens after you submit</h2>
              <p className="text-sm text-zinc-400">Fast founder-led loop, no black-box handoff.</p>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {onboardingFlow.map((step, index) => (
                <div key={step} className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Step {index + 1}</p>
                  <p className="mt-2 text-sm text-zinc-100">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="pt-2 md:pt-4">
        <FadeIn>
          <div className="rounded-2xl border border-indigo-300/20 bg-gradient-to-r from-zinc-950 via-indigo-950/20 to-zinc-950 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white md:text-3xl">What teams buy from this pilot</h2>
              <Button
                href="#lead-form"
                variant="secondary"
                eventName="proof_cta_click"
                eventPayload={{ placement: "pilot_outcomes", cta: "see_if_workflow_fits" }}
              >
                See if your workflow fits
              </Button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {pilotOutcomes.map((item) => (
                <div key={item.title} className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm text-zinc-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section id="roi-estimator" className="pt-4 pb-8 md:pb-10 scroll-mt-28">
        <FadeIn>
          <div className="rounded-2xl border border-indigo-300/20 bg-gradient-to-r from-zinc-950 via-indigo-950/20 to-zinc-950 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white md:text-3xl">Pilot ROI estimator</h2>
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Conversion preview built for finance leaders</p>
            </div>
            <p className="mt-3 max-w-3xl text-sm text-zinc-300">
              Fast model for repetitive analyst load. Adjust your assumptions and use this in the first founder teardown.
            </p>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
              <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/75 p-4">
                <label className="grid gap-2 text-sm text-zinc-300">
                  Analysts on repetitive workflow: <span className="font-semibold text-white">{roiInputs.analysts}</span>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={roiInputs.analysts}
                    onChange={(event) => setRoiInputs((prev) => ({ ...prev, analysts: Number(event.target.value) }))}
                    className="accent-indigo-300"
                  />
                </label>
                <label className="grid gap-2 text-sm text-zinc-300">
                  Repetitive research hours per analyst / week: <span className="font-semibold text-white">{roiInputs.repetitiveHoursPerWeek}h</span>
                  <input
                    type="range"
                    min={2}
                    max={25}
                    value={roiInputs.repetitiveHoursPerWeek}
                    onChange={(event) =>
                      setRoiInputs((prev) => ({ ...prev, repetitiveHoursPerWeek: Number(event.target.value) }))
                    }
                    className="accent-indigo-300"
                  />
                </label>
                <label className="grid gap-2 text-sm text-zinc-300">
                  Blended hourly analyst cost (USD): <span className="font-semibold text-white">${roiInputs.blendedHourlyCost}</span>
                  <input
                    type="range"
                    min={60}
                    max={300}
                    step={5}
                    value={roiInputs.blendedHourlyCost}
                    onChange={(event) =>
                      setRoiInputs((prev) => ({ ...prev, blendedHourlyCost: Number(event.target.value) }))
                    }
                    className="accent-indigo-300"
                  />
                </label>
                <p className="text-xs text-zinc-500">Assumes {Math.round(repetitiveLoadReduction * 100)}% repetitive-load reduction from pilot workflows.</p>
              </div>

              <div className="rounded-xl border border-indigo-300/25 bg-indigo-500/10 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-indigo-100">Estimated impact</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/75 px-3 py-2">
                    <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">Annual analyst hours recovered</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{annualHoursRecovered.toLocaleString()}h</p>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/75 px-3 py-2">
                    <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">Quarterly cost-equivalent impact</p>
                    <p className="mt-1 text-2xl font-semibold text-white">${quarterlyCostRecovered.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/75 px-3 py-2">
                    <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">Annual cost-equivalent impact</p>
                    <p className="mt-1 text-2xl font-semibold text-white">${annualCostRecovered.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    href="#lead-form"
                    eventName="proof_cta_click"
                    eventPayload={{ placement: "roi_estimator", cta: "book_custom_roi_teardown" }}
                  >
                    Book a custom ROI teardown
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="pt-0 pb-8 md:pb-10">
        <FadeIn>
          <div className="rounded-2xl border border-emerald-300/25 bg-gradient-to-r from-zinc-950 via-emerald-950/20 to-zinc-950 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white md:text-3xl">Trust center snapshot before kickoff</h2>
              <Button
                href="#lead-form"
                variant="secondary"
                eventName="proof_cta_click"
                eventPayload={{ placement: "trust_center", cta: "request_security_packet" }}
              >
                Request security packet
              </Button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {trustCenterHighlights.map((item) => (
                <div key={item.label} className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">{item.label}</p>
                  <p className="mt-2 text-sm text-zinc-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="pt-0 pb-8 md:pb-10">
        <FadeIn>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white md:text-3xl">Security controls finance teams ask us about</h2>
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Preview-ready trust layer</p>
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-[1.35fr_1fr]">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                <div className="hidden grid-cols-[1fr_1.4fr_auto] gap-3 border-b border-zinc-800 pb-2 text-[10px] uppercase tracking-[0.14em] text-zinc-500 md:grid">
                  <span>Control</span>
                  <span>Implementation</span>
                  <span className="text-right">Status</span>
                </div>
                <div className="mt-2 space-y-2">
                  {securityControlMatrix.map((item) => (
                    <div key={item.control} className="grid gap-2 rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-3 md:grid-cols-[1fr_1.4fr_auto] md:items-center">
                      <p className="text-sm font-medium text-zinc-100">{item.control}</p>
                      <p className="text-sm text-zinc-300">{item.implementation}</p>
                      <span className="inline-flex w-fit rounded-full border border-emerald-300/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-emerald-200 md:justify-self-end">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-indigo-300/25 bg-indigo-500/10 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-indigo-100">Founder response commitments</p>
                <div className="mt-3 space-y-2">
                  {trustResponseCommitments.map((item) => (
                    <p key={item} className="rounded-lg border border-zinc-800 bg-zinc-950/75 px-3 py-2 text-sm text-zinc-200">
                      {item}
                    </p>
                  ))}
                </div>
                <Button
                  href="#lead-form"
                  className="mt-4"
                  eventName="proof_cta_click"
                  eventPayload={{ placement: "security_controls", cta: "book_security_teardown" }}
                >
                  Book security teardown
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section id="lead-form" className="scroll-mt-28">
        <FadeIn>
          <div className="premium-sheen rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-3xl font-semibold text-white">Tell us about your team.</h2>
            <p className="mt-2 text-zinc-400">You’ll leave with a concrete automation plan, even if we don’t work together.</p>

            <div className="mt-5 grid gap-2 rounded-xl border border-indigo-300/20 bg-indigo-500/10 p-3 text-xs text-zinc-200 md:grid-cols-3">
              <p className="rounded-md border border-zinc-700 bg-zinc-950/75 px-2 py-1.5">⏱ 20-min founder teardown call</p>
              <p className="rounded-md border border-zinc-700 bg-zinc-950/75 px-2 py-1.5">🔐 Security packet in kickoff week</p>
              <p className="rounded-md border border-zinc-700 bg-zinc-950/75 px-2 py-1.5">📊 KPI baseline before pilot launch</p>
            </div>

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit} onFocus={() => trackEvent("form_start")} aria-busy={isSubmitting}>
              <fieldset disabled={isSubmitting} className="contents">
              <label className="hidden" aria-hidden="true">
                Company Website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
                />
              </label>
              <input type="hidden" name="startedAt" value={form.startedAt} readOnly />
              <label className="grid gap-2 text-sm text-zinc-300">
                Name
                <input
                  required
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-400"
                />
              </label>
              <label className="grid gap-2 text-sm text-zinc-300">
                Company
                <input
                  required
                  name="company"
                  autoComplete="organization"
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
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-400"
                />
              </label>
              <label className="grid gap-2 text-sm text-zinc-300">
                Team Size
                <select
                  required
                  name="teamSize"
                  value={form.teamSize}
                  onChange={(event) => setForm((prev) => ({ ...prev, teamSize: event.target.value }))}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-400"
                >
                  <option value="">Select team size</option>
                  <option value="1-5">1-5</option>
                  <option value="6-15">6-15</option>
                  <option value="16-40">16-40</option>
                  <option value="41-100">41-100</option>
                  <option value="100+">100+</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm text-zinc-300 md:col-span-2">
                Role
                <input
                  required
                  name="role"
                  autoComplete="organization-title"
                  value={form.role}
                  placeholder="e.g. Partner, Principal, Research Lead"
                  onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-indigo-400"
                />
              </label>
              <label className="grid gap-2 text-sm text-zinc-300 md:col-span-2">
                What does your team need help with?
                <textarea
                  required
                  name="bottleneck"
                  rows={4}
                  value={form.bottleneck}
                  placeholder="Example: earnings prep takes 6+ analyst hours and memo quality varies by sector coverage"
                  onChange={(event) => setForm((prev) => ({ ...prev, bottleneck: event.target.value }))}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-indigo-400"
                />
              </label>
              <div className="md:col-span-2">
                <div className="mb-3 rounded-xl border border-indigo-300/20 bg-indigo-500/10 p-3">
                  <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-indigo-100">
                    <span>Request completeness</span>
                    <span>{completedFields}/{requiredFormKeys.length} fields</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-900/80">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-300 via-indigo-200 to-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercent}%` }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="mb-4 grid gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 text-xs text-zinc-300 md:grid-cols-3">
                  <p className="rounded-md border border-zinc-700 bg-zinc-950/70 px-2 py-1.5">✅ 20-min founder teardown</p>
                  <p className="rounded-md border border-zinc-700 bg-zinc-950/70 px-2 py-1.5">✅ Security + architecture packet</p>
                  <p className="rounded-md border border-zinc-700 bg-zinc-950/70 px-2 py-1.5">✅ Pilot scope + KPI baseline</p>
                </div>

                <div className="mb-4 rounded-xl border border-emerald-300/20 bg-emerald-500/5 p-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-emerald-100">Security review fast-lane</p>
                  <div className="mt-2 grid gap-2 text-xs text-zinc-200 md:grid-cols-3">
                    {preSubmissionTrustChecks.map((item) => (
                      <p key={item} className="rounded-md border border-zinc-700 bg-zinc-950/70 px-2 py-1.5">
                        🔐 {item}
                      </p>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl border border-indigo-300/20 bg-gradient-to-r from-white to-indigo-100 px-5 py-3 text-sm font-semibold text-black shadow-[0_0_24px_rgba(99,102,241,0.35)] transition-all duration-300 hover:scale-[1.03] disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : completionPercent < 100 ? `Complete ${requiredFormKeys.length - completedFields} more field${requiredFormKeys.length - completedFields === 1 ? "" : "s"}` : "Submit Request"}
                </button>
                <div className="mt-3 min-h-5" role="status" aria-live="polite">
                  {status === "success" && <p className="text-sm text-emerald-300">Request submitted. We’ll follow up shortly.</p>}
                  {status === "error" && <p className="text-sm text-rose-300">Something broke. Please email beta@kladeai.com.</p>}
                </div>
                <p className="text-xs text-zinc-500">No spam. Founder-led responses only.</p>
                <p className="mt-1 text-xs text-emerald-300/80">🔒 Submitted over TLS. Intake is rate-limited and reviewed only by founders.</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Link href="mailto:beta@kladeai.com?subject=Security%20Packet%20Request%20-%20Klade" className="rounded-md border border-zinc-700 bg-zinc-900/80 px-2.5 py-1.5 text-zinc-300 hover:text-white">
                    Request security packet by email
                  </Link>
                  <Link href="#security" className="rounded-md border border-zinc-700 bg-zinc-900/80 px-2.5 py-1.5 text-zinc-300 hover:text-white">
                    Review trust posture first
                  </Link>
                </div>
              </div>
              </fieldset>
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
              <Button
                href="/sample-workflow"
                eventName="sample_workflow_click"
                eventPayload={{ placement: "not_ready_block", cta: "see_sample_workflow" }}
              >
                See sample workflow
              </Button>
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
              <Button
                href="#lead-form"
                variant="secondary"
                eventName="proof_cta_click"
                eventPayload={{ placement: "security_section", cta: "get_security_packet" }}
              >
                Get security review packet
              </Button>
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
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/85 p-8">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Frequently asked before kickoff</h2>
            <div className="mt-5 space-y-3">
              {faqs.map((item) => (
                <details key={item.question} className="group rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                  <summary className="cursor-pointer list-none text-base font-medium text-zinc-100">
                    {item.question}
                    <span className="ml-2 text-indigo-300 transition group-open:rotate-45 inline-block">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-zinc-300">{item.answer}</p>
                </details>
              ))}
            </div>
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
                <Image
                  src={founderImages[founder.name] ?? founder.image}
                  alt={`${founder.name} profile photo`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover saturate-[0.95] transition-all duration-500 group-hover:scale-[1.03] group-hover:saturate-110"
                  onError={() =>
                    setFounderImages((prev) =>
                      prev[founder.name] === founder.fallbackImage ? prev : { ...prev, [founder.name]: founder.fallbackImage }
                    )
                  }
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 rounded-full border border-emerald-300/30 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-emerald-200">
                  Founder available &lt;24h
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-400">{founder.role}</p>
              <p className="text-xl font-semibold text-white">{founder.name}</p>
              <p className="mt-2 text-sm text-zinc-300">{founder.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {founder.specialties.map((specialty) => (
                  <span key={specialty} className="rounded-full border border-zinc-700 bg-zinc-900/80 px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-zinc-300">
                    {specialty}
                  </span>
                ))}
              </div>
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
              <Button href="#lead-form" eventName="proof_cta_click" eventPayload={{ placement: "final_cta", cta: "request_early_access" }}>
                Request Early Access
              </Button>
              <Button
                href="#lead-form"
                variant="secondary"
                eventName="proof_cta_click"
                eventPayload={{ placement: "final_cta", cta: "request_demo" }}
              >
                Request Demo
              </Button>
            </div>
          </div>
        </FadeIn>
      </Section>

      <div className="fixed bottom-5 right-5 z-40 hidden max-w-sm md:block">
        <div className="rounded-2xl border border-indigo-300/25 bg-black/80 p-3 shadow-[0_18px_50px_-24px_rgba(99,102,241,0.8)] backdrop-blur-xl">
          <p className="mb-1 text-xs uppercase tracking-[0.14em] text-zinc-400">Private beta · founder onboarding</p>
          <p className="mb-2 text-[11px] text-emerald-200">{pilotCapacity.slotsLeft} cohort slots currently open</p>
          <Link
            href="#lead-form"
            onClick={() => trackEvent("hero_cta_click", { placement: "desktop_sticky", cta: "book_workflow_teardown" })}
            className="cta-glow block rounded-xl bg-gradient-to-r from-white to-indigo-100 px-4 py-3 text-center text-sm font-semibold text-black"
          >
            Book a 20-min workflow teardown
          </Link>
        </div>
      </div>

      {!dismissedMobileStickyCta && showMobileStickyCta && (
        <div className="fixed inset-x-0 bottom-3 z-40 px-4 md:hidden">
          <div className="rounded-2xl border border-indigo-300/30 bg-black/80 p-2 shadow-[0_18px_50px_-24px_rgba(99,102,241,0.8)] backdrop-blur-xl">
            <div className="mb-1 flex items-center justify-between gap-2 px-1">
              <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Founder reply &lt;24h · security packet available</p>
              <button
                type="button"
                onClick={() => setDismissedMobileStickyCta(true)}
                aria-label="Dismiss mobile call to action"
                className="rounded-md border border-zinc-700 bg-zinc-900/80 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-zinc-300"
              >
                Dismiss
              </button>
            </div>
            <Link
              href="#lead-form"
              onClick={() => trackEvent("hero_cta_click", { placement: "mobile_sticky", cta: "request_early_access" })}
              className="cta-glow block rounded-xl bg-gradient-to-r from-white to-indigo-100 px-4 py-3 text-center text-sm font-semibold text-black"
            >
              Request Early Access — 20 min workflow teardown
            </Link>
          </div>
        </div>
      )}
    </SiteShell>
  );
}
