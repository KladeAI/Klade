import { FadeIn } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";

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
      <Section className="pt-20">
        <FadeIn>
          <p className="mb-4 text-sm text-zinc-400">kladeai.com</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
            AI analysts for financial intelligence.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-zinc-300">
            Klade creates AI analysts that research companies, screen sectors, digest filings, and generate
            investment-grade deliverables in minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="mailto:beta@kladeai.com">Request Early Access</Button>
            <Button href="mailto:beta@kladeai.com?subject=Request%20Demo" variant="secondary">Request Demo</Button>
          </div>
          <div className="mt-10 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">
            <p className="text-sm text-zinc-400">Product Preview</p>
            <p className="mt-2 text-zinc-200">"Analyze NVIDIA Q4 earnings vs consensus and update valuation assumptions."</p>
            <p className="mt-3 text-sm text-zinc-400">Structured response: highlights, risk factors, peer context, and memo-ready conclusions.</p>
          </div>
        </FadeIn>
      </Section>

      <Section className="py-8">
        <div className="grid gap-3 rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4 md:grid-cols-4">
          {trustMetrics.map((item) => (
            <p key={item} className="text-center text-sm text-zinc-300">{item}</p>
          ))}
        </div>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="text-3xl font-semibold text-white">Your team is buried in repetitive analyst work.</h2>
          <p className="mt-4 max-w-4xl text-zinc-300">
            Reading filings, reviewing CIMs, summarizing earnings, screening sectors, building decks, and writing
            memos consume hours every week. Klade helps finance teams expand output without compromising quality.
          </p>
        </FadeIn>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          <FadeIn className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-xl font-semibold">Traditional Analyst</h3>
            <ul className="mt-4 space-y-2 text-zinc-300">
              <li>~$150K+ annual cost</li>
              <li>Limited working hours</li>
              <li>Manual workflows, slow turnaround</li>
              <li>Capacity bottlenecks as workload grows</li>
            </ul>
          </FadeIn>
          <FadeIn delay={0.08} className="rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-6">
            <h3 className="text-xl font-semibold text-emerald-300">Klade AI Analyst</h3>
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
        <h2 className="text-3xl font-semibold text-white">Scale your analyst team without scaling headcount.</h2>
        <p className="mt-4 max-w-3xl text-zinc-300">Increase throughput, speed up turnaround, and maintain institutional quality as demand grows.</p>
      </Section>

      <Section>
        <h2 className="mb-6 text-3xl font-semibold text-white">Core Capabilities</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, idx) => (
            <FadeIn key={feature} delay={idx * 0.04} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-zinc-200">
              {feature}
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="mb-6 text-3xl font-semibold text-white">Product Outputs</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {outputs.map((item) => (
            <div key={item} className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-zinc-300">{item}</div>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-semibold text-white">Works where your team works.</h2>
        <p className="mt-4 text-zinc-300">Deploy into Slack, Microsoft Teams, and internal platforms.</p>
        <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-300">
          <p className="text-zinc-500">Example Chat</p>
          <p className="mt-2">User: "Break down NVIDIA earnings and implications for AI infra suppliers."</p>
          <p className="mt-2">Klade: "Revenue beat +8.1% vs consensus, margin expansion led by data-center mix..."</p>
        </div>
      </Section>

      <Section>
        <h2 className="mb-6 text-3xl font-semibold text-white">How Klade Works</h2>
        <ol className="grid gap-3 md:grid-cols-2">
          {[
            "Klade configures a financial AI analyst",
            "Connect to your workflow",
            "Your team assigns research tasks",
            "Structured outputs are delivered instantly",
          ].map((step, i) => (
            <li key={step} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-300">{i + 1}. {step}</li>
          ))}
        </ol>
      </Section>

      <Section>
        <h2 className="text-3xl font-semibold text-white">AI analysts tailored to your workflow.</h2>
        <p className="mt-4 max-w-4xl text-zinc-300">Consultation → Workflow analysis → Custom design → Deployment → Iteration.</p>
        <p className="mt-3 text-zinc-400">Deal research • Sector intelligence • Investment memos • Reporting • Earnings monitors</p>
        <div className="mt-6"><Button href="mailto:beta@kladeai.com?subject=Consultation">Schedule a Consultation</Button></div>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["10x", "Output potential"],
            ["24/7", "Availability"],
            ["Minutes", "To deliverables"],
            ["Lower", "Cost per insight"],
          ].map(([a, b]) => (
            <div key={a} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-center">
              <p className="text-3xl font-semibold text-white">{a}</p>
              <p className="mt-1 text-zinc-400">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-semibold text-white">Pricing built for growing teams.</h2>
        <p className="mt-4 text-zinc-300">Usage-based credit packs, subscriptions, and enterprise deployments.</p>
        <div className="mt-6"><Button href="/pricing" variant="secondary">View Full Pricing</Button></div>
      </Section>

      <Section>
        <h2 className="text-3xl font-semibold text-white">Be among the first teams using AI analysts.</h2>
        <p className="mt-4 text-zinc-300">Private beta is high-touch and limited to select firms.</p>
        <div className="mt-6"><Button href="mailto:beta@kladeai.com">Request Early Access</Button></div>
      </Section>

      <Section id="contact">
        <h2 className="text-3xl font-semibold text-white">Tell us about your team.</h2>
        <form className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            "Name",
            "Company",
            "Work Email",
            "Team Size",
          ].map((label) => (
            <input key={label} placeholder={label} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-100 outline-none focus:border-zinc-600" />
          ))}
          <textarea placeholder="What does your team need help with?" className="md:col-span-2 min-h-32 rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-100 outline-none focus:border-zinc-600" />
          <button type="submit" className="md:col-span-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-zinc-200">Submit Request</button>
        </form>
        <p className="mt-4 text-sm text-zinc-400">adam@kladeai.com • arjun@kladeai.com • gavin@kladeai.com</p>
      </Section>

      <Section>
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-8 text-center">
          <h2 className="text-4xl font-semibold text-white">Hire your first AI analyst.</h2>
          <div className="mt-6 flex justify-center gap-3">
            <Button href="mailto:beta@kladeai.com">Request Early Access</Button>
            <Button href="mailto:beta@kladeai.com?subject=Request%20Demo" variant="secondary">Request Demo</Button>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
