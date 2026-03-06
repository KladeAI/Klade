"use client";

import { useState } from "react";

const capabilities = [
  { icon: "💬", title: "Slack & Communication", desc: "Joins your Slack workspace. Responds to DMs, summarizes threads, sends reminders." },
  { icon: "📅", title: "Calendar Management", desc: "Schedules meetings, finds availability, sends morning briefings with your day ahead." },
  { icon: "✉️", title: "Email Drafting", desc: "Drafts professional emails for your review. You approve, she sends. Zero mistakes." },
  { icon: "🔍", title: "Research & Intel", desc: "Company research, competitive analysis, meeting prep docs — all before you ask." },
  { icon: "📄", title: "Document Creation", desc: "Meeting notes, memos, reports, briefs. Formatted and ready to share." },
  { icon: "✅", title: "Task Management", desc: "Tracks your to-dos, sends deadline reminders, generates weekly status reports." },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Try again.");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">cadre</span>
          <a
            href="#waitlist"
            className="bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[var(--card-border)] text-sm text-[var(--muted)]">
            Now accepting early access applications
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Your next hire<br />
            <span className="bg-gradient-to-r from-[var(--accent)] to-purple-400 bg-clip-text text-transparent">
              isn&apos;t human.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
            AI employees that plug into your team. Cheaper than humans. Always on. No HR required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#waitlist"
              className="bg-white text-black font-semibold px-8 py-3.5 rounded-lg hover:bg-zinc-200 transition-colors text-base"
            >
              Get Early Access
            </a>
            <a
              href="#sloane"
              className="border border-[var(--card-border)] font-semibold px-8 py-3.5 rounded-lg hover:bg-[var(--card)] transition-colors text-base"
            >
              Meet Sloane →
            </a>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-2xl sm:text-3xl font-semibold italic leading-snug text-zinc-300">
            &ldquo;We don&apos;t eliminate jobs. We let small firms access talent they could never afford.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Meet Sloane */}
      <section id="sloane" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-3">
              Meet your first hire
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Sloane</h2>
            <p className="mt-4 text-[var(--muted)] text-lg max-w-xl mx-auto">
              AI Executive Assistant. She joins your Slack, manages your calendar, drafts your emails, and never takes a sick day.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--success)]">
              <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
              Online now
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="p-6 rounded-xl border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)]/50 transition-colors"
              >
                <div className="text-2xl mb-3">{cap.icon}</div>
                <h3 className="font-semibold text-base mb-1">{cap.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 border-t border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight">Simple pricing</h2>
          <p className="mt-4 text-[var(--muted)] text-lg">
            Cheaper than a human. Better than a human at the tasks that don&apos;t need one.
          </p>
        </div>
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
          {/* Base */}
          <div className="p-8 rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
            <p className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">Base</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$2,500</span>
              <span className="text-[var(--muted)]">/mo</span>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">vs $6-9K/mo for a human EA</p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Unlimited requests (business hours)", "Slack + Google Workspace", "Calendar & email management", "Research & document drafting", "Weekly task reports"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-[var(--success)] mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {/* Premium */}
          <div className="p-8 rounded-2xl border-2 border-[var(--accent)] bg-[var(--card)] relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-xs font-bold px-3 py-1 rounded-full">
              POPULAR
            </div>
            <p className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">Premium</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$4,000</span>
              <span className="text-[var(--muted)]">/mo</span>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">24/7 availability + custom integrations</p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Everything in Base", "24/7 availability", "Priority response (<1 min)", "Custom tool integrations", "Dedicated onboarding specialist", "Multi-employee coordination"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-[var(--success)] mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-24 px-6 border-t border-[var(--card-border)]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tight">Get early access</h2>
          <p className="mt-4 text-[var(--muted)] text-lg">
            We&apos;re onboarding founding clients now. Join the waitlist and be first to hire Sloane.
          </p>
          {submitted ? (
            <div className="mt-8 p-6 rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]">
              <p className="font-semibold text-lg">You&apos;re on the list. 🎉</p>
              <p className="text-sm mt-1 opacity-80">We&apos;ll reach out when it&apos;s your turn.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-[var(--card)] border border-[var(--card-border)] text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {loading ? "..." : "Join Waitlist"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--card-border)]">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-[var(--muted)]">
          <span>© 2026 Cadre</span>
          <span>AI employees for modern teams</span>
        </div>
      </footer>
    </main>
  );
}
