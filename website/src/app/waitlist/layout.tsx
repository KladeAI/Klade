import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Join the Waitlist | Klade",
  description:
    "Get early access to Clay — Klade's AI analyst for finance teams. Join the waitlist for founding member pricing and priority onboarding.",
  openGraph: {
    title: "Join the Waitlist | Klade",
    description:
      "Get early access to Clay — Klade's AI analyst for finance teams.",
  },
};

export default function WaitlistLayout({ children }: { children: ReactNode }) {
  return children;
}
