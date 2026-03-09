import Link from "next/link";
import { Container } from "./ui";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900/80 bg-black/70 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          Klade
          <span className="ml-1 text-zinc-500">ai</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-zinc-300">
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/team" className="hover:text-white">Founding Team</Link>
          <Link
            href="mailto:beta@kladeai.com"
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-white hover:border-zinc-500"
          >
            Request Access
          </Link>
        </nav>
      </Container>
    </header>
  );
}
