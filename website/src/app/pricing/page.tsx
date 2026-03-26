import { FadeIn } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";

const plans = [
  {
    name: "Monthly",
    price: "$4,000",
    period: "/month",
    description: "Full Clay access with flexible monthly commitment.",
    points: [
      "10,000 analysis credits per month",
      "Unlimited conversation — ask anything, anytime",
      "All 16 specialist desks, 220+ skills",
      "Dedicated bot on your platform (Slack, Teams, Telegram, Discord)",
      "Proactive usage updates so you're never surprised",
      "Founder-led onboarding and direct support",
    ],
    highlight: false,
    cta: "Start Monthly",
  },
  {
    name: "Annual",
    price: "$4,000",
    period: "/month, billed annually",
    description: "Same price, 50% more capacity. For teams that know Clay delivers.",
    points: [
      "15,000 analysis credits per month — 50% more than monthly",
      "Unlimited conversation",
      "All 16 specialist desks, 220+ skills",
      "Dedicated bot on your platform",
      "Priority onboarding and direct founder access",
      "Lock in pricing for 12 months",
    ],
    highlight: true,
    cta: "Start Annual",
    badge: "Best Value",
  },
];

const creditExamples = [
  { task: "Quick data lookup or stock check", credits: "~1", icon: "📊" },
  { task: "Market recap or news summary", credits: "~2", icon: "📰" },
  { task: "Single-company analysis", credits: "~5–10", icon: "🔍" },
  { task: "Comps table with 5–10 peers", credits: "~10–15", icon: "📋" },
  { task: "Full DCF or LBO model", credits: "~15–25", icon: "📈" },
  { task: "Investment memo or pitch material", credits: "~25–40", icon: "📝" },
];

const faqs = [
  [
    "How do credits work?",
    "Credits reflect the complexity of what you ask Clay to do. A quick stock lookup costs about 1 credit. A full DCF model with sensitivity analysis costs about 20. Every task is metered automatically based on complexity — no lookup tables, no guesswork. You'll always know where you stand.",
  ],
  [
    "Is conversation included?",
    "Yes — unlimited. Asking questions, getting explanations, chatting with Clay, and follow-ups on delivered work are all free. Credits only apply when Clay produces a new analytical deliverable. Think of it like talking to your analyst — the conversation is free, the research costs capacity.",
  ],
  [
    "What happens if I run out of credits?",
    "Clay never stops working on you. If you reach your monthly allocation, Clay will finish whatever task is in progress, then let you know you've hit the limit. You can choose to continue at a small overage rate, or wait for the next billing period. We'll never cut you off mid-deliverable.",
  ],
  [
    "Can I see how many credits I have left?",
    "Yes. Just ask Clay — 'How many credits do I have?' — and you'll get an instant answer. Clay also proactively notifies you at regular usage milestones so there are no surprises.",
  ],
  [
    "What platforms does Clay work on?",
    "Microsoft Teams, Slack, Telegram, and Discord. Clay deploys as a dedicated bot in your workspace — no new software to install, no separate portal to learn. Your team can message Clay just like they'd message a colleague.",
  ],
  [
    "Can we try Clay before committing?",
    "Absolutely. Talk to a founder and we'll set up a short pilot so you can see Clay in action with your actual workflows. No obligation.",
  ],
  [
    "How does Clay compare to hiring an analyst?",
    "A junior analyst costs $80K–$120K per year in salary alone, works business hours, and handles one workstream at a time. Clay costs $48K per year on the annual plan, works 24/7, and can run 220+ different financial workflows simultaneously — from DCFs to credit analysis to portfolio risk. And Clay gets smarter every week.",
  ],
  [
    "Is our data secure?",
    "Yes. Each client gets a completely isolated environment. Your conversations, data, and deliverables are never shared, never used to train models, and never accessible to other clients or our team. We provide a full security architecture document during onboarding.",
  ],
];

const trustItems = [
  "Full security architecture document included at onboarding",
  "Complete client data isolation — your data is never shared or used to train models",
  "Workflow-scoped access (least privilege by default)",
  "Founder-led launch with direct technical handoff",
];

export default function PricingPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <Section className="pt-20">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">Pricing</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-white">
            One analyst. One price.<br />Unlimited potential.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-[#b3bedf]">
            Clay is one product — every client gets the full platform. No tiers, no feature gates, no &quot;contact sales for the good stuff.&quot; Pick your commitment level and get to work.
          </p>
        </FadeIn>
      </Section>

      {/* Plans */}
      <Section className="pt-6 md:pt-8">
        <div className="grid gap-6 md:grid-cols-2 md:max-w-4xl md:mx-auto">
          {plans.map((plan, index) => (
            <FadeIn
              key={plan.name}
              delay={index * 0.08}
              className={`relative rounded-2xl border p-7 ${
                plan.highlight
                  ? "border-[#4FD1FF]/30 bg-[#4FD1FF]/5"
                  : "border-white/8 bg-white/4"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 right-6 rounded-full bg-[#4FD1FF] px-3 py-1 text-xs font-semibold text-[#0a0f2c]">
                  {plan.badge}
                </span>
              )}
              <h2 className="text-2xl font-semibold text-white">{plan.name}</h2>
              <p className="mt-3">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-[#9aa4cb]">{plan.period}</span>
              </p>
              <p className="mt-3 text-sm text-[#9aa4cb]">{plan.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-[#d8def5]">
                {plan.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-[#4FD1FF]">✓</span> {point}
                  </li>
                ))}
              </ul>
              <Button
                href="/#lead-form"
                className="mt-8 w-full justify-center"
                variant={plan.highlight ? "primary" : "secondary"}
              >
                {plan.cta}
              </Button>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Credit Examples */}
      <Section className="py-10">
        <FadeIn>
          <h2 className="text-3xl font-semibold text-white text-center">What can you do with credits?</h2>
          <p className="mt-3 text-center text-[#b3bedf] max-w-2xl mx-auto">
            Credits scale with complexity. Simple tasks cost almost nothing. Deep analysis costs more. Conversation with Clay is always free.
          </p>
        </FadeIn>
        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {creditExamples.map((example, index) => (
            <FadeIn
              key={example.task}
              delay={index * 0.04}
              className="rounded-xl border border-white/8 bg-white/4 p-5 flex items-start gap-4"
            >
              <span className="text-2xl">{example.icon}</span>
              <div>
                <p className="text-sm font-medium text-white">{example.task}</p>
                <p className="mt-1 text-sm text-[#4FD1FF] font-semibold">{example.credits} credits</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.3}>
          <p className="mt-6 text-center text-sm text-[#9aa4cb]">
            A monthly plan with 10,000 credits supports roughly 20–30 full analyses per day plus unlimited conversation.
          </p>
        </FadeIn>
      </Section>

      {/* Conversation is Free */}
      <Section className="py-4">
        <FadeIn>
          <div className="rounded-2xl border border-[#4FD1FF]/15 bg-gradient-to-r from-[#0a0f2c] via-[#10162f] to-[#0a0f2c] p-8 text-center">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">Always included</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Conversation is unlimited. On every plan.</h2>
            <p className="mt-4 max-w-2xl mx-auto text-[#b3bedf]">
              Ask questions. Get explanations. Discuss strategy. Follow up on deliverables. Chat with Clay as much as you want — it never costs a credit. Credits only apply when Clay produces a new analytical deliverable for you.
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* Trust Center */}
      <Section className="py-8">
        <FadeIn>
          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-6 md:p-7">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-400">Security &amp; Trust</p>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {trustItems.map((item) => (
                <p key={item} className="rounded-lg border border-white/8 bg-white/4 px-3 py-2.5 text-sm text-[#d8def5]">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* FAQ */}
      <Section className="pt-2">
        <FadeIn>
          <h2 className="text-3xl font-semibold text-white">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {faqs.map(([q, a], index) => (
              <FadeIn key={q} delay={index * 0.03} className="rounded-xl border border-white/8 bg-white/4 p-5">
                <p className="font-medium text-white">{q}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#b3bedf]">{a}</p>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* CTA */}
      <Section className="py-10">
        <FadeIn>
          <div className="rounded-2xl border border-[#4FD1FF]/15 bg-gradient-to-r from-[#0a0f2c] via-[#10162f] to-[#0a0f2c] p-8 text-center">
            <h2 className="text-3xl font-semibold text-white">Ready to see Clay in action?</h2>
            <p className="mt-3 text-[#b3bedf]">
              Talk to a founder. We&apos;ll set up a pilot with your real workflows — no obligation, no generic demo.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button href="/#lead-form">Request a Pilot</Button>
              <Button href="mailto:arjun@kladeai.com" variant="secondary">Email a Founder</Button>
            </div>
          </div>
        </FadeIn>
      </Section>
    </SiteShell>
  );
}
