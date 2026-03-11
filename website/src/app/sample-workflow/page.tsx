import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";

export default function SampleWorkflowPage() {
  return (
    <SiteShell>
      <Section className="pt-20">
        <h1 className="text-5xl font-semibold tracking-tight text-white">Sample workflow</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">
          Example: weekly earnings monitor for a growth-equity team covering semiconductors.
        </p>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["1", "Ingest", "Klade ingests filings, transcripts, and selected market data for your coverage list."],
            ["2", "Analyze", "Signals are ranked by relevance: guidance changes, margin risk, and management tone shifts."],
            ["3", "Generate", "Klade drafts a memo, one-slide summary, and follow-up questions for internal review."],
            ["4", "Deliver", "Outputs are sent into Slack or Teams with source-cited notes and task-ready recommendations."],
          ].map(([step, title, body]) => (
            <article key={title} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Step {step}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
              <p className="mt-3 text-sm text-zinc-300">{body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-8 text-center">
          <h2 className="text-3xl font-semibold text-white">Want this customized to your deal workflow?</h2>
          <p className="mt-3 text-zinc-300">Book a 20-minute teardown and we’ll map your first analyst deployment.</p>
          <div className="mt-6">
            <Button href="/#lead-form">Book a 20-min workflow teardown</Button>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
