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
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Security", href: "/#security" },
  { label: "ROI", href: "/#roi-estimator" },
  { label: "Pricing", href: "/pricing" },
  { label: "Founding Team", href: "/team" },
];

const founderMenuPreview = [
  { name: "Adam", image: "/founders/adam.jpg" },
  { name: "Arjun", image: "/founders/arjun.jpg" },
  { name: "Gavin", image: "/founders/gavin.jpg" },
];

function trackEvent(eventName: string, payload?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const event = { event: eventName, ...payload };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const mobileMenuId = useId();
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const hadOpenedRef = useRef(false);

  const isActiveLink = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/";
    if (href === "/") return pathname === "/";
    return pathname === href;
  };


  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const menu = menuPanelRef.current;
    if (!menu) return;

    const focusable = menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    focusable[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      hadOpenedRef.current = true;
      return;
    }

    if (hadOpenedRef.current) {
      menuButtonRef.current?.focus();
      hadOpenedRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    const onHashOrHistoryChange = () => setOpen(false);
    window.addEventListener("hashchange", onHashOrHistoryChange);
    window.addEventListener("popstate", onHashOrHistoryChange);
    return () => {
      window.removeEventListener("hashchange", onHashOrHistoryChange);
      window.removeEventListener("popstate", onHashOrHistoryChange);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (media.matches) setOpen(false);
    };

    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-4 z-50">
      <Container>
        <div className="relative rounded-2xl border border-white/15 bg-black/60 shadow-[0_12px_40px_rgba(0,0,0,.35)] backdrop-blur-2xl">
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

            <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => trackEvent("proof_cta_click", { placement: "navbar", cta: item.label.toLowerCase().replace(/\s+/g, "_") })}
                  aria-current={isActiveLink(item.href) ? "page" : undefined}
                  className={`transition-colors duration-300 hover:text-indigo-200 ${isActiveLink(item.href) ? "text-indigo-200" : "text-zinc-300"}`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={pathname === "/" ? "#lead-form" : "/#lead-form"}
                onClick={() => trackEvent("hero_cta_click", { placement: "navbar", cta: "book_teardown" })}
                className="rounded-lg border border-zinc-700/80 bg-zinc-900/70 px-3 py-1.5 text-white transition-all duration-300 hover:scale-105 hover:border-indigo-300/70 hover:shadow-[0_0_22px_rgba(99,102,241,0.35)]"
              >
                Book Teardown
              </Link>
            </nav>

            <button
              ref={menuButtonRef}
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={mobileMenuId}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-900/70 p-2 text-zinc-100 transition-all duration-200 hover:border-indigo-300/60 hover:text-indigo-100 md:hidden"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <>
                <motion.button
                  aria-label="Close mobile menu backdrop"
                  className="fixed inset-0 z-40 bg-black/45 md:hidden"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  id={mobileMenuId}
                  ref={menuPanelRef}
                  className="relative z-50 border-t border-zinc-800 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 md:hidden"
                  role="dialog"
                  aria-modal="true"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: reduceMotion ? 0.12 : 0.22, ease: "easeOut" }}
                >
                  <nav aria-label="Mobile" className="flex flex-col gap-2 text-sm text-zinc-200">
                    <p className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                      Founder response in &lt;24h · private beta
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] uppercase tracking-[0.12em] text-zinc-400">
                      <span className="rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-1.5 text-center">TLS secured</span>
                      <span className="rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-1.5 text-center">Security packet</span>
                    </div>
                    <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-2">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Founder channel</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {founderMenuPreview.map((founder) => (
                            <span key={founder.name} className="relative h-6 w-6 overflow-hidden rounded-full border border-zinc-700">
                              <Image src={founder.image} alt={`${founder.name} founder photo`} fill sizes="24px" className="object-cover" />
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-zinc-300">Direct founder response, not SDR handoff.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <Link
                        href="mailto:beta@kladeai.com"
                        onClick={() => {
                          trackEvent("proof_cta_click", { placement: "mobile_nav", cta: "email_beta" });
                          setOpen(false);
                        }}
                        className="rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-2 text-center text-zinc-300"
                      >
                        Email team
                      </Link>
                      <Link
                        href={pathname === "/" ? "#security" : "/#security"}
                        onClick={() => {
                          trackEvent("proof_cta_click", { placement: "mobile_nav", cta: "view_security" });
                          setOpen(false);
                        }}
                        className="rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-2 text-center text-zinc-300"
                      >
                        View security
                      </Link>
                    </div>
                    {navLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => {
                          trackEvent("proof_cta_click", { placement: "mobile_nav", cta: item.label.toLowerCase().replace(/\s+/g, "_") });
                          setOpen(false);
                        }}
                        aria-current={isActiveLink(item.href) ? "page" : undefined}
                        className={`rounded-lg px-2 py-2 transition-colors hover:bg-zinc-900 ${isActiveLink(item.href) ? "bg-zinc-900 text-indigo-200" : ""}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <Link
                      href={pathname === "/" ? "#lead-form" : "/#lead-form"}
                      onClick={() => {
                        trackEvent("hero_cta_click", { placement: "mobile_nav", cta: "book_teardown" });
                        setOpen(false);
                      }}
                      className="mt-1 rounded-lg border border-indigo-300/30 bg-indigo-500/15 px-2 py-2 text-indigo-100"
                    >
                      Book a 20-min workflow teardown
                    </Link>
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
