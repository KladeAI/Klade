"use client";

import { FadeIn } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Section, Button } from "@/components/ui";
import { WaitlistForm } from "@/components/waitlist";

const benefits = [
  {
    icon: "🎯",
    title: "Early Access",
    desc: "Be among the first to deploy Clay for your team before general availability.",
  },
  {
    icon: "🤝",
    title: "Founder-Led Onboarding",
    desc: "Direct access to the founding team for setup, customization, and workflow design.",
  },
  {
    icon: "💰",
    title: "Founding Member Pricing",
    desc: "Lock in early-adopter pricing that stays with your account permanently.",
  },
  {
    icon: "🛠️",
    title: "Shape the Product",
    desc: "Your feedback directly influences what we build next. Priority feature requests.",
  },
];

const faqItems = [
  {
    q: "What is Clay?",
    a: "Clay is Klade's AI analyst — one interface backed by many specialized agents. It handles financial models, research, presentations, and workflows autonomously.",
  },
  {
    q: "When does early access start?",
    a: "We're onboarding teams on a rolling basis. Waitlist members get priority access as we expand capacity.",
  },
  {
    q: "What does it cost?",
    a: "Early access members receive founding member pricing. We'll share details when you're invited.",
  },
  {
    q: "How is this different from ChatGPT or Copilot?",
    a: "Clay is purpose-built for finance workflows. It produces structured, cited, format-compliant deliverables — not chat responses. Think analyst output, not conversation.",
  },
];

export default function WaitlistPage() {
  return (
    <SiteShell>
      <Section className="pt-4 md:pt-8">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4FD1FF]/25 bg-[#4FD1FF]/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#4FD1FF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1FF] animate-pulse" />
              Limited Early Access
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] text-white md:text-5xl lg:text-6xl">
              Get early access to{" "}
              <span className="klade-gradient-text">Clay</span>
            </h1>

            <p className="mt-4 text-lg text-[#b3bedf] md:text-xl">
              Join the waitlist for Klade&apos;s AI analyst. Be first in line when we expand access to new teams.
            </p>
          </FadeIn>

          {/* Waitlist form */}
          <FadeIn delay={0.1}>
            <div className="mx-auto mt-8 max-w-lg">
              <div className="rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm">
                <WaitlistForm variant="page" />
              </div>
            </div>
          </FadeIn>

          {/* Social proof */}
          <FadeIn delay={0.15}>
            <p className="mt-4 text-xs text-[#5a6a8a]">
              Join teams from finance, consulting, and operations already on the list.
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* Benefits */}
      <Section className="py-4">
        <FadeIn>
          <p className="text-center text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">
            Why join early
          </p>
          <h2 className="mt-2 text-center text-3xl font-semibold text-white md:text-4xl">
            What waitlist members get
          </h2>
        </FadeIn>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {benefits.map((b, i) => (
            <FadeIn key={b.title} delay={i * 0.05}>
              <div className="surface-card rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1">
                <span className="text-2xl">{b.icon}</span>
                <p className="mt-3 text-sm font-medium text-white">{b.title}</p>
                <p className="mt-1.5 text-sm text-[#9aa4cb]">{b.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-4">
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            <p className="text-center text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">FAQ</p>
            <h2 className="mt-2 text-center text-3xl font-semibold text-white md:text-4xl">
              Common questions
            </h2>

            <div className="mt-8 space-y-4">
              {faqItems.map((item) => (
                <div key={item.q} className="rounded-xl border border-white/8 bg-white/4 p-5">
                  <p className="text-sm font-medium text-white">{item.q}</p>
                  <p className="mt-2 text-sm text-[#9aa4cb] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* Bottom CTA */}
      <Section className="py-4">
        <FadeIn>
          <div className="rounded-3xl border border-[#4FD1FF]/15 bg-gradient-to-r from-[#0a0f2c] via-[#10162f] to-[#0a0f2c] p-8 text-center">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              Prefer to talk to a founder directly?
            </h2>
            <p className="mt-3 text-[#b3bedf]">
              Book a 15-minute call. We&apos;ll show you what Clay can do for your team.
            </p>
            <div className="mt-6">
              <Button
                href="https://calendly.com/adam-kladeai/new-meeting"
                variant="secondary"
                eventName="cta_click"
                eventPayload={{ placement: "waitlist_page", cta: "book_demo" }}
              >
                Book a Demo
              </Button>
            </div>
          </div>
        </FadeIn>
      </Section>
    </SiteShell>
  );
}
