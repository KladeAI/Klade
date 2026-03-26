import { FadeIn } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";
import Image from "next/image";

const workflowSteps = [
  {
    step: "Step 1",
    title: "Ingest",
    body: "Klade ingests filings, transcripts, and selected market data for your live coverage list.",
  },
  {
    step: "Step 2",
    title: "Analyze",
    body: "Signals are ranked by relevance: guidance changes, margin risk, and management tone shifts.",
  },
  {
    step: "Step 3",
    title: "Generate",
    body: "Klade drafts a memo, one-slide summary, and follow-up questions for internal review.",
  },
  {
    step: "Step 4",
    title: "Deliver",
    body: "Outputs are sent into Teams or Slack with source-cited notes and task-ready recommendations.",
  },
];

const trustSignals = [
  "Workflow-scoped permissions and least-privilege access",
  "No client-side secrets in standard deployment path",
  "Founder-led rollout with direct technical visibility",
  "Security + architecture packet shared in kickoff week",
];

const outcomes = [
  "Pre-IC prep compressed from multi-hour to same-hour turnaround",
  "Consistent memo quality with cited source links",
  "Always-on monitoring for guidance and sentiment deltas",
];

export default function SampleWorkflowPage() {
  return (
    <SiteShell>
      <Section className="pt-20 md:pt-24">
        <FadeIn>
          <div className="rounded-3xl border border-indigo-300/20 bg-gradient-to-r from-zinc-950 via-indigo-950/20 to-zinc-950 p-7 md:p-9">
            <p className="text-xs uppercase tracking-[0.18em] text-indigo-200">Institutional workflow walkthrough</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-6xl">Sample workflow: weekly earnings monitor</h1>
            <p className="mt-4 max-w-3xl text-zinc-300">
              Built for growth-equity and hedge fund teams covering semiconductors. This is the exact 4-step cycle Klade runs to move from raw filings to partner-ready output.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/#lead-form">Book a 20-min workflow teardown</Button>
              <Button href="mailto:beta@kladeai.com?subject=Sample%20Workflow%20Packet" variant="secondary">
                Request packet by email
              </Button>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.06}>
              <article className="h-full rounded-2xl border border-zinc-800 bg-zinc-950/90 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{item.step}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{item.title}</h2>
                <p className="mt-3 text-sm text-zinc-300">{item.body}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section className="pt-2 pb-8">
        <FadeIn>
          <div className="grid gap-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Trust posture built into workflow</p>
              <div className="mt-4 grid gap-2">
                {trustSignals.map((item) => (
                  <p key={item} className="rounded-lg border border-zinc-800 bg-zinc-900/75 px-3 py-2 text-sm text-zinc-200">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-indigo-300/25 bg-indigo-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-indigo-200">Founder in the loop</p>
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/80 p-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-zinc-700">
                  <Image src="/founders/arjun.jpg" alt="Arjun Rath" fill sizes="56px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Arjun Rath · Co-Founder</p>
                  <p className="text-xs text-zinc-400">Technical owner for onboarding, architecture packet, and deployment quality gates.</p>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-sm text-zinc-200">
                {outcomes.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div className="rounded-2xl border border-indigo-300/20 bg-gradient-to-r from-zinc-900 via-indigo-950/30 to-zinc-950 p-8 text-center">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Want this flow mapped to your exact research stack?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-300">
              We’ll map your sources, output standards, and security constraints in one founder-led call.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="/#lead-form">Book a teardown</Button>
              <Button href="/pricing" variant="secondary">View pricing</Button>
            </div>
          </div>
        </FadeIn>
      </Section>
    </SiteShell>
  );
}
