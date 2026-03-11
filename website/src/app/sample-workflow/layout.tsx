import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Klade Sample Workflow | Weekly Earnings Monitor",
  description:
    "See a launch-quality sample of Klade's earnings-monitor workflow from data ingest to partner-ready investment deliverables.",
  alternates: {
    canonical: "/sample-workflow",
  },
  openGraph: {
    title: "Klade Sample Workflow | Weekly Earnings Monitor",
    description:
      "Explore how Klade transforms filings and transcripts into cited, decision-ready outputs for finance teams.",
    url: "https://kladeai.com/sample-workflow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klade Sample Workflow | Weekly Earnings Monitor",
    description:
      "Walk through Klade's 4-step institutional analyst workflow and trust-first rollout posture.",
  },
};

export default function SampleWorkflowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
