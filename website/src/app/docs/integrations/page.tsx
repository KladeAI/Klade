"use client";

import { FadeIn } from "@/components/animated";
import { DocsCallout, DocsHeading, DocsSubheading, DocsText, FeatureCard, TableOfContents } from "@/components/docs";
import { Button } from "@/components/ui";

const tocItems = [
  { id: "communication", label: "Communication Platforms" },
  { id: "data-sources", label: "Data Sources" },
  { id: "premium", label: "Premium Connectors" },
];

export default function IntegrationsPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4fd1ff]">Connections</p>
          <DocsHeading className="mt-4">Integrations</DocsHeading>
          <DocsText className="mt-4 text-lg">
            Clay connects where your team works. Submit requests and receive deliverables through
            the platforms you already use — no new tools to learn.
          </DocsText>
        </FadeIn>

        <FadeIn delay={0.05}>
          <DocsSubheading id="communication">Communication Platforms</DocsSubheading>
          <DocsText>
            Clay meets your team where they already work. Connect through any of the supported
            platforms and start making requests immediately.
          </DocsText>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <FeatureCard icon="💬" title="Slack" description="Direct messages and dedicated channels for team-wide Clay access." />
            <FeatureCard icon="🎮" title="Discord" description="Server-based deployment with role-scoped access controls." />
            <FeatureCard icon="✈️" title="Telegram" description="Direct bot interface for fast, mobile-friendly access to Clay." />
          </div>
          <DocsCallout type="tip">
            Choose one platform or connect multiple — Clay maintains context across all connected
            channels while keeping each team&apos;s data isolated.
          </DocsCallout>
        </FadeIn>

        <FadeIn delay={0.1}>
          <DocsSubheading id="data-sources">Data Sources</DocsSubheading>
          <DocsText>
            Clay pulls from authoritative financial data sources to power its analysis. Every data
            point is sourced and traceable.
          </DocsText>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { icon: "🏛️", title: "SEC EDGAR", desc: "Direct access to SEC filings, financial statements, and regulatory disclosures." },
              { icon: "📈", title: "Market Data Feeds", desc: "Real-time and historical market data for pricing, volume, and technical analysis." },
              { icon: "🔗", title: "Financial APIs", desc: "Structured data from major financial data providers for fundamental analysis." },
              { icon: "📰", title: "News & Research", desc: "Curated news feeds and research databases for market intelligence and context." },
            ].map((item) => (
              <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.desc} />
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <DocsSubheading id="premium">Premium Connectors</DocsSubheading>
          <DocsText>
            For teams with existing data terminal subscriptions, Clay supports premium connector
            integrations that leverage your existing data access.
          </DocsText>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { name: "Bloomberg", desc: "Terminal data integration for real-time analytics" },
              { name: "FactSet", desc: "Comprehensive financial data and analytics" },
              { name: "CapIQ", desc: "S&P Capital IQ data connectivity" },
            ].map((item) => (
              <div key={item.name} className="rounded-xl border border-white/8 bg-white/4 p-5 text-center">
                <p className="text-lg font-semibold text-white">{item.name}</p>
                <p className="mt-2 text-xs text-[#9aa4cb]">{item.desc}</p>
              </div>
            ))}
          </div>
          <DocsCallout type="info">
            Premium connectors require existing subscriptions to the respective data providers.
            Integration is configured during onboarding.
          </DocsCallout>
          <div className="mt-6">
            <Button href="/#lead-form">Discuss Your Integration Needs →</Button>
          </div>
        </FadeIn>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
}
