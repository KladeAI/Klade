"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";

/* ===== SIDEBAR NAV DATA ===== */
const docsNav = [
  { label: "Welcome", href: "/docs" },
  { label: "Getting Started", href: "/docs/quickstart" },
  { label: "How Clay Works", href: "/docs/how-clay-works" },
  { label: "Capabilities", href: "/docs/capabilities" },
  { label: "Use Cases", href: "/docs/use-cases" },
  { label: "Security", href: "/docs/security" },
  { label: "Integrations", href: "/docs/integrations" },
  { label: "FAQ", href: "/docs/faq" },
];

/* ===== SIDEBAR ===== */
export function DocsSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className={className}>
      <div className="space-y-1">
        {docsNav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-[#3c5bff]/10 text-white font-medium border-l-2 border-[#3c5bff]"
                  : "text-[#9aa4cb] hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ===== MOBILE SIDEBAR ===== */
export function DocsMobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Reset `open` when the route changes. Done in render body (React's
  // recommended pattern for prop-driven state resets) to avoid setState
  // inside useEffect, which trips react-hooks/set-state-in-effect.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#9aa4cb] transition-colors hover:text-white"
      >
        {open ? <X size={16} /> : <Menu size={16} />}
        Navigation
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 overflow-hidden rounded-xl border border-white/8 bg-[#0d1225] p-3"
          >
            <DocsSidebar />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===== ON THIS PAGE TOC ===== */
export function TableOfContents({ items }: { items: { id: string; label: string }[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <div className="hidden xl:block">
      <div className="sticky top-20">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#5a6a8a] mb-3">On this page</p>
        <div className="space-y-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-xs transition-colors py-1 ${
                activeId === item.id ? "text-[#4fd1ff]" : "text-[#9aa4cb] hover:text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== REUSABLE COMPONENTS ===== */

export function DocsHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={`text-4xl font-semibold tracking-tight text-white md:text-5xl ${className}`}>
      {children}
    </h1>
  );
}

export function DocsSubheading({ children, id, className = "" }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <h2 id={id} className={`scroll-mt-24 text-2xl font-semibold text-white mt-12 mb-4 ${className}`}>
      {children}
    </h2>
  );
}

export function DocsText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[#b3bedf] leading-relaxed ${className}`}>{children}</p>;
}

export function DocsCallout({ children, type = "info" }: { children: ReactNode; type?: "info" | "tip" | "warning" }) {
  const styles = {
    info: "border-[#3c5bff]/25 bg-[#3c5bff]/8 text-[#d8def5]",
    tip: "border-[#4fd1ff]/25 bg-[#4fd1ff]/8 text-[#d8def5]",
    warning: "border-amber-500/25 bg-amber-500/8 text-amber-100",
  };
  const icons = { info: "💡", tip: "✨", warning: "⚠️" };

  return (
    <div className={`my-6 rounded-xl border p-4 ${styles[type]}`}>
      <div className="flex gap-3">
        <span className="text-lg">{icons[type]}</span>
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function ProcessStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#4fd1ff]/25 bg-[#4fd1ff]/10 text-sm font-semibold text-[#4fd1ff]">
        {number}
      </div>
      <div>
        <p className="font-medium text-white">{title}</p>
        <p className="mt-1 text-sm text-[#9aa4cb]">{description}</p>
      </div>
    </div>
  );
}

export function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/4 p-5 transition-all duration-300 hover:border-white/14 hover:bg-white/6">
      <span className="text-2xl">{icon}</span>
      <p className="mt-3 text-sm font-medium text-white">{title}</p>
      <p className="mt-1.5 text-xs text-[#9aa4cb]">{description}</p>
    </div>
  );
}

export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-white/8 bg-white/4 overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white transition-colors hover:bg-white/4"
          >
            {item.question}
            <ChevronDown
              size={16}
              className={`shrink-0 text-[#9aa4cb] transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-sm text-[#9aa4cb] leading-relaxed">{item.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
