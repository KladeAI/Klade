"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type ContainerProps = { children: ReactNode; className?: string };

export function Container({ children, className = "" }: ContainerProps) {
  return <div className={`mx-auto w-full max-w-6xl px-6 lg:px-8 ${className}`}>{children}</div>;
}

type SectionProps = { id?: string; children: ReactNode; className?: string };

export function Section({ id, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`relative py-24 md:py-28 lg:py-32 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  eventName?: string;
  eventPayload?: Record<string, string>;
  className?: string;
};

function trackEvent(eventName: string, payload?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const event = { event: eventName, ...payload };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, string>>;
  }
}

export function Button({ href, children, variant = "primary", eventName, eventPayload, className = "" }: ButtonProps) {
  const styles =
    variant === "primary"
      ? "border border-indigo-300/20 bg-gradient-to-r from-white to-indigo-100 text-black shadow-[0_0_24px_rgba(99,102,241,0.35)] hover:shadow-[0_0_38px_rgba(129,140,248,0.45)]"
      : "border border-zinc-700/90 bg-zinc-900/85 text-zinc-100 hover:border-indigo-400/50 hover:text-white";

  const onClick = () => {
    if (eventName) {
      trackEvent(eventName, eventPayload);
    }

    if (eventPayload?.cta?.includes("book")) {
      trackEvent("calendar_click", { placement: eventPayload.placement ?? "unknown", cta: eventPayload.cta });
    }
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.03] ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}
