"use client";

import { FadeIn } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";
import Image from "next/image";
import Link from "next/link";

const founders = [
  {
    name: "Adam Benoit",
    focus: "Economics, financial markets, and investment research workflows.",
    specialties: ["Market structure", "Investment research"],
    email: "adam@kladeai.com",
    image: "/founders/adam.jpg",
  },
  {
    name: "Arjun Rath",
    focus: "Product + infrastructure systems that turn analyst workflows into reliable execution.",
    specialties: ["Product systems", "Infrastructure"],
    email: "arjun@kladeai.com",
    image: "/founders/arjun.jpg",
  },
  {
    name: "Gavin Kim",
    focus: "Quantitative systems design and structured decision-support outputs.",
    specialties: ["Quant systems", "Decision support"],
    email: "gavin@kladeai.com",
    image: "/founders/gavin.jpg",
  },
];

export default function TeamPage() {
  return (
    <SiteShell>
      <Section className="pt-20">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">Founding team</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-white">Built by operators.</h1>
          <p className="mt-4 max-w-4xl text-[#b3bedf]">
            Klade is built by three founders operating inside the workflows we&apos;re automating: investment research,
            product systems, and quantitative decision support. Founder-led through onboarding and technical rollout.
          </p>
        </FadeIn>
      </Section>

      <Section className="pt-4 md:pt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {founders.map((founder, index) => (
            <FadeIn key={founder.name} delay={index * 0.05} className="group flex h-full flex-col rounded-2xl border border-white/8 bg-white/4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#4FD1FF]/25">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/8">
                <Image
                  src={founder.image}
                  alt={`${founder.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-[#9aa4cb]">Co-Founder</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{founder.name}</h2>
              <p className="mt-3 text-sm text-[#b3bedf]">{founder.focus}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {founder.specialties.map((specialty) => (
                  <span key={specialty} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-[#9aa4cb]">
                    {specialty}
                  </span>
                ))}
              </div>
              <Link href={`mailto:${founder.email}`} className="mt-4 inline-block text-sm text-[#4FD1FF] transition-colors hover:text-white">
                {founder.email} →
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section className="py-8">
        <FadeIn>
          <div className="rounded-2xl border border-[#4FD1FF]/15 bg-[#4FD1FF]/5 p-7 md:p-8">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Founder-led, trust-first launch process</h2>
            <div className="mt-4 grid gap-2 text-sm text-[#d8def5] md:grid-cols-3">
              <p className="rounded-lg border border-white/8 bg-white/4 px-3 py-2">Security + architecture packet on first call</p>
              <p className="rounded-lg border border-white/8 bg-white/4 px-3 py-2">Workflow-scoped permissions and integration boundaries</p>
              <p className="rounded-lg border border-white/8 bg-white/4 px-3 py-2">Direct founder contact through pilot onboarding</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/#lead-form">Join Private Beta</Button>
              <Button href="mailto:arjun@kladeai.com" variant="secondary">Email a Founder</Button>
            </div>
          </div>
        </FadeIn>
      </Section>
    </SiteShell>
  );
}
