"use client";

import { FadeIn, ProgressBar, SpotlightCard, StaggerContainer, StaggerItem } from "@/components/animated";
import { SiteShell } from "@/components/site-shell";
import { Button, Section } from "@/components/ui";
import { WaitlistForm } from "@/components/waitlist";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";

/* ===== DATA ===== */

type LeadForm = {
  name: string;
  company: string;
  email: string;
  teamSize: string;
  role: string;
  bottleneck: string;
  website: string;
  startedAt: string;
};

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

const createInitialForm = (): LeadForm => ({
  name: "", company: "", email: "", teamSize: "", role: "", bottleneck: "", website: "", startedAt: String(Date.now()),
});

const requiredFields: Array<keyof Pick<LeadForm, "name" | "company" | "email" | "teamSize" | "role" | "bottleneck">> = [
  "name", "company", "email", "teamSize", "role", "bottleneck",
];

const trustTickerItems = [
  "One bot, many specialists",
  "Models & valuations",
  "Research & memos",
  "PowerPoint-ready output",
  "Workflow automation",
  "Operations support",
  "Data organization",
  "Custom business tasks",
  "Built around your workflow",
  "Founder-led onboarding",
  "Enterprise-grade security",
  "24/7 execution coverage",
];

const capabilities = [
  { title: "Financial Models", desc: "DCFs, LBOs, comps tables — structured and cited.", icon: "📊" },
  { title: "Presentations", desc: "PowerPoint-ready decks from data to narrative.", icon: "📑" },
  { title: "Research & Memos", desc: "Deep-dive research with sources and analysis.", icon: "🔍" },
  { title: "Internal Reports", desc: "Automated reporting for stakeholders and teams.", icon: "📋" },
  { title: "Workflow Automation", desc: "Recurring processes systematized and executed.", icon: "⚙️" },
  { title: "Data Organization", desc: "Structure, clean, and surface insights from data.", icon: "🗃️" },
  { title: "Operations Support", desc: "Process management, coordination, logistics.", icon: "🔗" },
  { title: "Custom Tasks", desc: "Anything your team needs — Clay adapts.", icon: "🎯" },
];

const orchestrationSteps = [
  { label: "You ask Clay", desc: "Natural language request through one interface." },
  { label: "Clay routes", desc: "Work is dispatched to the right specialist agent." },
  { label: "Specialists execute", desc: "Dedicated sub-agents handle the task with precision." },
  { label: "Output delivered", desc: "Structured, cited, ready-to-use deliverables returned." },
];

const roiCards = [
  { title: "Less repetitive load", desc: "Free your team from rebuilding the same models, reports, and decks every week." },
  { title: "Faster turnaround", desc: "Deliverables in minutes, not days. Research, analysis, and presentations on demand." },
  { title: "Lower cost per output", desc: "Dramatically cheaper per deliverable — augments your team so they focus on judgment, not mechanical work." },
  { title: "Consistent quality", desc: "Structured, cited, format-compliant output every time — no variance." },
];

const useCases = [
  { title: "Research & Due Diligence", desc: "Company screening, market analysis, competitive intelligence." },
  { title: "Financial Analysis", desc: "Valuation models, earnings summaries, sector deep-dives." },
  { title: "Reporting & Dashboards", desc: "Recurring reports, KPI tracking, stakeholder updates." },
  { title: "Deck & Presentation Creation", desc: "IC decks, board materials, client presentations." },
  { title: "Operations & Process", desc: "Workflow coordination, data pipeline management, internal tooling." },
  { title: "Custom Internal Tasks", desc: "Whatever your team needs — Clay molds to the workflow." },
];

const clayOutputs = [
  {
    id: "dcf",
    icon: "📊",
    title: "DCF / Valuation Model",
    descriptor: "Built with assumptions + sensitivity",
  },
  {
    id: "memo",
    icon: "📝",
    title: "Investment Memo",
    descriptor: "Structured, decision-ready",
  },
  {
    id: "research",
    icon: "🔍",
    title: "Market Research",
    descriptor: "Cross-source synthesis",
  },
  {
    id: "forecast",
    icon: "📈",
    title: "Financial Forecast",
    descriptor: "Forward projections",
  },
];

const founders = [
  { name: "Adam Benoit", role: "Co-Founder", focus: "Economics, financial markets, and investment research workflows.", email: "adam@kladeai.com", image: "/founders/adam.jpg" },
  { name: "Arjun Rath", role: "Co-Founder", focus: "Product + infrastructure systems that turn analyst workflows into reliable execution.", email: "arjun@kladeai.com", image: "/founders/arjun.jpg" },
  { name: "Gavin Kim", role: "Co-Founder", focus: "Quantitative systems design and structured decision-support outputs.", email: "gavin@kladeai.com", image: "/founders/gavin.jpg" },
];

function trackEvent(eventName: string, payload?: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
}

declare global {
  interface Window { dataLayer?: Array<Record<string, string>>; }
}

/* ===== COMPONENTS ===== */

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [showVolume, setShowVolume] = useState(false);

  function toggleMute() {
    if (videoRef.current) {
      const next = !muted;
      videoRef.current.muted = next;
      setMuted(next);
      if (!next) videoRef.current.volume = volume;
    }
  }

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) { setMuted(true); videoRef.current.muted = true; }
      else if (muted) { setMuted(false); videoRef.current.muted = false; }
    }
  }

  return (
    <div className="video-container aspect-video" onMouseEnter={() => setShowVolume(true)} onMouseLeave={() => setShowVolume(false)}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster="/brand/clay-avatar.jpg"
        className="h-full w-full object-cover"
      >
        <source src="/video/klade-launch.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-[#080c1a]/40 via-transparent to-transparent" />
      
      {/* Volume controls */}
      <div className={`absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-black/60 px-2.5 py-1.5 backdrop-blur-sm transition-opacity duration-200 ${showVolume ? "opacity-100" : "opacity-0 sm:opacity-60 sm:hover:opacity-100"}`}>
        <button
          onClick={toggleMute}
          className="text-white/90 transition-colors hover:text-white"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={muted ? 0 : volume}
          onChange={handleVolume}
          className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/30 accent-white [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          aria-label="Volume"
        />
      </div>
    </div>
  );
}

/* ===== CLAY OUTPUT MODAL CONTENT ===== */

function DCFContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white">DCF Valuation — NVIDIA Corporation (NVDA)</h3>
        <p className="mt-1 text-sm text-[#9aa4cb]">Discounted cash flow model with sensitivity analysis</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-[#4FD1FF] mb-3">Revenue Projections</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="px-3 py-2 text-left text-xs text-[#9aa4cb]">Fiscal Year</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">FY2027</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">FY2028</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">FY2029</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">FY2030</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">FY2031</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="px-3 py-2 text-[#d8def5]">Revenue ($B)</td>
                <td className="px-3 py-2 text-right text-white font-medium">$156.2</td>
                <td className="px-3 py-2 text-right text-white font-medium">$189.5</td>
                <td className="px-3 py-2 text-right text-white font-medium">$221.3</td>
                <td className="px-3 py-2 text-right text-white font-medium">$249.7</td>
                <td className="px-3 py-2 text-right text-white font-medium">$274.7</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/8 bg-white/3 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-[#9aa4cb] mb-2">Key Assumptions</p>
          <ul className="space-y-1.5 text-sm text-[#d8def5]">
            <li className="flex justify-between"><span>COGS</span><span className="text-white">38% of revenue</span></li>
            <li className="flex justify-between"><span>OpEx</span><span className="text-white">12% → 13%</span></li>
            <li className="flex justify-between"><span>WACC</span><span className="text-white">10.5%</span></li>
            <li className="flex justify-between"><span>Terminal Growth</span><span className="text-white">3.0%</span></li>
          </ul>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/3 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-[#9aa4cb] mb-2">Valuation Output</p>
          <ul className="space-y-1.5 text-sm text-[#d8def5]">
            <li className="flex justify-between"><span>Terminal Value</span><span className="text-white font-medium">$4.82T</span></li>
            <li className="flex justify-between"><span>Enterprise Value</span><span className="text-white font-medium">$3.61T</span></li>
            <li className="flex justify-between"><span>Equity Value / Share</span><span className="text-[#4FD1FF] font-semibold">$147.82</span></li>
          </ul>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-[#4FD1FF] mb-3">Sensitivity Analysis — Equity Value per Share</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="px-3 py-2 text-left text-xs text-[#9aa4cb]">WACC ↓ / Growth →</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">2.0%</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">2.5%</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">3.0%</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">3.5%</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">4.0%</th>
              </tr>
            </thead>
            <tbody>
              {[
                { wacc: "9.0%", values: ["$168.41", "$178.93", "$191.20", "$205.87", "$223.74"] },
                { wacc: "9.5%", values: ["$155.28", "$164.30", "$174.73", "$187.02", "$201.68"] },
                { wacc: "10.0%", values: ["$143.62", "$151.39", "$160.27", "$170.64", "$183.01"] },
                { wacc: "10.5%", values: ["$133.21", "$139.94", "$147.82", "$156.99", "$167.78"] },
                { wacc: "11.0%", values: ["$123.89", "$129.73", "$136.47", "$144.32", "$153.55"] },
                { wacc: "11.5%", values: ["$115.52", "$120.60", "$126.39", "$133.07", "$140.87"] },
                { wacc: "12.0%", values: ["$107.98", "$112.40", "$117.39", "$123.07", "$129.59"] },
              ].map((row) => (
                <tr key={row.wacc} className={`border-b border-white/5 ${row.wacc === "10.5%" ? "bg-[#4FD1FF]/5" : ""}`}>
                  <td className="px-3 py-2 text-[#d8def5] font-medium">{row.wacc}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className={`px-3 py-2 text-right ${row.wacc === "10.5%" && i === 2 ? "text-[#4FD1FF] font-semibold" : "text-white"}`}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-[#5a6a8a]">Clay Execution Engine · Generated moments ago</p>
    </div>
  );
}

function MemoContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white">Investment Memo — Palantir Technologies (PLTR)</h3>
        <p className="mt-1 text-sm text-[#9aa4cb]">Structured investment thesis and recommendation</p>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/3 p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-[#4FD1FF] mb-2">Company Overview</p>
        <p className="text-sm text-[#d8def5] leading-relaxed">
          Palantir Technologies is an AI/ML platform company serving government and commercial enterprises. Founded in 2003 and headquartered in Denver, CO,
          Palantir builds software that enables organizations to integrate, manage, and derive insight from large-scale data operations.
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-[#4FD1FF] mb-3">Business Model</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/8 bg-white/3 p-4">
            <p className="text-sm font-medium text-white">Government Segment</p>
            <p className="text-2xl font-semibold text-white mt-1">56%</p>
            <p className="text-xs text-[#9aa4cb]">of total revenue</p>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/3 p-4">
            <p className="text-sm font-medium text-white">Commercial Segment</p>
            <p className="text-2xl font-semibold text-white mt-1">44%</p>
            <p className="text-xs text-[#9aa4cb]">of total revenue — AIP platform driving expansion</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-[#4FD1FF] mb-3">Key Growth Drivers</p>
        <div className="space-y-2">
          {[
            { metric: "AIP Adoption", detail: "Accelerating across both government and commercial verticals" },
            { metric: "US Commercial Rev", detail: "+70% YoY growth driven by enterprise AI demand" },
            { metric: "Net Dollar Retention", detail: "118% — strong expansion within existing accounts" },
            { metric: "Rule of 40 Score", detail: "68 — significantly above the benchmark for high-quality SaaS" },
          ].map((d) => (
            <div key={d.metric} className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/2 px-4 py-2.5">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4FD1FF]" />
              <div>
                <p className="text-sm font-medium text-white">{d.metric}</p>
                <p className="text-xs text-[#9aa4cb]">{d.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-rose-400/80 mb-3">Key Risks</p>
        <ul className="space-y-1.5 text-sm text-[#d8def5]">
          <li className="flex items-start gap-2"><span className="mt-0.5 text-rose-400/60">▸</span>Government contract concentration risk</li>
          <li className="flex items-start gap-2"><span className="mt-0.5 text-rose-400/60">▸</span>Valuation premium at 85x forward P/E</li>
          <li className="flex items-start gap-2"><span className="mt-0.5 text-rose-400/60">▸</span>Competition from hyperscalers (AWS, Azure, GCP)</li>
        </ul>
      </div>

      <div className="rounded-xl border border-[#4FD1FF]/20 bg-[#4FD1FF]/5 p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-[#4FD1FF] mb-1">Recommendation</p>
        <p className="text-lg font-semibold text-white">ACCUMULATE</p>
        <p className="text-sm text-[#d8def5]">at current levels · 18-month price target: <span className="text-[#4FD1FF] font-semibold">$115</span></p>
      </div>

      <p className="text-xs text-[#5a6a8a]">Clay Execution Engine · Generated moments ago</p>
    </div>
  );
}

function ResearchContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white">Market Research — Enterprise AI Infrastructure</h3>
        <p className="mt-1 text-sm text-[#9aa4cb]">2024–2030 market sizing and competitive landscape</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/8 bg-white/3 p-4 text-center">
          <p className="text-xs text-[#9aa4cb]">Market Size (2024)</p>
          <p className="text-3xl font-semibold text-white mt-1">$189B</p>
        </div>
        <div className="rounded-xl border border-[#4FD1FF]/20 bg-[#4FD1FF]/5 p-4 text-center">
          <p className="text-xs text-[#4FD1FF]">Projected (2030)</p>
          <p className="text-3xl font-semibold text-white mt-1">$827B</p>
          <p className="text-xs text-[#9aa4cb] mt-0.5">28% CAGR</p>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-[#4FD1FF] mb-3">Key Trends</p>
        <div className="grid gap-2 md:grid-cols-2">
          {[
            { trend: "Inference Cost Decline", detail: "~40% per year reduction in inference costs" },
            { trend: "On-Prem AI Growth", detail: "On-premise AI deployments growing 3x" },
            { trend: "Agent Frameworks", detail: "AI agent frameworks maturing rapidly across enterprise" },
            { trend: "Regulatory Clarity", detail: "Frameworks crystallizing in EU and US markets" },
          ].map((t) => (
            <div key={t.trend} className="rounded-lg border border-white/8 bg-white/3 p-3">
              <p className="text-sm font-medium text-white">{t.trend}</p>
              <p className="text-xs text-[#9aa4cb] mt-0.5">{t.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-[#4FD1FF] mb-3">Competitive Landscape</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="px-3 py-2 text-left text-xs text-[#9aa4cb]">Company</th>
                <th className="px-3 py-2 text-left text-xs text-[#9aa4cb]">Segment</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">Market Share</th>
              </tr>
            </thead>
            <tbody>
              {[
                { company: "NVIDIA", segment: "GPU / Compute", share: "78%" },
                { company: "AWS Bedrock", segment: "Cloud AI", share: "31%" },
                { company: "Microsoft Azure AI", segment: "Cloud AI", share: "24%" },
                { company: "Google Vertex", segment: "Cloud AI", share: "18%" },
              ].map((c) => (
                <tr key={c.company} className="border-b border-white/5">
                  <td className="px-3 py-2 text-white font-medium">{c.company}</td>
                  <td className="px-3 py-2 text-[#d8def5]">{c.segment}</td>
                  <td className="px-3 py-2 text-right text-white">{c.share}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-[#9aa4cb]">Emerging challengers: Groq, Cerebras, AMD MI300X</p>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/3 p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-[#9aa4cb] mb-2">Sources</p>
        <p className="text-xs text-[#9aa4cb]">Gartner · IDC · Company filings (10-K, 10-Q) · CB Insights</p>
      </div>

      <p className="text-xs text-[#5a6a8a]">Clay Execution Engine · Generated moments ago</p>
    </div>
  );
}

function ForecastContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white">Financial Forecast — Datadog, Inc. (DDOG)</h3>
        <p className="mt-1 text-sm text-[#9aa4cb]">Forward revenue and margin projections</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-[#4FD1FF] mb-3">Revenue Forecast</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="px-3 py-2 text-left text-xs text-[#9aa4cb]">Metric</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">2024A</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">2025E</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">2026E</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">2027E</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="px-3 py-2 text-[#d8def5]">Revenue ($B)</td>
                <td className="px-3 py-2 text-right text-white font-medium">$2.84</td>
                <td className="px-3 py-2 text-right text-white font-medium">$3.52</td>
                <td className="px-3 py-2 text-right text-white font-medium">$4.29</td>
                <td className="px-3 py-2 text-right text-white font-medium">$5.15</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-3 py-2 text-[#d8def5]">Revenue Growth</td>
                <td className="px-3 py-2 text-right text-[#9aa4cb]">—</td>
                <td className="px-3 py-2 text-right text-white">24%</td>
                <td className="px-3 py-2 text-right text-white">22%</td>
                <td className="px-3 py-2 text-right text-white">20%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-[#4FD1FF] mb-3">Margin Profile</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="px-3 py-2 text-left text-xs text-[#9aa4cb]">Margin</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">2024A</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">2025E</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">2026E</th>
                <th className="px-3 py-2 text-right text-xs text-[#9aa4cb]">2027E</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="px-3 py-2 text-[#d8def5]">Gross Margin</td>
                <td className="px-3 py-2 text-right text-white">79.8%</td>
                <td className="px-3 py-2 text-right text-white">80.5%</td>
                <td className="px-3 py-2 text-right text-white">81.0%</td>
                <td className="px-3 py-2 text-right text-white">81.5%</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-3 py-2 text-[#d8def5]">Operating Margin</td>
                <td className="px-3 py-2 text-right text-white">22.1%</td>
                <td className="px-3 py-2 text-right text-white">24.8%</td>
                <td className="px-3 py-2 text-right text-white">27.0%</td>
                <td className="px-3 py-2 text-right text-white">29.5%</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-3 py-2 text-[#d8def5]">FCF Margin</td>
                <td className="px-3 py-2 text-right text-[#4FD1FF]">30.2%</td>
                <td className="px-3 py-2 text-right text-[#4FD1FF]">32.5%</td>
                <td className="px-3 py-2 text-right text-[#4FD1FF]">34.0%</td>
                <td className="px-3 py-2 text-right text-[#4FD1FF]">35.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-[#4FD1FF] mb-3">Key Insights</p>
        <div className="space-y-2">
          {[
            "Infrastructure monitoring consolidation driving ASP expansion",
            "AI-native observability features creating new revenue stream",
            "International expansion (currently 28% of rev) provides growth runway",
          ].map((insight) => (
            <div key={insight} className="flex items-start gap-2 text-sm text-[#d8def5]">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4FD1FF]" />
              {insight}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#5a6a8a]">Clay Execution Engine · Generated moments ago</p>
    </div>
  );
}

function ClayOutputModal({ outputId, onClose }: { outputId: string; onClose: () => void }) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const contentMap: Record<string, React.ReactNode> = {
    dcf: <DCFContent />,
    memo: <MemoContent />,
    research: <ResearchContent />,
    forecast: <ForecastContent />,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0f1e] p-6 md:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#9aa4cb] transition-colors hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
        {contentMap[outputId]}
      </motion.div>
    </motion.div>
  );
}

function ClayProducesSection() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <>
      <Section className="py-6">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">Output examples</p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-5xl">Clay produces:</h2>
          <p className="mt-3 max-w-3xl text-[#9aa4cb]">
            Autonomously generated outputs across research, modeling, and reporting
          </p>
        </FadeIn>
        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {clayOutputs.map((output, i) => (
            <FadeIn key={output.id} delay={i * 0.06}>
              <motion.button
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => setActiveModal(output.id)}
                className="w-full rounded-2xl border border-white/8 bg-white/4 p-5 text-left transition-all duration-300 hover:border-[#4FD1FF]/25 hover:bg-white/6"
              >
                <span className="text-2xl">{output.icon}</span>
                <p className="mt-3 text-sm font-medium text-white">{output.title}</p>
                <p className="mt-1.5 text-xs text-[#9aa4cb]">{output.descriptor}</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1FF]" />
                  <span className="text-[10px] text-[#4FD1FF]">Generated by Clay</span>
                </div>
              </motion.button>
            </FadeIn>
          ))}
        </div>
      </Section>

      <AnimatePresence>
        {activeModal && (
          <ClayOutputModal outputId={activeModal} onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ===== PAGE ===== */

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<LeadForm>(() => createInitialForm());
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const completedFields = useMemo(
    () => requiredFields.filter((key) => form[key].trim().length > 0).length,
    [form]
  );
  const completion = Math.round((completedFields / requiredFields.length) * 100);

  useEffect(() => { trackEvent("landing_view", { source: "homepage_v3" }); }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("form_submit_attempt", { source: "homepage_v3" });
    setStatus("submitting");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("submit-failed");
      setStatus("success");
      setForm(createInitialForm());
      trackEvent("qualified_lead", { source: "homepage_v3" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <SiteShell>
      {/* ===== HERO ===== */}
      <Section className="pt-2 md:pt-4">
        <div className="relative overflow-hidden rounded-xl border border-white/8 bg-gradient-to-b from-[#0d1225] to-[#080c1a] px-5 py-8 md:px-8 md:py-10">
          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-[#4FD1FF]/8 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-[#7A5CFF]/8 blur-3xl" />

          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4FD1FF]/25 bg-[#4FD1FF]/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#4FD1FF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1FF] animate-pulse" />
              Private Beta
            </div>
            <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-[1.05] text-white md:text-6xl lg:text-7xl">
              Clay molds to your firm.<br />
              <span className="klade-gradient-text">Not the other way around.</span>
            </h1>
            <p className="mt-5 max-w-3xl text-lg text-[#b3bedf] md:text-xl">
              Every deployment is personalized. Clay learns your workflows, adapts to your terminology, and builds custom skills unique to your firm.
              Models, decks, research, and more — handled by specialized agents shaped around how your team actually works.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/waitlist" eventName="hero_cta_click" eventPayload={{ placement: "hero", cta: "join_waitlist" }}>
                Join the Waitlist
              </Button>
              <Button href="https://calendly.com/d/cyj7-xvw-rrg/new-meeting" variant="secondary" eventName="hero_cta_click" eventPayload={{ placement: "hero", cta: "book_demo" }}>
                Book a Demo
              </Button>
              <Button href="#meet-clay" variant="secondary" eventName="hero_cta_click" eventPayload={{ placement: "hero", cta: "meet_clay" }}>
                Meet Clay ↓
              </Button>
            </div>

            {/* Capability chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["Models & Valuations", "Research & Memos", "Presentations", "Workflow Automation", "Operations", "Custom Tasks"].map((chip) => (
                <span key={chip} className="rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs text-[#9aa4cb]">
                  {chip}
                </span>
              ))}
            </div>
          </FadeIn>

          {/* Hero video + Clay workspace preview */}
          <FadeIn delay={0.1} className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
            <div id="meet-clay" className="scroll-mt-28">
              <HeroVideo />
            </div>
            <div className="space-y-3">
              <div className="klade-gradient-border rounded-2xl bg-[#080c1a] p-4 text-sm text-[#d8def5]">
                <div className="flex items-center gap-2">
                  <Image src="/brand/clay-avatar.jpg" alt="Clay" width={24} height={24} className="rounded-full" />
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#9aa4cb]">Clay workspace</p>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="ml-auto max-w-lg rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90">
                    Build a DCF model for NVIDIA and flag key growth drivers.
                  </p>
                  <p className="max-w-xl rounded-xl border border-[#4FD1FF]/20 bg-[#4FD1FF]/8 px-3 py-2 text-[#d8def5]">
                    ✓ DCF complete with cited assumptions, risk table, and deck-ready summary.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Research", detail: "Company deep-dive" },
                  { label: "Memo", detail: "Investment thesis" },
                  { label: "Deck", detail: "8-slide summary" },
                ].map((card) => (
                  <div key={card.label} className="surface-glass rounded-xl px-3 py-2.5 text-center">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#9aa4cb]">{card.label}</p>
                    <p className="mt-0.5 text-xs text-[#d8def5]">{card.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* ===== JENSEN HUANG NVIDIA QUOTE ===== */}
      <Section className="py-6 md:py-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-[#0d1225] via-[#0a0f2c] to-[#10162f] px-6 py-10 md:px-12 md:py-14">
            {/* Decorative gradient orbs */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#76b900]/8 blur-[80px]" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[#76b900]/6 blur-[80px]" />
            
            <div className="relative mx-auto max-w-4xl text-center">
              {/* Large quote mark */}
              <span className="block text-6xl leading-none text-[#76b900]/30 md:text-8xl">&ldquo;</span>
              
              <blockquote className="mt-2 text-2xl font-semibold leading-snug text-white md:text-3xl lg:text-4xl">
                Every company in the world today needs to have an OpenClaw strategy, an agentic system strategy. This is the new computer.
              </blockquote>
              
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-[#76b900]/40" />
                <div>
                  <p className="text-sm font-semibold text-white">Jensen Huang</p>
                  <p className="text-xs text-[#9aa4cb]">CEO of NVIDIA · GTC 2026</p>
                </div>
                <div className="h-px w-8 bg-[#76b900]/40" />
              </div>
              
              <p className="mt-1 text-[10px] text-[#5a6a8a]">Source: Business Insider, March 2026</p>
              
              <div className="mx-auto mt-8 h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <p className="mt-6 text-sm text-[#9aa4cb]">
                Klade builds on OpenClaw to deploy AI analysts for professional firms.
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ===== TRUST TICKER ===== */}
      <Section className="py-2">
        <div className="rounded-2xl border border-white/6 bg-white/3 p-3">
          <div className="ticker-row">
            <div className="ticker-track">
              {[...trustTickerItems, ...trustTickerItems].map((item, i) => (
                <span key={`${item}-${i}`} className="ticker-pill">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ===== HOW CLAY WORKS — ORCHESTRATION ===== */}
      <Section id="how-it-works" className="pt-4">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">How Clay works</p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-5xl">
            One interface. Many agents behind it.
          </h2>
          <p className="mt-3 max-w-3xl text-[#9aa4cb]">
            Clay receives your request, routes it to the right specialist sub-agent, and delivers structured output — all through a single, seamless experience.
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {orchestrationSteps.map((step, i) => (
            <FadeIn key={step.label} delay={i * 0.06}>
              <div className="surface-card rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#4FD1FF]/25 bg-[#4FD1FF]/10 text-sm font-semibold text-[#4FD1FF]">
                  {i + 1}
                </div>
                <p className="mt-3 text-sm font-medium text-white">{step.label}</p>
                <p className="mt-1.5 text-xs text-[#9aa4cb]">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ===== CAPABILITIES ===== */}
      <Section id="capabilities" className="pt-6">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">Capabilities</p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-5xl">
            One bot. Many specialists.
          </h2>
          <p className="mt-3 max-w-3xl text-[#9aa4cb]">
            Clay orchestrates specialized agents across every function your team needs. Your firm does something unique? We build custom skills for it. No two deployments are the same.
          </p>
        </FadeIn>
        <StaggerContainer className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap) => (
            <StaggerItem key={cap.title}>
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
                className="surface-card rounded-2xl p-5 transition-all duration-300"
              >
                <span className="text-2xl">{cap.icon}</span>
                <p className="mt-2 text-sm font-medium text-white">{cap.title}</p>
                <p className="mt-1.5 text-xs text-[#9aa4cb]">{cap.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      {/* ===== USE CASES ===== */}
      <Section className="pt-6">
        <FadeIn>
          <div className="rounded-3xl border border-white/8 bg-white/3 p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">Use cases</p>
            <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
              Clay molds to your firm. Not the other way around.
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-[#9aa4cb]">
              One system, many specialists — shaped around the way your business actually operates.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {useCases.map((uc) => (
                <div key={uc.title} className="rounded-xl border border-white/8 bg-white/4 p-4 transition-colors hover:border-white/12">
                  <p className="text-sm font-medium text-white">{uc.title}</p>
                  <p className="mt-1.5 text-xs text-[#9aa4cb]">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ===== ROI ===== */}
      <Section id="roi-estimator" className="pt-6 scroll-mt-28">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">ROI</p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-5xl">
            Why teams switch to Klade.
          </h2>
          <p className="mt-3 max-w-3xl text-[#9aa4cb]">
            Handles the mechanical work so your team focuses on judgment — augmenting your existing team with AI that scales across functions.
          </p>
        </FadeIn>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {/* Before / After */}
          <FadeIn className="rounded-2xl border border-white/8 bg-white/3 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#9aa4cb]">Without Klade</p>
            <ul className="mt-3 space-y-2 text-sm text-[#b3bedf]">
              <li className="flex items-start gap-2"><span className="mt-0.5 text-red-400">✕</span> Hours spent on repetitive models and reports</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-red-400">✕</span> Bandwidth ceiling limits what your team can take on</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-red-400">✕</span> Inconsistent deliverable quality</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-red-400">✕</span> One tool per function, constant switching</li>
            </ul>
          </FadeIn>
          <FadeIn delay={0.05} className="rounded-2xl border border-[#4FD1FF]/20 bg-[#4FD1FF]/5 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#4FD1FF]">With Klade</p>
            <ul className="mt-3 space-y-2 text-sm text-[#d8def5]">
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#4FD1FF]">✓</span> Deliverables in minutes, not days</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#4FD1FF]">✓</span> Frees analysts for higher-value work</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#4FD1FF]">✓</span> Structured, cited, format-compliant every time</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-[#4FD1FF]">✓</span> One AI teammate handles it all</li>
            </ul>
          </FadeIn>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {roiCards.map((card) => (
            <FadeIn key={card.title} className="surface-card rounded-xl p-4">
              <p className="text-sm font-medium text-white">{card.title}</p>
              <p className="mt-1.5 text-xs text-[#9aa4cb]">{card.desc}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ===== CLAY PRODUCES ===== */}
      <ClayProducesSection />

      {/* ===== COMPARISON ===== */}
      <Section className="pt-4">
        <FadeIn>
          <div className="rounded-3xl border border-white/8 bg-white/3 p-6 md:p-8">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Traditional approach vs Clay.</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#9aa4cb]">Traditional hire</p>
                <ul className="mt-3 space-y-2 text-sm text-[#b3bedf]">
                  <li>• ~$150,000+ annual compensation</li>
                  <li>• Limited working hours</li>
                  <li>• One person&apos;s bandwidth ceiling</li>
                  <li>• Manual workflow switching</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-[#4FD1FF]/25 bg-gradient-to-br from-[#3C5BFF]/12 to-[#7A5CFF]/12 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#4FD1FF]">Clay — your AI teammate</p>
                <ul className="mt-3 space-y-2 text-sm text-[#d8def5]">
                  <li>• Dramatically lower cost-per-output</li>
                  <li>• 24/7 execution coverage</li>
                  <li>• Parallel workflows, no burnout</li>
                  <li>• One interface for every function</li>
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ===== SECURITY ===== */}
      <Section id="security" className="pt-4">
        <FadeIn>
          <div className="rounded-3xl border border-white/8 bg-white/3 p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">Security</p>
            <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Built for teams that care about control.</h2>
            <p className="mt-3 max-w-3xl text-sm text-[#9aa4cb]">Secure-by-design architecture, workflow-scoped access, and visibility-first deployment posture from day one.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                "Least-privilege integration model",
                "No client-side secrets",
                "Audit-log ready event patterns",
                "Founder-led deployment accountability",
              ].map((item) => (
                <p key={item} className="rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[#d8def5]">{item}</p>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ===== ONBOARDING ===== */}
      <Section className="pt-4">
        <FadeIn>
          <div className="rounded-3xl border border-[#4FD1FF]/15 bg-gradient-to-br from-[#0d1225] to-[#10162f] p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">Onboarding</p>
            <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Founder-led onboarding. Every time.</h2>
            <p className="mt-3 max-w-3xl text-sm text-[#9aa4cb]">
              We learn your workflows, build custom skills for your firm, and stay with you. No hand-off to a support queue — the people who built Clay are the ones deploying it for your team.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                { step: "01", title: "We learn your workflows", desc: "Deep-dive into how your team actually operates day-to-day." },
                { step: "02", title: "We build custom skills", desc: "Tailored agents for the tasks unique to your firm." },
                { step: "03", title: "We stay with you", desc: "Ongoing support and iteration as your needs evolve." },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border border-white/8 bg-white/4 p-4">
                  <p className="text-xs font-medium text-[#4FD1FF]">{item.step}</p>
                  <p className="mt-2 text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1.5 text-xs text-[#9aa4cb]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ===== FOUNDERS ===== */}
      <Section id="founders" className="pt-6">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4FD1FF]">Founding team</p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-5xl">Built by operators, not outsiders.</h2>
          <p className="mt-3 max-w-3xl text-[#9aa4cb]">
            Three founders operating inside the workflows we&apos;re automating. Founder-led through every step of onboarding and deployment.
          </p>
        </FadeIn>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {founders.map((f, i) => (
            <FadeIn key={f.name} delay={i * 0.05}>
              <div className="group rounded-2xl border border-white/8 bg-white/4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#4FD1FF]/25">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/8">
                  <Image
                    src={f.image}
                    alt={`${f.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-[#9aa4cb]">{f.role}</p>
                <h3 className="mt-1 text-xl font-semibold text-white">{f.name}</h3>
                <p className="mt-2 text-sm text-[#b3bedf]">{f.focus}</p>
                <Link href={`mailto:${f.email}`} className="mt-3 inline-block text-sm text-[#4FD1FF] transition-colors hover:text-white">
                  {f.email} →
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ===== WAITLIST + CTA BANNER ===== */}
      <Section className="py-3">
        <FadeIn>
          <div className="rounded-3xl border border-[#4FD1FF]/15 bg-gradient-to-r from-[#0a0f2c] via-[#10162f] to-[#0a0f2c] p-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold text-white md:text-4xl">Ready to meet your AI teammate?</h2>
              <p className="mt-3 text-[#b3bedf]">Join the waitlist for early access. Founder-led onboarding. Fast response.</p>

              {/* Waitlist form — primary CTA */}
              <div className="mt-6">
                <WaitlistForm variant="hero" />
              </div>

              {/* Book a Demo — secondary CTA */}
              <div className="mt-5 flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-white/10" />
                <span className="text-xs text-[#5a6a8a]">or</span>
                <div className="h-px w-8 bg-white/10" />
              </div>
              <div className="mt-4">
                <Button href="https://calendly.com/d/cyj7-xvw-rrg/new-meeting" variant="secondary" eventName="cta_click" eventPayload={{ placement: "banner", cta: "book_demo" }}>
                  Book a Demo Instead
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ===== LEAD FORM ===== */}
      <Section id="lead-form" className="scroll-mt-28 pt-4">
        <FadeIn>
          <div className="rounded-3xl border border-white/8 bg-white/4 p-6 md:p-8">
            <h2 className="text-3xl font-semibold text-white">Tell us about your team.</h2>
            <p className="mt-2 text-sm text-[#9aa4cb]">Share your bottleneck and we&apos;ll return a practical rollout plan.</p>

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit} aria-busy={status === "submitting"}>
              <fieldset className="contents" disabled={status === "submitting"}>
                <label className="hidden" aria-hidden="true">
                  Website
                  <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} />
                </label>
                <input type="hidden" name="startedAt" value={form.startedAt} readOnly />

                {[
                  { key: "name" as const, label: "Name", type: "text" },
                  { key: "company" as const, label: "Company", type: "text" },
                  { key: "email" as const, label: "Work Email", type: "email" },
                ].map((field) => (
                  <label key={field.key} className="grid gap-2 text-sm text-[#b3bedf]">
                    {field.label}
                    <input
                      required
                      type={field.type}
                      value={form[field.key]}
                      onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition-colors focus:border-[#4FD1FF]/50 placeholder:text-[#5a6a8a]"
                    />
                  </label>
                ))}

                <label className="grid gap-2 text-sm text-[#b3bedf]">
                  Team Size
                  <select
                    required
                    value={form.teamSize}
                    onChange={(e) => setForm((p) => ({ ...p, teamSize: e.target.value }))}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition-colors focus:border-[#4FD1FF]/50"
                  >
                    <option value="">Select</option>
                    <option value="1-5">1-5</option>
                    <option value="6-15">6-15</option>
                    <option value="16-40">16-40</option>
                    <option value="41-100">41-100</option>
                    <option value="100+">100+</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm text-[#b3bedf] md:col-span-2">
                  Role
                  <input
                    required
                    value={form.role}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition-colors focus:border-[#4FD1FF]/50"
                  />
                </label>

                <label className="grid gap-2 text-sm text-[#b3bedf] md:col-span-2">
                  What does your team need help with?
                  <textarea
                    required
                    rows={4}
                    value={form.bottleneck}
                    onChange={(e) => setForm((p) => ({ ...p, bottleneck: e.target.value }))}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition-colors focus:border-[#4FD1FF]/50"
                  />
                </label>

                <div className="md:col-span-2">
                  <div className="rounded-xl border border-white/8 bg-white/3 p-3">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#9aa4cb]">
                      <span>Form completion</span>
                      <span>{completion}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#4FD1FF] via-[#3C5BFF] to-[#7A5CFF]"
                        initial={{ width: 0 }}
                        animate={{ width: `${completion}%` }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={status === "submitting" || completion < 100}
                    className="cta-glow inline-flex items-center justify-center rounded-xl border border-[#4FD1FF]/30 bg-gradient-to-r from-[#4FD1FF] via-[#3C5BFF] to-[#7A5CFF] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === "submitting" ? "Submitting..." : "Submit request"}
                  </button>
                </div>

                <div className="md:col-span-2" role="status" aria-live="polite">
                  {status === "success" && <p className="text-sm text-emerald-400">Request submitted. A founder will follow up within 24 hours.</p>}
                  {status === "error" && <p className="text-sm text-rose-400">Something failed. Please email arjun@kladeai.com directly.</p>}
                </div>
              </fieldset>
            </form>

            {/* Founder contact strip */}
            <div className="mt-6 flex flex-wrap gap-4 border-t border-white/8 pt-4">
              {founders.map((f) => (
                <Link key={f.name} href={`mailto:${f.email}`} className="text-sm text-[#9aa4cb] transition-colors hover:text-[#4FD1FF]">
                  {f.email}
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>
    </SiteShell>
  );
}
