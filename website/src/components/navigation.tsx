"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Container } from "./ui";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, string>>;
  }
}

const navLinks = [
  { label: "Meet Clay", href: "/#meet-clay" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "ROI", href: "/#roi-estimator" },
  { label: "Pricing", href: "/pricing" },
  { label: "Team", href: "/team" },
];

function trackEvent(eventName: string, payload?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const event = { event: eventName, ...payload };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
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
      const hash = href.slice(1);
      return activeHash === hash;
    }
    if (href === "/") return pathname === "/" && !activeHash;
    return pathname === href;
  };

  useEffect(() => {
    if (pathname !== "/") return;
    const sectionIds = navLinks
      .filter((link) => link.href.startsWith("/#"))
      .map((link) => link.href.split("#")[1])
      .filter(Boolean);
    if (sectionIds.length === 0) return;
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveHash(`#${visible.target.id}`);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.15, 0.35, 0.6] }
    );
    sections.forEach((section) => observer.observe(section));
    const onHashChange = () => setActiveHash(window.location.hash || "");
    window.addEventListener("hashchange", onHashChange);
    return () => { observer.disconnect(); window.removeEventListener("hashchange", onHashChange); };
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
    const focusable = menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    focusable[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) { hadOpenedRef.current = true; return; }
    if (hadOpenedRef.current) { menuButtonRef.current?.focus(); hadOpenedRef.current = false; }
  }, [open]);

  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener("hashchange", handler);
    window.addEventListener("popstate", handler);
    return () => { window.removeEventListener("hashchange", handler); window.removeEventListener("popstate", handler); };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => { if (media.matches) setOpen(false); };
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-4 z-50">
      <Container>
        <div className="relative rounded-2xl border border-white/10 bg-[#0a0f2c]/80 shadow-[0_14px_36px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          <div className="flex h-14 items-center justify-between px-4">
            {/* Logo */}
            <Link href="/" onClick={() => setOpen(false)} className="group inline-flex items-center gap-2.5">
              <span className="relative h-8 w-8 overflow-hidden rounded-lg border border-[#4FD1FF]/25 shadow-[0_0_14px_rgba(79,209,255,0.2)]">
                <Image src="/brand/klade-kmark.jpg" alt="Klade" fill sizes="32px" className="object-cover" />
              </span>
              <Image src="/brand/klade-wordmark.jpg" alt="Klade" width={80} height={24} className="h-5 w-auto object-contain opacity-90 transition-opacity group-hover:opacity-100" />
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Primary" className="hidden items-center gap-5 text-sm md:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => trackEvent("nav_click", { cta: item.label.toLowerCase().replace(/\s+/g, "_") })}
                  aria-current={isActiveLink(item.href) ? "page" : undefined}
                  className={`transition-colors duration-200 hover:text-[#4FD1FF] ${isActiveLink(item.href) ? "text-[#4FD1FF]" : "text-[#9aa4cb]"}`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={pathname === "/" ? "#lead-form" : "/#lead-form"}
                onClick={() => trackEvent("nav_cta_click", { cta: "join_beta" })}
                className="rounded-lg border border-[#4FD1FF]/30 bg-gradient-to-r from-[#4FD1FF] via-[#3C5BFF] to-[#7A5CFF] px-4 py-1.5 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_24px_-14px_rgba(79,209,255,0.6)]"
              >
                Join Private Beta
              </Link>
            </nav>

            {/* Mobile toggle */}
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={mobileMenuId}
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-white/80 transition-all duration-200 hover:border-[#4FD1FF]/30 hover:text-[#4FD1FF] md:hidden"
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  id={mobileMenuId}
                  ref={menuPanelRef}
                  className="relative z-50 max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain border-t border-white/8 bg-[#0a0f2c]/95 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden"
                  role="dialog"
                  aria-modal="true"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: reduceMotion ? 0.12 : 0.22, ease: "easeOut" }}
                >
                  <nav aria-label="Mobile" className="flex flex-col gap-2 text-sm">
                    <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.16em] text-[#9aa4cb]">
                      Private beta · Founder response in &lt;24h
                    </p>
                    {navLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => { trackEvent("nav_click", { cta: item.label.toLowerCase().replace(/\s+/g, "_") }); setOpen(false); }}
                        aria-current={isActiveLink(item.href) ? "page" : undefined}
                        className={`rounded-lg px-3 py-2 text-[#d8def5] transition-colors hover:bg-white/5 ${isActiveLink(item.href) ? "bg-white/5 text-[#4FD1FF]" : ""}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <Link
                        href="mailto:arjun@kladeai.com"
                        onClick={() => setOpen(false)}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-xs text-[#9aa4cb]"
                      >
                        Email a Founder
                      </Link>
                      <Link
                        href={pathname === "/" ? "#lead-form" : "/#lead-form"}
                        onClick={() => setOpen(false)}
                        className="rounded-lg border border-[#4FD1FF]/30 bg-gradient-to-r from-[#4FD1FF] via-[#3C5BFF] to-[#7A5CFF] px-3 py-2 text-center text-xs font-medium text-white"
                      >
                        Join Private Beta
                      </Link>
                    </div>
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </header>
  );
}
