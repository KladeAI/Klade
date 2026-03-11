import { SiteShell } from "@/components/site-shell";
import { Section } from "@/components/ui";
import Image from "next/image";
import Link from "next/link";

const founders = [
  {
    name: "Adam Benoit",
    focus: "Economics, financial markets & investment research.",
    email: "adam@kladeai.com",
    image: "/founders/adam.svg",
  },
  {
    name: "Arjun Rath",
    focus: "Computer Science, intelligent systems & software infrastructure.",
    email: "arjun@kladeai.com",
    image: "/founders/arjun.svg",
  },
  {
    name: "Gavin Kim",
    focus: "Mathematics, quantitative systems & data-driven tools.",
    email: "gavin@kladeai.com",
    image: "/founders/gavin.svg",
  },
];

export default function TeamPage() {
  return (
    <SiteShell>
      <Section className="pt-20">
        <h1 className="text-5xl font-semibold tracking-tight text-white">Founding Team</h1>
        <p className="mt-6 max-w-4xl text-zinc-300">
          Klade was founded by three students at Haverford College who share a passion for technology, finance,
          and building powerful tools. All three founders are also members of the Haverford lacrosse team, where
          they developed a strong culture of discipline, collaboration, and execution.
        </p>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {founders.map((founder) => (
            <article key={founder.name} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-zinc-800">
                <Image src={founder.image} alt={`${founder.name} founder photo`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <p className="mt-4 text-sm text-zinc-400">Co-Founder</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{founder.name}</h2>
              <p className="mt-3 text-zinc-300">{founder.focus}</p>
              <Link href={`mailto:${founder.email}`} className="mt-4 inline-block text-sm text-zinc-400 hover:text-white">
                {founder.email}
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-8 text-zinc-400">
          Klade is built as a collaborative founding effort — product, finance understanding, and technical execution
          developed together from day one.
        </p>
      </Section>
    </SiteShell>
  );
}
