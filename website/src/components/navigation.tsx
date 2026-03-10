import Link from "next/link";
import { Container } from "./ui";

export function Navigation() {
  return (
    <header className="sticky top-4 z-50">
      {/* V1.2 navigation: glassmorphism shell for premium framing */}
      <Container>
        <div className="flex h-14 items-center justify-between rounded-2xl border border-white/15 bg-white/[0.06] px-4 shadow-[0_12px_40px_rgba(0,0,0,.35)] backdrop-blur-2xl">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white transition-colors duration-300 hover:text-indigo-200">
            Klade
            <span className="ml-1 bg-gradient-to-r from-zinc-200 to-indigo-300 bg-clip-text text-transparent">ai</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-zinc-300">
            <a href="#capabilities" className="hidden sm:inline transition-colors duration-300 hover:text-indigo-200">Capabilities</a>
            <a href="#proof" className="hidden sm:inline transition-colors duration-300 hover:text-indigo-200">Proof</a>
            <Link
              href="mailto:beta@kladeai.com"
              className="rounded-lg border border-zinc-700/80 bg-zinc-900/70 px-3 py-1.5 text-white transition-all duration-300 hover:scale-105 hover:border-indigo-300/70 hover:shadow-[0_0_22px_rgba(99,102,241,0.35)]"
            >
              Request Access
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
