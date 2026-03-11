import Link from "next/link";
import { Container } from "./ui";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 py-10">
      <Container className="flex flex-col gap-8 text-sm text-zinc-400 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-medium text-zinc-100">Klade builds AI analysts for financial intelligence teams.</p>
          <p className="mt-2 max-w-xl text-zinc-400">
            Research companies, screen sectors, digest filings, and generate investment-grade deliverables in minutes.
          </p>
          <p className="mt-3 text-zinc-500">© {new Date().getFullYear()} Klade. All rights reserved.</p>
        </div>
        <div className="grid gap-2 text-zinc-300">
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/team" className="hover:text-white">Founding Team</Link>
          <Link href="mailto:adam@kladeai.com" className="hover:text-white">adam@kladeai.com</Link>
          <Link href="mailto:arjun@kladeai.com" className="hover:text-white">arjun@kladeai.com</Link>
          <Link href="mailto:gavin@kladeai.com" className="hover:text-white">gavin@kladeai.com</Link>
        </div>
      </Container>
    </footer>
  );
}
