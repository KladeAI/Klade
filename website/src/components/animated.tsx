"use client";

import { animate, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

type ProgressBarProps = {
  label: string;
  value: number;
  suffix?: string;
  className?: string;
};

type MarqueeStripProps = {
  items: string[];
  className?: string;
};

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.65, ease: "easeOut", delay: reduceMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({ value, suffix = "", className = "" }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => setDisplay(latest));
    return () => unsubscribe();
  }, [rounded]);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration: 1.25, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, motionValue, reduceMotion, value]);

  return (
    <div ref={ref} className={className}>
      {display}
      {suffix}
    </div>
  );
}

export function ProgressBar({ label, value, suffix = "%", className = "" }: ProgressBarProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduceMotion = useReducedMotion();
  const width = Math.min(100, Math.max(0, value));

  return (
    <div ref={ref} className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-zinc-400">
        <span>{label}</span>
        <span className="text-zinc-300">{value}{suffix}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-300 via-indigo-200 to-white"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${width}%` : "0%" }}
          transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function StaggerContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
      }}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${x}% ${y}%, rgba(99,102,241,0.22), transparent 40%)`;

  return (
    <motion.div
      onMouseMove={(e) => {
        if (reduceMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - rect.left) / rect.width) * 100);
        y.set(((e.clientY - rect.top) / rect.height) * 100);
      }}
      onMouseLeave={() => {
        x.set(50);
        y.set(50);
      }}
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-950/80 p-5 shadow-[0_12px_40px_-28px_rgba(129,140,248,0.7)] transition-all duration-300 hover:border-indigo-400/40 hover:shadow-[0_18px_45px_-22px_rgba(99,102,241,0.55)] ${className}`}
      style={{
        backgroundImage: reduceMotion ? "none" : spotlight,
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-indigo-400/15" />
      {children}
    </motion.div>
  );
}

export function TypingText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();

  return (
    <motion.p
      ref={ref}
      className={className}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
      animate={inView ? { opacity: 1, y: 0 } : reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
    >
      {text}
      {!reduceMotion && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-indigo-300 align-middle" />}
    </motion.p>
  );
}

export function MarqueeStrip({ items, className = "" }: MarqueeStripProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {items.map((item) => (
          <span key={item} className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300">
            {item}
          </span>
        ))}
      </div>
    );
  }

  const loopItems = [...items, ...items];

  return (
    <div className={`marquee-shell ${className}`}>
      <div className="marquee-track">
        {loopItems.map((item, index) => (
          <span key={`${item}-${index}`} className="marquee-chip">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
