import { FadeIn } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";

const plans = [
  {
    name: "Credit Packs",
    price: "$1,500+",
    description: "For teams piloting focused workflows.",
    points: ["Usage-based credits", "Research, models, and memo outputs", "Email support", "Founder-led onboarding"],
    highlight: false,
  },
  {
    name: "Subscription",
    price: "$4,000/mo+",
    description: "For teams running recurring research and reporting.",
    points: ["Monthly credit allocation", "Priority processing", "Workflow templates", "Slack/Teams delivery"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For institutions requiring custom deployment and controls.",
    points: ["Tailored workflow design", "Security review support", "Custom integrations", "Dedicated founder-led onboarding"],
    highlight: false,
  },
];

const faqs = [
  ["How are credits consumed?", "Credits map to task complexity, source volume, and output format. More complex deliverables use more credits."],
  ["Can Klade integrate with our tools?", "Yes. We deploy into Slack, Teams, and internal environments. Clay works where your team works."],
  ["Is Clay only for finance teams?", "No. Clay orchestrates specialized agents across research, reporting, operations, presentations, data organization, and more."],
  ["What happens after we submit a request?", "You get a founder-led response within 24 hours and a clear rollout plan."],
];

const trustItems = [
  "Security + architecture packet included in kickoff",
  "Workflow-scoped access model (least privilege by default)",
  "Founder-led launch and direct technical handoff",
  "No client-side secrets in standard deployment",
];

export default function PricingPage() {
  return (
    <SiteShell>
      <Section className="pt-20">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">Pricing</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-white">Flexible pricing for every team.</h1>
          <p className="mt-4 max-w-3xl text-[#b3bedf]">
            Credit packs, subscriptions, and enterprise deployment paths. Start small, scale as Clay proves value.
          </p>
        </FadeIn>
      </Section>

      <Section className="pt-4 md:pt-6">
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan, index) => (
            <FadeIn key={plan.name} delay={index * 0.05} className={`rounded-2xl border p-6 ${plan.highlight ? "border-[#4FD1FF]/25 bg-[#4FD1FF]/5" : "border-white/8 bg-white/4"}`}>
              <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
              <p className="mt-2 text-3xl font-semibold text-white">{plan.price}</p>
              <p className="mt-3 text-sm text-[#9aa4cb]">{plan.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-[#d8def5]">
                {plan.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#4FD1FF]">✓</span> {point}
                  </li>
                ))}
              </ul>
              <Button href="/#lead-form" className="mt-6 w-full justify-center" variant={plan.highlight ? "primary" : "secondary"}>
                Get Started
              </Button>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section className="py-6">
        <FadeIn>
          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-6 md:p-7">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-400">Trust center</p>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {trustItems.map((item) => (
                <p key={item} className="rounded-lg border border-white/8 bg-white/4 px-3 py-2 text-sm text-[#d8def5]">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="pt-2">
        <FadeIn>
          <h2 className="text-3xl font-semibold text-white">FAQ</h2>
          <div className="mt-6 space-y-3">
            {faqs.map(([q, a], index) => (
              <FadeIn key={q} delay={index * 0.04} className="rounded-xl border border-white/8 bg-white/4 p-5">
                <p className="font-medium text-white">{q}</p>
                <p className="mt-2 text-sm text-[#b3bedf]">{a}</p>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </Section>

      <Section className="py-8">
        <FadeIn>
          <div className="rounded-2xl border border-[#4FD1FF]/15 bg-gradient-to-r from-[#0a0f2c] via-[#10162f] to-[#0a0f2c] p-8 text-center">
            <h2 className="text-3xl font-semibold text-white">Need a custom enterprise deployment?</h2>
            <p className="mt-3 text-[#b3bedf]">We&apos;ll map your workflow, compliance requirements, and launch path in one call.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button href="/#lead-form">Join Private Beta</Button>
              <Button href="mailto:arjun@kladeai.com" variant="secondary">Email a Founder</Button>
            </div>
          </div>
        </FadeIn>
      </Section>
    </SiteShell>
  );
}
