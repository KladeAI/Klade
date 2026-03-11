"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "./ui";

const navLinks = [
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Security", href: "/#security" },
  { label: "Pricing", href: "/pricing" },
  { label: "Founding Team", href: "/team" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-50">
      <Container>
        <div className="rounded-2xl border border-white/15 bg-black/60 shadow-[0_12px_40px_rgba(0,0,0,.35)] backdrop-blur-2xl">
          <div className="flex h-14 items-center justify-between px-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-white transition-colors duration-300 hover:text-indigo-200"
            >
              <span className="relative h-7 w-7 overflow-hidden rounded-md border border-indigo-300/40 shadow-[0_0_20px_rgba(129,140,248,0.35)]">
                <Image src="/brand/klade-logo-draft.jpg" alt="Klade logo" fill sizes="28px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </span>
              <span>
                Klade
                <span className="ml-1 bg-gradient-to-r from-zinc-200 to-indigo-300 bg-clip-text text-transparent">ai</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
              {navLinks.map((item) => (
                <Link key={item.label} href={item.href} className="transition-colors duration-300 hover:text-indigo-200">
                  {item.label}
                </Link>
              ))}
              <Link
                href={pathname === "/" ? "#lead-form" : "/#lead-form"}
                className="rounded-lg border border-zinc-700/80 bg-zinc-900/70 px-3 py-1.5 text-white transition-all duration-300 hover:scale-105 hover:border-indigo-300/70 hover:shadow-[0_0_22px_rgba(99,102,241,0.35)]"
              >
                Book Teardown
              </Link>
            </nav>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-900/70 p-2 text-zinc-100 md:hidden"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {open && (
            <div className="border-t border-zinc-800 px-4 pb-4 pt-3 md:hidden">
              <nav className="flex flex-col gap-2 text-sm text-zinc-200">
                {navLinks.map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-zinc-900">
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={pathname === "/" ? "#lead-form" : "/#lead-form"}
                  onClick={() => setOpen(false)}
                  className="mt-1 rounded-lg border border-indigo-300/30 bg-indigo-500/15 px-2 py-2 text-indigo-100"
                >
                  Book a 20-min workflow teardown
                </Link>
              </nav>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
