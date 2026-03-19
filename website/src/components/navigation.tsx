"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, string>>;
  }
}

const navLinks = [
  { label: "Meet Clay", href: "/#meet-clay" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "Docs", href: "/docs" },
  { label: "Demo", href: "/demo" },
  { label: "Pricing", href: "/pricing" },
  { label: "Team", href: "/team" },
];

function trackEvent(eventName: string, payload?: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
}

/* Inline SVG K mark — matches the Klade brand K exactly */
function KladeLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="8" y="12" width="18" height="96" rx="2" fill="currentColor" />
      <polygon points="38,60 80,12 104,12 58,60 104,108 80,108" fill="currentColor" />
    </svg>
  );
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const mobileMenuId = useId();
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const hadOpenedRef = useRef(false);

  const isActiveLink = (href: string) => {
    if (href.startsWith("/#")) {
      if (pathname !== "/") return false;
      return activeHash === href.slice(1);
    }
    if (href === "/") return pathname === "/" && !activeHash;
    return pathname === href;
  };

  useEffect(() => {
    if (pathname !== "/") return;
    const sectionIds = navLinks.filter((l) => l.href.startsWith("/#")).map((l) => l.href.split("#")[1]).filter(Boolean);
    if (!sectionIds.length) return;
    const sections = sectionIds.map((id) => document.getElementById(id)).filter((s): s is HTMLElement => Boolean(s));
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveHash(`#${visible.target.id}`);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.15, 0.35, 0.6] }
    );
    sections.forEach((s) => observer.observe(s));
    const onHash = () => setActiveHash(window.location.hash || "");
    window.addEventListener("hashchange", onHash);
    return () => { observer.disconnect(); window.removeEventListener("hashchange", onHash); };
  }, [pathname]);

  useEffect(() => {
    if (!open) { document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const menu = menuPanelRef.current;
    if (!menu) return;
    const focusable = menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab" || !focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) { hadOpenedRef.current = true; return; }
    if (hadOpenedRef.current) { menuButtonRef.current?.focus(); hadOpenedRef.current = false; }
  }, [open]);

  useEffect(() => {
    const h = () => setOpen(false);
    window.addEventListener("hashchange", h);
    window.addEventListener("popstate", h);
    return () => { window.removeEventListener("hashchange", h); window.removeEventListener("popstate", h); };
  }, []);

  useEffect(() => {
    const m = window.matchMedia("(min-width: 768px)");
    const c = () => { if (m.matches) setOpen(false); };
    c(); m.addEventListener("change", c);
    return () => m.removeEventListener("change", c);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#080c1a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 transition-opacity hover:opacity-80">
          <KladeLogo className="h-6 w-6 text-white" />
          <span className="text-[15px] font-semibold tracking-tight text-white">Klade</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => trackEvent("nav_click", { cta: item.label.toLowerCase().replace(/\s+/g, "_") })}
              aria-current={isActiveLink(item.href) ? "page" : undefined}
              className={`text-[13px] transition-colors duration-150 hover:text-white ${isActiveLink(item.href) ? "text-white" : "text-[#6b7394]"}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/waitlist"
            onClick={() => trackEvent("nav_cta_click", { cta: "join_waitlist" })}
            className="rounded-md bg-gradient-to-r from-[#4FD1FF] via-[#3C5BFF] to-[#7A5CFF] px-3.5 py-1.5 text-[13px] font-medium text-white transition-opacity duration-150 hover:opacity-90"
          >
            Join Waitlist
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={mobileMenuId}
          className="inline-flex items-center justify-center p-1 text-[#6b7394] transition-colors hover:text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            <motion.div
              id={mobileMenuId}
              ref={menuPanelRef}
              className="absolute left-0 right-0 z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-white/[0.06] bg-[#080c1a]/95 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden"
              role="dialog"
              aria-modal="true"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <nav aria-label="Mobile" className="flex flex-col gap-1 text-sm">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => { trackEvent("nav_click", { cta: item.label.toLowerCase().replace(/\s+/g, "_") }); setOpen(false); }}
                    aria-current={isActiveLink(item.href) ? "page" : undefined}
                    className={`rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5 ${isActiveLink(item.href) ? "bg-white/5 text-white" : "text-[#9aa4cb]"}`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    href="mailto:arjun@kladeai.com"
                    onClick={() => setOpen(false)}
                    className="rounded-md border border-white/8 bg-white/5 py-2.5 text-center text-[13px] text-[#9aa4cb]"
                  >
                    Email a Founder
                  </Link>
                  <Link
                    href="/waitlist"
                    onClick={() => setOpen(false)}
                    className="rounded-md bg-gradient-to-r from-[#4FD1FF] via-[#3C5BFF] to-[#7A5CFF] py-2.5 text-center text-[13px] font-medium text-white"
                  >
                    Join Waitlist
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
