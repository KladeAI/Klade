"use client";

import { FadeIn } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const founders = [
  {
    name: "Adam Benoit",
    focus: "Economics, financial markets, and investment research workflows.",
    specialties: ["Market structure", "Investment research"],
    email: "adam@kladeai.com",
    image: "/founders/adam.jpg",
    fallbackImage: "/founders/adam.svg",
  },
  {
    name: "Arjun Rath",
    focus: "Product + infrastructure systems that turn analyst workflows into reliable execution.",
    specialties: ["Product systems", "Infrastructure"],
    email: "arjun@kladeai.com",
    image: "/founders/arjun.jpg",
    fallbackImage: "/founders/arjun.svg",
  },
  {
    name: "Gavin Kim",
    focus: "Quantitative systems design and structured decision-support outputs.",
    specialties: ["Quant systems", "Decision support"],
    email: "gavin@kladeai.com",
    image: "/founders/gavin.jpg",
    fallbackImage: "/founders/gavin.svg",
  },
];

export default function TeamPage() {
  const [founderImages, setFounderImages] = useState<Record<string, string>>(() =>
    Object.fromEntries(founders.map((founder) => [founder.name, founder.image]))
  );

  return (
    <SiteShell>
      <Section className="pt-20">
        <FadeIn>
          <h1 className="text-5xl font-semibold tracking-tight text-white">Founding Team</h1>
          <p className="mt-6 max-w-4xl text-zinc-300">
            Klade is built by three founders operating inside the workflows we are automating: investment research,
            product systems, and quantitative decision support. We stay founder-led through onboarding and technical rollout.
          </p>
        </FadeIn>
      </Section>

      <Section className="pt-6 md:pt-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {founders.map((founder, index) => (
            <FadeIn key={founder.name} delay={index * 0.05} className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/40 hover:shadow-[0_20px_45px_-30px_rgba(99,102,241,0.8)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-zinc-800">
                <Image
                  src={founderImages[founder.name] ?? founder.image}
                  alt={`${founder.name} founder photo`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  onError={() =>
                    setFounderImages((prev) =>
                      prev[founder.name] === founder.fallbackImage ? prev : { ...prev, [founder.name]: founder.fallbackImage }
                    )
                  }
                />
              </div>
              <p className="mt-4 text-sm text-zinc-400">Co-Founder</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{founder.name}</h2>
              <p className="mt-3 text-zinc-300">{founder.focus}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {founder.specialties.map((specialty) => (
                  <span key={specialty} className="rounded-full border border-zinc-700 bg-zinc-900/80 px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-zinc-300">
                    {specialty}
                  </span>
                ))}
              </div>
              <Link href={`mailto:${founder.email}`} className="mt-4 inline-block text-sm text-zinc-400 hover:text-white">
                {founder.email}
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section className="py-10">
        <FadeIn>
          <div className="rounded-2xl border border-indigo-300/25 bg-indigo-500/10 p-7 md:p-8">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Founder-led, trust-first launch process</h2>
            <div className="mt-4 grid gap-2 text-sm text-zinc-200 md:grid-cols-3">
              <p className="rounded-lg border border-zinc-800 bg-zinc-900/75 px-3 py-2">Security + architecture packet on first call</p>
              <p className="rounded-lg border border-zinc-800 bg-zinc-900/75 px-3 py-2">Workflow-scoped permissions and integration boundaries</p>
              <p className="rounded-lg border border-zinc-800 bg-zinc-900/75 px-3 py-2">Direct founder contact through pilot onboarding</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/#lead-form">Book a 20-min workflow teardown</Button>
              <Button href="mailto:beta@kladeai.com" variant="secondary">beta@kladeai.com</Button>
            </div>
          </div>
        </FadeIn>
      </Section>
    </SiteShell>
  );
}
