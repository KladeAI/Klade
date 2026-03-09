"use client";

import { CountUp, FadeIn, SpotlightCard, StaggerContainer, StaggerItem, TypingText } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";
import { motion } from "framer-motion";

const trustMetrics = [
  "24/7 analysis",
  "Minutes to deliverables",
  "Fraction of analyst cost",
  "Built for finance teams",
];

const features = [
  "AI Document Analysis",
  "Sector Screening",
  "Investment Thesis Generation",
  "Automated Deliverables",
  "Earnings Call Summaries",
  "Workflow Deployment",
];

const outputs = [
  "Company research summary",
  "Sector breakdown",
  "Earnings call summary",
  "PowerPoint preview",
  "Investment memo",
  "Analyst chat response",
];

export default function HomePage() {
  return (
    <SiteShell>
      <Section className="pt-16 md:pt-24">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/70 bg-zinc-950/50 px-6 py-14 md:px-12 md:py-18">
          <motion.div
            className="pointer-events-none absolute -left-28 top-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, -18, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />

          <FadeIn>
            <p className="mb-4 text-sm text-zinc-400">kladeai.com</p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
                AI analysts
              </span>{" "}
              for financial intelligence.
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-zinc-300 md:text-xl">
              Klade creates AI analysts that research companies, screen sectors, digest filings, and generate
              investment-grade deliverables in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="mailto:beta@kladeai.com">Request Early Access</Button>
              <Button href="mailto:beta@kladeai.com?subject=Request%20Demo" variant="secondary">Request Demo</Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-indigo-400/20 bg-[#090B14] p-5 shadow-[0_0_55px_-30px_rgba(129,140,248,0.65)]">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Live Analyst Chat</p>
              <div className="mt-4 space-y-4">
                <div className="ml-auto max-w-md rounded-2xl bg-zinc-800/80 px-4 py-3 text-sm text-zinc-100">
                  Summarize NVIDIA&apos;s latest earnings.
                </div>
                <div className="max-w-xl rounded-2xl border border-indigo-300/20 bg-zinc-900/80 px-4 py-4 text-sm text-zinc-200">
                  <TypingText
                    text={"Revenue beat +8.1% vs consensus • Data Center growth remains dominant • Gross margin expanded to 76.3%"}
                    className="leading-relaxed"
                  />
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-300">
                    <li>AI demand sustained; hyperscaler capex guidance unchanged.</li>
                    <li>Operating leverage improved despite networking mix volatility.</li>
                    <li>Near-term watch: China restrictions and Blackwell ramp timing.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <p className="text-sm text-zinc-400">Product Preview</p>
              <p className="mt-2 text-zinc-200">"Analyze NVIDIA Q4 earnings vs consensus and update valuation assumptions."</p>
              <p className="mt-3 text-sm text-zinc-400">Structured response: highlights, risk factors, peer context, and memo-ready conclusions.</p>
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section className="py-10">
        <div className="grid gap-3 rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4 md:grid-cols-4">
          {trustMetrics.map((item) => (
            <p key={item} className="text-center text-sm text-zinc-300">{item}</p>
          ))}
        </div>
      </Section>

      <div className="gradient-divider" />

      <Section>
        <FadeIn>
          <h2 className="text-4xl font-semibold text-white md:text-6xl">
            Your team is buried in <span className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">repetitive analyst work.</span>
          </h2>
          <p className="mt-5 max-w-4xl text-zinc-300">
            Reading filings, reviewing CIMs, summarizing earnings, screening sectors, building decks, and writing
            memos consume hours every week. Klade helps finance teams expand output without compromising quality.
          </p>
        </FadeIn>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          <FadeIn className="rounded-2xl border border-zinc-800 bg-zinc-900/65 p-7">
            <h3 className="text-2xl font-semibold text-zinc-100">Traditional Analyst</h3>
            <ul className="mt-4 space-y-2 text-zinc-300">
              <li>~$150K+ annual cost</li>
              <li>Limited working hours</li>
              <li>Manual workflows, slow turnaround</li>
              <li>Capacity bottlenecks as workload grows</li>
            </ul>
          </FadeIn>
          <FadeIn delay={0.08} className="rounded-2xl border border-indigo-400/35 bg-gradient-to-br from-indigo-950/35 to-purple-900/25 p-7 shadow-[0_0_55px_-30px_rgba(129,140,248,0.7)]">
            <h3 className="text-2xl font-semibold text-indigo-200">Klade AI Analyst</h3>
            <ul className="mt-4 space-y-2 text-zinc-200">
              <li>Dramatically lower cost per output</li>
              <li>Always on, 24/7</li>
              <li>Instant execution across workflows</li>
              <li>Scalable, consistent, structured deliverables</li>
            </ul>
          </FadeIn>
        </div>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="text-4xl font-semibold text-white md:text-5xl">Scale your analyst team without scaling headcount.</h2>
          <p className="mt-4 max-w-3xl text-zinc-300">Increase throughput, speed up turnaround, and maintain institutional quality as demand grows.</p>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn><h2 className="mb-6 text-4xl font-semibold text-white md:text-5xl">Core Capabilities</h2></FadeIn>
        <StaggerContainer className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <StaggerItem key={feature}>
              <SpotlightCard className="text-zinc-200">{feature}</SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      <Section>
        <FadeIn><h2 className="mb-6 text-4xl font-semibold text-white md:text-5xl">Product Outputs</h2></FadeIn>
        <StaggerContainer className="grid gap-4 md:grid-cols-3">
          <StaggerItem>
            <SpotlightCard>
              <p className="text-sm text-zinc-400">Company Research Summary</p>
              <p className="mt-3 text-sm text-zinc-200">NVIDIA: Data-center revenue acceleration sustained; operating leverage supports continued margin expansion.</p>
            </SpotlightCard>
          </StaggerItem>
          <StaggerItem>
            <SpotlightCard>
              <p className="text-sm text-zinc-400">Sector Analysis</p>
              <p className="mt-3 text-sm text-zinc-200">AI infra suppliers rerating higher on backlog visibility; memory ecosystem remains mixed with pricing dispersion.</p>
            </SpotlightCard>
          </StaggerItem>
          <StaggerItem>
            <SpotlightCard>
              <p className="text-sm text-zinc-400">Investment Memo</p>
              <p className="mt-3 text-sm text-zinc-200">Base case implies 14% upside with downside protected by robust free cash flow conversion and demand durability.</p>
            </SpotlightCard>
          </StaggerItem>
          {outputs.slice(3).map((item) => (
            <StaggerItem key={item}>
              <SpotlightCard className="text-zinc-300">{item}</SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="text-4xl font-semibold text-white md:text-5xl">Works where your team works.</h2>
          <p className="mt-4 text-zinc-300">Deploy into Slack, Microsoft Teams, and internal platforms.</p>
          <div className="mt-5 rounded-2xl border border-zinc-800 bg-[#090B14] p-5 text-sm text-zinc-300">
            <p className="text-zinc-500">Example Chat</p>
            <p className="mt-2">User: "Break down NVIDIA earnings and implications for AI infra suppliers."</p>
            <p className="mt-2">Klade: "Revenue beat +8.1% vs consensus, margin expansion led by data-center mix..."</p>
          </div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn><h2 className="mb-6 text-4xl font-semibold text-white md:text-5xl">How Klade Works</h2></FadeIn>
        <StaggerContainer className="grid gap-3 md:grid-cols-2">
          {[
            "Klade configures a financial AI analyst",
            "Connect to your workflow",
            "Your team assigns research tasks",
            "Structured outputs are delivered instantly",
          ].map((step, i) => (
            <StaggerItem key={step}>
              <SpotlightCard className="text-zinc-300">{i + 1}. {step}</SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="text-4xl font-semibold text-white md:text-5xl">AI analysts tailored to your workflow.</h2>
          <p className="mt-4 max-w-4xl text-zinc-300">Consultation → Workflow analysis → Custom design → Deployment → Iteration.</p>
          <p className="mt-3 text-zinc-400">Deal research • Sector intelligence • Investment memos • Reporting • Earnings monitors</p>
          <div className="mt-6"><Button href="mailto:beta@kladeai.com?subject=Consultation">Schedule a Consultation</Button></div>
        </FadeIn>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            [10, "x", "Output potential"],
            [24, "/7", "Availability"],
            [5, "m", "To deliverables"],
            [70, "%", "Lower cost per insight"],
          ].map(([a, suffix, b]) => (
            <FadeIn key={String(b)} className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-5 text-center transition-transform duration-300 hover:-translate-y-1">
              <CountUp value={Number(a)} suffix={String(suffix)} className="text-4xl font-semibold text-white" />
              <p className="mt-1 text-zinc-400">{b}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="text-4xl font-semibold text-white md:text-5xl">Pricing built for growing teams.</h2>
          <p className="mt-4 text-zinc-300">Usage-based credit packs, subscriptions, and enterprise deployments.</p>
          <div className="mt-6"><Button href="/pricing" variant="secondary">View Full Pricing</Button></div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="text-4xl font-semibold text-white md:text-5xl">Be among the first teams using AI analysts.</h2>
          <p className="mt-4 text-zinc-300">Private beta is high-touch and limited to select firms.</p>
          <div className="mt-6"><Button href="mailto:beta@kladeai.com">Request Early Access</Button></div>
        </FadeIn>
      </Section>

      <Section id="contact">
        <FadeIn>
          <h2 className="text-4xl font-semibold text-white md:text-5xl">Tell us about your team.</h2>
          <form className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              "Name",
              "Company",
              "Work Email",
              "Team Size",
            ].map((label) => (
              <input key={label} placeholder={label} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-100 outline-none transition-colors focus:border-indigo-400" />
            ))}
            <textarea placeholder="What does your team need help with?" className="md:col-span-2 min-h-32 rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-100 outline-none transition-colors focus:border-indigo-400" />
            <button type="submit" className="md:col-span-2 rounded-xl border border-indigo-300/30 bg-white px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(129,140,248,0.35)]">Submit Request</button>
          </form>
          <p className="mt-4 text-sm text-zinc-400">adam@kladeai.com • arjun@kladeai.com • gavin@kladeai.com</p>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div className="rounded-2xl border border-indigo-300/20 bg-gradient-to-r from-zinc-900 via-indigo-950/35 to-zinc-950 p-8 text-center">
            <h2 className="text-4xl font-semibold text-white md:text-5xl">Hire your first AI analyst.</h2>
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
