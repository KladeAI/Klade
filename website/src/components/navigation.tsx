import Link from "next/link";
import { Container } from "./ui";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/70 bg-black/50 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white transition-colors duration-300 hover:text-indigo-200">
          Klade
          <span className="ml-1 bg-gradient-to-r from-zinc-300 to-indigo-300 bg-clip-text text-transparent">ai</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-zinc-300">
          <Link href="/pricing" className="transition-colors duration-300 hover:text-indigo-200">Pricing</Link>
          <Link href="/team" className="transition-colors duration-300 hover:text-indigo-200">Founding Team</Link>
          <Link
            href="mailto:beta@kladeai.com"
            className="rounded-lg border border-zinc-700/80 bg-zinc-900/70 px-3 py-1.5 text-white transition-all duration-300 hover:scale-105 hover:border-indigo-300/70 hover:shadow-[0_0_22px_rgba(99,102,241,0.35)]"
          >
            Request Access
          </Link>
        </nav>
      </Container>
    </header>
  );
}
