"use client";

import { FadeIn } from "@/components/animated";
import { DocsHeading, DocsSubheading, DocsText, FeatureCard, TableOfContents } from "@/components/docs";
import { Button } from "@/components/ui";

const tocItems = [
  { id: "research-analysis", label: "Research & Analysis" },
  { id: "valuation-modeling", label: "Valuation & Modeling" },
  { id: "accounting-fpa", label: "Accounting & FP&A" },
  { id: "wealth-risk", label: "Wealth & Risk Management" },
  { id: "deal-execution", label: "Deal Execution" },
  { id: "market-intelligence", label: "Market Intelligence" },
];

const categories = [
  {
    id: "research-analysis",
    title: "Research & Analysis",
    icon: "🔍",
    desc: "Deep-dive research with sourced analysis and structured deliverables.",
    capabilities: [
      { icon: "📄", title: "Company Deep-Dives", desc: "Comprehensive company analysis covering business model, competitive position, financials, and key risks." },
      { icon: "🏢", title: "Sector Screening", desc: "Systematic sector analysis identifying market dynamics, key players, and emerging trends." },
      { icon: "⚔️", title: "Competitive Intelligence", desc: "Structured competitive landscape analysis with market share, positioning, and strategic comparison." },
      { icon: "📝", title: "Investment Memos", desc: "Thesis-driven investment memos with sourced analysis, risk framework, and recommendation." },
    ],
  },
  {
    id: "valuation-modeling",
    title: "Valuation & Modeling",
    icon: "📊",
    desc: "Structured financial models with cited assumptions and scenario analysis.",
    capabilities: [
      { icon: "💹", title: "DCF Analysis", desc: "Discounted cash flow models with detailed assumptions, sensitivity tables, and scenario outputs." },
      { icon: "🏗️", title: "LBO Models", desc: "Leveraged buyout analysis with debt structuring, returns waterfall, and exit scenario modeling." },
      { icon: "📈", title: "Comparable Analysis", desc: "Trading and transaction comps with selection methodology and valuation range synthesis." },
      { icon: "🎯", title: "Scenario Modeling", desc: "Bear/base/bull frameworks with probability-weighted outcomes and key driver sensitivity." },
    ],
  },
  {
    id: "accounting-fpa",
    title: "Accounting & FP&A",
    icon: "📋",
    desc: "Financial statement analysis, budgeting, and performance tracking.",
    capabilities: [
      { icon: "📑", title: "Financial Statement Analysis", desc: "Detailed analysis of income statements, balance sheets, and cash flow with trend identification." },
      { icon: "📊", title: "KPI Dashboards", desc: "Automated tracking of key performance indicators with variance analysis and trend reporting." },
      { icon: "💰", title: "Budget Modeling", desc: "Bottom-up budget construction with departmental allocation and variance forecasting." },
      { icon: "📉", title: "Variance Analysis", desc: "Actual vs. budget deep-dives with root cause identification and corrective recommendations." },
    ],
  },
  {
    id: "wealth-risk",
    title: "Wealth & Risk Management",
    icon: "⚖️",
    desc: "Portfolio analytics, risk assessment, and allocation optimization.",
    capabilities: [
      { icon: "🎨", title: "Portfolio Analytics", desc: "Holdings analysis with sector exposure, concentration risk, and performance attribution." },
      { icon: "🛡️", title: "Risk Assessment", desc: "Systematic risk identification and quantification across market, credit, and operational dimensions." },
      { icon: "⚙️", title: "Allocation Optimization", desc: "Strategic and tactical allocation analysis with rebalancing recommendations." },
    ],
  },
  {
    id: "deal-execution",
    title: "Deal Execution",
    icon: "🤝",
    desc: "Transaction support from screening through execution.",
    capabilities: [
      { icon: "🔎", title: "Deal Screening", desc: "Systematic opportunity screening with criteria-based filtering and preliminary analysis." },
      { icon: "📋", title: "IC Memo Support", desc: "Investment committee materials with thesis, risk analysis, and recommendation framework." },
      { icon: "📊", title: "Pitch Support", desc: "Data-driven pitch materials with market context, comparable analysis, and deal rationale." },
    ],
  },
  {
    id: "market-intelligence",
    title: "Market Intelligence",
    icon: "📡",
    desc: "Real-time market monitoring and systematic intelligence gathering.",
    capabilities: [
      { icon: "📰", title: "Morning Briefs", desc: "Daily market summary covering overnight developments, key movers, and events to watch." },
      { icon: "💼", title: "Earnings Analysis", desc: "Systematic earnings coverage with key metrics, management commentary, and guidance analysis." },
      { icon: "🌐", title: "Macro Analysis", desc: "Economic indicator tracking with market impact assessment and scenario implications." },
      { icon: "📊", title: "Sector Monitors", desc: "Ongoing sector tracking with trend identification, catalyst monitoring, and peer comparison." },
    ],
  },
];

export default function CapabilitiesPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1">
        <FadeIn>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#4fd1ff]">What Clay Can Do</p>
          <DocsHeading className="mt-4">Capabilities</DocsHeading>
          <DocsText className="mt-4 text-lg">
            Clay&apos;s 14 specialist desks are organized across six domains of financial work.
            Each capability produces structured, sourced, professional-grade deliverables.
          </DocsText>
        </FadeIn>

        {categories.map((cat, catIndex) => (
          <FadeIn key={cat.id} delay={catIndex * 0.05}>
            <DocsSubheading id={cat.id}>
              <span className="mr-2">{cat.icon}</span>{cat.title}
            </DocsSubheading>
            <DocsText>{cat.desc}</DocsText>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {cat.capabilities.map((cap) => (
                <FeatureCard key={cap.title} icon={cap.icon} title={cap.title} description={cap.desc} />
              ))}
            </div>
          </FadeIn>
        ))}

        <FadeIn delay={0.3}>
          <div className="mt-12">
            <Button href="/demo">See Clay in Action →</Button>
          </div>
        </FadeIn>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
}
