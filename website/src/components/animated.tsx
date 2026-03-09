"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.65, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({ value, suffix = "", className = "" }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => setDisplay(latest));
    return () => unsubscribe();
  }, [rounded]);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, { duration: 1.25, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, motionValue, value]);

  return (
    <div ref={ref} className={className}>
      {display}
      {suffix}
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
  const [pos, setPos] = useState({ x: 50, y: 50 });

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={`group relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-950/80 p-5 shadow-[0_12px_40px_-28px_rgba(129,140,248,0.7)] transition-all duration-300 hover:border-indigo-400/40 hover:shadow-[0_18px_45px_-22px_rgba(99,102,241,0.55)] ${className}`}
      style={{
        backgroundImage: `radial-gradient(420px circle at ${pos.x}% ${pos.y}%, rgba(99,102,241,0.22), transparent 40%)`,
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
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setVisibleText(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 10);

    return () => clearInterval(timer);
  }, [inView, text]);

  return (
    <p ref={ref} className={className}>
      {visibleText}
      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-indigo-300 align-middle" />
    </p>
  );
}
