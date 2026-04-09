"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Cookie consent banner.
 *
 * Lightweight, localStorage-backed, GDPR/CCPA-friendly. Stores the user's
 * choice under a versioned key so we can re-prompt if policy changes.
 *
 * When future analytics (GA4/GTM) gets wired, it should read the persisted
 * choice OR listen for the `klade-consent` CustomEvent dispatched below,
 * and only fire trackers if choice === "accepted".
 */

const STORAGE_KEY = "klade-cookie-consent-v1";

type ConsentChoice = "accepted" | "declined";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, string>>;
  }
}

function notifyConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "cookie_consent", choice });
  window.dispatchEvent(new CustomEvent("klade-consent", { detail: { choice } }));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(STORAGE_KEY);
      if (!existing) setVisible(true);
    } catch {
      // localStorage unavailable (private mode, blocked) — skip the banner
      // rather than thrashing or showing it every page load.
    }
  }, []);

  function persist(choice: ConsentChoice) {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice, at: new Date().toISOString() })
      );
    } catch {
      // ignore storage failure — we still honor the in-session choice
    }
    notifyConsent(choice);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie consent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#080c1a]/95 p-4 shadow-2xl backdrop-blur-xl md:p-5"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">We use cookies</p>
              <p className="mt-1 text-xs text-[#9aa4cb]">
                Klade uses cookies and similar technologies to understand how kladeai.com is used and to improve our product.{" "}
                <Link href="/security" className="text-[#4FD1FF] underline-offset-4 hover:underline">
                  Learn more
                </Link>
                .
              </p>
            </div>
            <div className="flex gap-2 md:flex-shrink-0">
              <button
                type="button"
                onClick={() => persist("declined")}
                className="flex-1 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-[#d8def5] transition-colors hover:bg-white/10 md:flex-none"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => persist("accepted")}
                className="flex-1 rounded-md bg-gradient-to-r from-[#4FD1FF] via-[#3C5BFF] to-[#7A5CFF] px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 md:flex-none"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
