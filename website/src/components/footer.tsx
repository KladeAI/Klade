import Link from "next/link";
import { Container } from "./ui";

const footerLinks = [
  { label: "Capabilities", href: "/#capabilities" },
  { label: "ROI", href: "/#roi-estimator" },
  { label: "Pricing", href: "/pricing" },
  { label: "Team", href: "/team" },
];

const founders = [
  { name: "Adam", email: "adam@kladeai.com" },
  { name: "Arjun", email: "arjun@kladeai.com" },
  { name: "Gavin", email: "gavin@kladeai.com" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#060a16] py-14">
      <Container className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        {/* Brand column */}
        <div>
          <p className="text-base font-semibold tracking-tight text-white">Klade</p>
          <p className="mt-4 max-w-sm text-sm text-[#9aa4cb]">
            One AI teammate. Many specialists behind the scenes. Moldable AI support shaped to your company.
          </p>
          <p className="mt-4 text-xs text-[#5a6a8a]">© {new Date().getFullYear()} Klade. All rights reserved.</p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#5a6a8a]">Navigate</p>
          <div className="mt-3 grid gap-2">
            {footerLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-[#9aa4cb] transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Founders */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#5a6a8a]">Talk to a Founder</p>
          <div className="mt-3 grid gap-2">
            {founders.map((f) => (
              <Link key={f.name} href={`mailto:${f.email}`} className="text-sm text-[#9aa4cb] transition-colors hover:text-[#4FD1FF]">
                {f.email}
              </Link>
            ))}
          </div>
          <Link
            href="/#lead-form"
            className="mt-4 inline-flex rounded-lg border border-[#4FD1FF]/25 bg-[#4FD1FF]/10 px-4 py-2 text-xs font-medium text-[#4FD1FF] transition-all hover:bg-[#4FD1FF]/15"
          >
            Join Private Beta →
          </Link>
        </div>
      </Container>
    </footer>
  );
}
