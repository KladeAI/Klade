import Link from "next/link";
import { Container } from "./ui";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 py-10">
      <Container className="flex flex-col gap-6 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-zinc-200">Klade AI analysts for financial intelligence.</p>
          <p className="mt-1">© {new Date().getFullYear()} Klade. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="mailto:beta@kladeai.com" className="hover:text-white">beta@kladeai.com</Link>
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/team" className="hover:text-white">Founding Team</Link>
        </div>
      </Container>
    </footer>
  );
}
