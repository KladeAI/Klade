import { FadeIn } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";

const plans = [
  {
    name: "Credit Packs",
    price: "$1,500+",
    description: "For teams piloting focused analyst workflows.",
    points: ["Usage-based credits", "Company + sector research", "Memo and deck draft outputs", "Email support"],
  },
  {
    name: "Subscription",
    price: "$4,000/mo+",
    description: "For teams running recurring research and reporting cycles.",
    points: ["Monthly credit allocation", "Priority processing", "Workflow templates", "Slack/Teams delivery"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For institutions requiring custom deployment and controls.",
    points: ["Tailored workflow design", "Security review support", "Custom integrations", "Dedicated founder-led onboarding"],
  },
];

const faqs = [
  ["How are credits consumed?", "Credits map to task complexity, source volume, and output format."],
  ["Can Klade integrate with our tools?", "Yes. We deploy into Slack, Teams, and internal environments."],
  ["Do you support custom analyst workflows?", "Yes. We configure analysts around your exact process and deliverable standards."],
  ["What happens after we submit a request?", "You get a founder-led response within 24 hours and a clear rollout plan."],
];

const trustItems = [
  "Security + architecture packet included in kickoff week",
  "Workflow-scoped access model (least privilege by default)",
  "Founder-led launch and direct technical handoff",
  "No client-side secrets in standard deployment pattern",
];

export default function PricingPage() {
  return (
    <SiteShell>
      <Section className="pt-20">
        <FadeIn>
          <h1 className="text-5xl font-semibold tracking-tight text-white">Pricing</h1>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Flexible pricing across credit usage, subscriptions, and enterprise deployment paths.
          </p>
        </FadeIn>
      </Section>

      <Section className="pt-6 md:pt-8">
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan, index) => (
            <FadeIn key={plan.name} delay={index * 0.05} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
              <p className="mt-2 text-3xl font-semibold text-zinc-100">{plan.price}</p>
              <p className="mt-3 text-sm text-zinc-400">{plan.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-zinc-300">
                {plan.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section className="py-8">
        <FadeIn>
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/5 p-6 md:p-7">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Trust center preview</p>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {trustItems.map((item) => (
                <p key={item} className="rounded-lg border border-zinc-800 bg-zinc-900/75 px-3 py-2 text-sm text-zinc-200">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="pt-4">
        <FadeIn>
          <h2 className="text-3xl font-semibold text-white">FAQ</h2>
          <div className="mt-6 space-y-3">
            {faqs.map(([q, a], index) => (
              <FadeIn key={q} delay={index * 0.04} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="font-medium text-white">{q}</p>
                <p className="mt-2 text-zinc-300">{a}</p>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div className="rounded-2xl border border-indigo-300/20 bg-gradient-to-r from-zinc-900 via-indigo-950/30 to-zinc-950 p-8 text-center">
            <h2 className="text-3xl font-semibold text-white">Need a custom enterprise deployment?</h2>
            <p className="mt-3 text-zinc-300">We’ll map your workflow, compliance requirements, and launch path in one call.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button href="/#lead-form">Book a 20-min workflow teardown</Button>
              <Button href="mailto:beta@kladeai.com?subject=Enterprise%20Deployment" variant="secondary">Contact Sales</Button>
            </div>
          </div>
        </FadeIn>
      </Section>
    </SiteShell>
  );
}
