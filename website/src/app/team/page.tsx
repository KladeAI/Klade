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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {founders.map((founder) => (
            <article key={founder.name} className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/40 hover:shadow-[0_20px_45px_-30px_rgba(99,102,241,0.8)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-zinc-800">
                <Image src={founder.image} alt={`${founder.name} founder photo`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
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
