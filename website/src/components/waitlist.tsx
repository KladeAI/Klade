"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";

type WaitlistStatus = "idle" | "submitting" | "success" | "error";

function trackEvent(eventName: string, payload?: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
}

export function WaitlistForm({ className = "", variant = "default" }: { className?: string; variant?: "default" | "hero" | "page" }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<WaitlistStatus>("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const isHero = variant === "hero";
  const isPage = variant === "page";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    trackEvent("waitlist_submit_attempt", { source: variant });
    setStatus("submitting");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, honeypot }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "submit-failed");
      }

      setStatus("success");
      trackEvent("waitlist_signup", { source: variant, email_domain: email.split("@")[1] || "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-6 text-center ${className}`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15"
        >
          <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </motion.div>
        <p className="mt-3 text-lg font-semibold text-white">You&apos;re on the list!</p>
        <p className="mt-1 text-sm text-emerald-300/80">We&apos;ll be in touch soon with early access details.</p>
      </motion.div>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={onSubmit} className={isPage ? "space-y-4" : ""}>
        {/* Honeypot */}
        <label className="hidden" aria-hidden="true">
          Website
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>

        {isPage ? (
          /* Page variant: stacked layout */
          <>
            <div className="space-y-3">
              <div className="relative">
                <motion.div
                  className="pointer-events-none absolute -inset-px rounded-xl"
                  animate={{
                    boxShadow: focused === "email"
                      ? "0 0 0 1px rgba(79, 209, 255, 0.5), 0 0 20px rgba(79, 209, 255, 0.1)"
                      : "0 0 0 1px transparent",
                  }}
                  transition={{ duration: 0.2 }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="Work email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-[#5a6a8a]"
                />
              </div>

              <div className="relative">
                <motion.div
                  className="pointer-events-none absolute -inset-px rounded-xl"
                  animate={{
                    boxShadow: focused === "company"
                      ? "0 0 0 1px rgba(79, 209, 255, 0.5), 0 0 20px rgba(79, 209, 255, 0.1)"
                      : "0 0 0 1px transparent",
                  }}
                  transition={{ duration: 0.2 }}
                />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  onFocus={() => setFocused("company")}
                  onBlur={() => setFocused(null)}
                  placeholder="Company (optional)"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-[#5a6a8a]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="cta-glow w-full rounded-xl border border-[#4FD1FF]/30 bg-gradient-to-r from-[#4FD1FF] via-[#3C5BFF] to-[#7A5CFF] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "submitting" ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Joining...
                </span>
              ) : (
                "Join the Waitlist"
              )}
            </button>
          </>
        ) : (
          /* Default/Hero variant: inline layout */
          <>
            <div className={`flex flex-col gap-3 ${isHero ? "sm:flex-row" : "sm:flex-row"}`}>
              <div className="relative flex-1">
                <motion.div
                  className="pointer-events-none absolute -inset-px rounded-xl"
                  animate={{
                    boxShadow: focused === "email"
                      ? "0 0 0 1px rgba(79, 209, 255, 0.5), 0 0 20px rgba(79, 209, 255, 0.1)"
                      : "0 0 0 1px transparent",
                  }}
                  transition={{ duration: 0.2 }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter your work email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#5a6a8a]"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="cta-glow shrink-0 rounded-xl border border-[#4FD1FF]/30 bg-gradient-to-r from-[#4FD1FF] via-[#3C5BFF] to-[#7A5CFF] px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "submitting" ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    Joining...
                  </span>
                ) : (
                  "Join the Waitlist"
                )}
              </button>
            </div>

            {/* Optional company field, shown subtly below */}
            <AnimatePresence>
              {email.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-2 overflow-hidden"
                >
                  <div className="relative">
                    <motion.div
                      className="pointer-events-none absolute -inset-px rounded-xl"
                      animate={{
                        boxShadow: focused === "company"
                          ? "0 0 0 1px rgba(79, 209, 255, 0.5), 0 0 20px rgba(79, 209, 255, 0.1)"
                          : "0 0 0 1px transparent",
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      onFocus={() => setFocused("company")}
                      onBlur={() => setFocused(null)}
                      placeholder="Company name (optional)"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#5a6a8a]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Error state */}
        <AnimatePresence>
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-sm text-rose-400"
            >
              Something went wrong. Please try again or email{" "}
              <a href="mailto:arjun@kladeai.com" className="underline hover:text-rose-300">
                arjun@kladeai.com
              </a>
            </motion.p>
          )}
        </AnimatePresence>

        <p className="mt-3 text-[11px] text-[#5a6a8a]">
          No spam. Unsubscribe anytime. We&apos;ll only email about early access.
        </p>
      </form>
    </div>
  );
}
