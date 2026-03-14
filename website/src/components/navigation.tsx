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
    <header className="sticky top-0 z-50">
      <Container>
        <div className="relative border-b border-white/8 bg-[#080c1a]/90 backdrop-blur-xl">
          <div className="flex h-12 items-center justify-between">
            {/* Logo */}
            <Link href="/" onClick={() => setOpen(false)} className="inline-flex items-center gap-2">
              <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md bg-white/10 p-0.5">
                <Image src="/brand/klade-kmark.jpg" alt="K" fill sizes="28px" className="object-contain brightness-[2] contrast-[1.2] saturate-0 invert" />
              </span>
              <span className="text-base font-semibold tracking-tight text-white">Klade</span>
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Primary" className="hidden items-center gap-6 text-[13px] md:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => trackEvent("nav_click", { cta: item.label.toLowerCase().replace(/\s+/g, "_") })}
                  aria-current={isActiveLink(item.href) ? "page" : undefined}
                  className={`transition-colors duration-200 hover:text-white ${isActiveLink(item.href) ? "text-white" : "text-[#7a84a8]"}`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={pathname === "/" ? "#lead-form" : "/#lead-form"}
                onClick={() => trackEvent("nav_cta_click", { cta: "join_beta" })}
                className="rounded-md bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#080c1a] transition-all duration-200 hover:bg-white/90"
              >
                Join Beta
              </Link>
            </nav>

            {/* Mobile toggle */}
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={mobileMenuId}
              className="inline-flex items-center justify-center p-1.5 text-[#7a84a8] transition-colors hover:text-white md:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={16} /> : <Menu size={16} />}
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
                  className="relative z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-white/8 bg-[#080c1a]/95 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden"
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
                        className="rounded-md bg-white px-3 py-2 text-center text-xs font-medium text-[#080c1a]"
                      >
                        Join Beta
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
