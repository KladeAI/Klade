import Link from "next/link";
import { Container } from "./ui";

export function Footer() {
  return (
    <footer className="border-t border-[#1f2b53]/12 bg-white/55 py-10">
      <Container className="flex flex-col gap-8 text-sm text-[#5A6175] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-medium text-[#10162F]">Klade builds AI analysts for financial intelligence teams.</p>
          <p className="mt-2 max-w-xl text-[#4B5578]">
            Research companies, screen sectors, digest filings, and generate investment-grade deliverables in minutes.
          </p>
          <p className="mt-3 text-[#6a7391]">© {new Date().getFullYear()} Klade. All rights reserved.</p>
        </div>
        <div className="grid gap-2 text-[#334067]">
          <Link href="/pricing" className="hover:text-[#10162F]">Pricing</Link>
          <Link href="/team" className="hover:text-[#10162F]">Founding Team</Link>
          <Link href="mailto:adam@kladeai.com" className="hover:text-[#10162F]">adam@kladeai.com</Link>
          <Link href="mailto:arjun@kladeai.com" className="hover:text-[#10162F]">arjun@kladeai.com</Link>
          <Link href="mailto:gavin@kladeai.com" className="hover:text-[#10162F]">gavin@kladeai.com</Link>
        </div>
      </Container>
    </footer>
  );
}
