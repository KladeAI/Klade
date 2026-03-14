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
    <section id={id} className={`relative py-16 md:py-20 lg:py-24 ${className}`}>
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
      ? "border border-[#4FD1FF]/30 bg-gradient-to-r from-[#4FD1FF] via-[#3C5BFF] to-[#7A5CFF] text-white shadow-[0_14px_40px_-20px_rgba(60,91,255,0.6)] hover:shadow-[0_22px_48px_-20px_rgba(122,92,255,0.7)]"
      : "border border-white/12 bg-white/5 text-[#d8def5] hover:border-white/20 hover:bg-white/8 hover:text-white";

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
