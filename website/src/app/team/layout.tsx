import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Klade Team | Founder-Led AI Analyst Deployment",
  description:
    "Meet the Klade founders leading implementation, security review, and workflow deployment for financial intelligence teams.",
  alternates: {
    canonical: "/team",
  },
  openGraph: {
    title: "Klade Team | Founder-Led AI Analyst Deployment",
    description:
      "Founder-led onboarding with direct technical visibility across product, infrastructure, and quant systems.",
    url: "https://kladeai.com/team",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klade Team | Founder-Led AI Analyst Deployment",
    description:
      "Get to know the Klade founding team and our trust-first launch process.",
  },
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
