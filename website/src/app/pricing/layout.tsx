import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Klade Pricing | AI Analyst Deployment Plans",
  description:
    "Review Klade pricing for credit packs, recurring subscriptions, and enterprise deployment with founder-led onboarding.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Klade Pricing | AI Analyst Deployment Plans",
    description:
      "Credit packs, subscription plans, and enterprise launch support for financial intelligence teams.",
    url: "https://kladeai.com/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klade Pricing | AI Analyst Deployment Plans",
    description:
      "See Klade pricing options for pilot, recurring, and enterprise financial analyst workflows.",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
