import { SiteShell } from "@/components/site-shell";
import { Section } from "@/components/ui";

const founders = [
  {
    name: "Adam Benoit",
    focus: "Economics, financial markets & investment research.",
    email: "adam@kladeai.com",
  },
  {
    name: "Arjun Rath",
    focus: "Computer Science, intelligent systems & software infrastructure.",
    email: "arjun@kladeai.com",
  },
  {
    name: "Gavin Kim",
    focus: "Mathematics, quantitative systems & data-driven tools.",
    email: "gavin@kladeai.com",
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
            <article key={founder.name} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="text-sm text-zinc-400">Co-Founder</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{founder.name}</h2>
              <p className="mt-3 text-zinc-300">{founder.focus}</p>
              <p className="mt-4 text-sm text-zinc-400">{founder.email}</p>
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
