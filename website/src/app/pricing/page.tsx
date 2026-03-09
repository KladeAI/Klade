import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";

const plans = [
  {
    name: "Starter Credits",
    price: "$1,500",
    description: "For teams piloting analyst workflows.",
    points: ["30 credit bundle", "Company and sector research", "Email support"],
  },
  {
    name: "Growth Subscription",
    price: "$4,000/mo",
    description: "For active investing teams needing continuous coverage.",
    points: ["Monthly credit allowance", "Priority model routing", "Analyst workflow templates"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Custom analyst deployment integrated with internal systems.",
    points: ["Private deployment options", "Security & controls", "Dedicated support + roadmap"],
  },
];

export default function PricingPage() {
  return (
    <SiteShell>
      <Section className="pt-20">
        <h1 className="text-5xl font-semibold tracking-tight text-white">Pricing</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">
          Flexible pricing for credit-based usage, recurring subscriptions, and custom enterprise deployments.
        </p>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
              <p className="mt-2 text-3xl font-semibold text-zinc-100">{plan.price}</p>
              <p className="mt-3 text-sm text-zinc-400">{plan.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-zinc-300">
                {plan.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-semibold text-white">FAQ</h2>
        <div className="mt-6 space-y-3">
          {[
            ["How are credits consumed?", "Credits map to task complexity, depth, and output format."],
            ["Can Klade integrate with our tools?", "Yes. We deploy into Slack, Teams, and internal platforms."],
            ["Do you offer enterprise security controls?", "Yes. Enterprise includes governance and deployment options."],
          ].map(([q, a]) => (
            <div key={q} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="font-medium text-white">{q}</p>
              <p className="mt-2 text-zinc-300">{a}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-8 text-center">
          <h2 className="text-3xl font-semibold text-white">Need a custom deployment?</h2>
          <p className="mt-3 text-zinc-300">Talk with our team about workflow design and enterprise rollout.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button href="mailto:beta@kladeai.com?subject=Enterprise%20Pricing">Contact Sales</Button>
            <Button href="mailto:beta@kladeai.com?subject=Request%20Demo" variant="secondary">Request Demo</Button>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
